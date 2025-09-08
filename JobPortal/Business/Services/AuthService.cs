using JobPortal.Business.Interfaces;
using JobPortal.Data.Interfaces;
using JobPortal.Models;

namespace JobPortal.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;

        public AuthService(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task Register(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await _authRepository.Register(user);
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _authRepository.GetUserByUsername(username);
            if (user == null)
                return null;

            // Verify hashed password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
            return isPasswordValid ? user : null;
        }


        public async Task<User> GetUserByUsername(string username)
        {
            return await _authRepository.GetUserByUsername(username);
        }

        public async Task UpdateUser(User user)
        {
            await _authRepository.UpdateUser(user);
        }
        public async Task<List<User>> GetAllUsers()
        {
            return await _authRepository.GetAllUsers();
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _authRepository.GetUserByEmail(email);
        }

        public async Task<User> GetUserByPhone(string phone)
        {
            return await _authRepository.GetUserByPhone(phone);
        }

    }
}
