using JobPortal.Models;

namespace JobPortal.Business.Interfaces
{
    public interface IAuthService
    {
        Task Register(User user);
        Task<User> Login(string username, string password);
        Task<User> GetUserByUsername(string username);
        Task UpdateUser(User user);
        Task<List<User>> GetAllUsers();
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserByPhone(string phone);

    }
}
