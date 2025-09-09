using JobPortal.Business.Interfaces;
using JobPortal.Services;
using JobPortal.Data.Interfaces;
using JobPortal.Data.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace JobPortal.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddJobPortalServices(this IServiceCollection services)
        {
            // Register Services (Business Layer)
            services.AddScoped<IAuthService, AuthService>();

            // Register Repositories (Data Layer)
            services.AddScoped<IAuthRepository, AuthRepository>();

            return services;
        }
    }
}
