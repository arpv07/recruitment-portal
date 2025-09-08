using JobPortal.Data.Interfaces;
using JobPortal.Models;
using MongoDB.Driver;

namespace JobPortal.Data.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IMongoCollection<User> _users;

        public AuthRepository(AppDbContext context)
        {
            _users = context.Users;
        }

        public async Task Register(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task<User> Login(string username, string password)
        {
            return await _users.Find(u => u.Username == username && u.Password == password)
                               .FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task UpdateUser(User user)
        {
            // Replace the whole document with updated user
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }
        // Implementation of GetAllUsers
        public async Task<List<User>> GetAllUsers()
        {
            return await _users.Find(_ => true).ToListAsync();
        }
        public async Task<User> GetUserByEmail(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByPhone(string phone)
        {
            return await _users.Find(u => u.Phone == phone).FirstOrDefaultAsync();
        }

    }
}
