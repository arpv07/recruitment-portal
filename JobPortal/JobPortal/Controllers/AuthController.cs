using JobPortal.Models;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Business.Interfaces;
using JobPortal.DTOs;
using JobPortal.Helper; // For AuthHelper
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace JobPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        // Register API
       
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserReqDto userDto)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Automatically returns validation errors
            }

            // Check for unique username
            var existingUsername = await _authService.GetUserByUsername(userDto.Username);
            if (existingUsername != null)
                return BadRequest("Username is already taken");

            // Check for unique email
            var existingEmail = await _authService.GetUserByEmail(userDto.Email);
            if (existingEmail != null)
                return BadRequest("Email is already registered");

            //  Check for unique phone number (if provided)
            if (!string.IsNullOrWhiteSpace(userDto.Phone))
            {
                var existingPhone = await _authService.GetUserByPhone(userDto.Phone);
                if (existingPhone != null)
                    return BadRequest("Phone number is already registered");
            }

            // Check if this is the first user
            var allUsers = await _authService.GetAllUsers();
            string role = allUsers.Count == 0 ? "SuperAdmin" : "User";

            // Create new user
            User userObj = new User
            {
                Username = userDto.Username,
                Password = userDto.Password, 
                FullName = userDto.FullName,
                Email = userDto.Email,
                Phone = userDto.Phone,
                LinkedInUrl = userDto.LinkedInUrl,
                Location = userDto.Location,
                Role = role,
                CreatedAt = DateTime.UtcNow
            };

            await _authService.Register(userObj);

            //  Generate token
            var token = AuthHelper.GenerateJwtToken(userObj, _configuration);

            return Ok(new
            {
                message = $"User registered successfully with role '{role}'",
                token,
                user = new
                {
                    userObj.FullName,
                    userObj.Email,
                    userObj.Phone,
                    userObj.LinkedInUrl,
                    userObj.Location,
                    userObj.Role,
                    userObj.CreatedAt
                }
            });
        }

        // Login API
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserReqDto loginDto)
        {
            if (loginDto == null ||
                string.IsNullOrWhiteSpace(loginDto.Username) ||
                string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest("Username and password are required");
            }

            var user = await _authService.Login(loginDto.Username, loginDto.Password);
            Console.WriteLine("LOGIN {0}", user);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            //  Generate JWT Token
            var token = AuthHelper.GenerateJwtToken(user, _configuration);
            Console.WriteLine(token);
            return Ok(new
            {
                message = "Login successful",
                token,
                user = new
                {
                    user.FullName,
                    user.Email,
                    user.Phone,
                    user.LinkedInUrl,
                    user.Location,
                    user.CreatedAt
                }
            });
        }
        [HttpPost("add-role")]
        [Authorize(Roles = "SuperAdmin")] // Only SuperAdmin can access
        public async Task<IActionResult> AddRole([FromBody] AssignRoleDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Role))
                return BadRequest("Username and Role are required");

            var user = await _authService.GetUserByUsername(dto.Username);
            if (user == null)
                return NotFound("User not found");

            if (user.Role == dto.Role)
              return Ok(new { message = $"User '{user.Username}' already has role '{dto.Role}'" });
        
            user.Role = dto.Role;
            await _authService.UpdateUser(user);

            return Ok(new { message = $"Role '{dto.Role}' assigned to {user.Username} successfully" });
        }

        [HttpPost("assign-role")]
        [Authorize(Roles = "Admin,SuperAdmin")] // Admins & SuperAdmin
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Role))
                return BadRequest("Username and Role are required");

            var user = await _authService.GetUserByUsername(dto.Username);
            if (user == null)
                return NotFound("User not found");

            // Admin cannot assign SuperAdmin role
            if (dto.Role == "SuperAdmin")
                return Unauthorized("Cannot assign SuperAdmin role");

            user.Role = dto.Role;
            await _authService.UpdateUser(user);

            return Ok(new { message = $"Role '{dto.Role}' assigned to {user.Username} successfully" });
        }


        [HttpPost("apply")]
        [Authorize(Roles = "User,SuperAdmin")] //  Only Users can access
        public IActionResult Apply()
        {
            return Ok(new { message = "Application submitted successfully", user = User.Identity.Name });
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin,SuperAdmin")] // Only Admins can access
        public IActionResult Dashboard()
        {
            return Ok(new { message = "Welcome to Admin Dashboard", user = User.Identity.Name });
        }
        

    }
}
