using System.Text;
using JobPortal;
using JobPortal.Business.Interfaces;
using JobPortal.Data.Interfaces;
using JobPortal.Data.Repositories;
using JobPortal.Services;
using JobPortal.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using JobPortal.Extensions;
using JobPortal.Configurations;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

// Register custom services BEFORE Build()
builder.Services.AddSingleton<AppDbContext>();
// builder.Services.AddScoped<IAuthRepository, AuthRepository>();
// builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddJobPortalServices();
builder.Services.AddCors(options =>
{
options.AddPolicy("AllowReactApp", policy =>
{
    policy.WithOrigins("http://localhost:5173") // React dev server
    .AllowAnyHeader()
    .AllowAnyMethod();
    });
});
 
builder.Services.AddSwaggerConfiguration();

// Configure Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ClockSkew = TimeSpan.Zero
    };
});

// Configure Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseCors("AllowReactApp");

app.Run();

