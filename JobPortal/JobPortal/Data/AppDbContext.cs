using MongoDB.Driver;
using JobPortal.Models;
using MongoDB.Driver.Core.Configuration;

namespace JobPortal.Data
{
    public class AppDbContext
    {
        private readonly IMongoDatabase _database;

        public AppDbContext(IConfiguration configuration)
        {
            Console.WriteLine(configuration.GetConnectionString("MongoDb"));
            Console.WriteLine(configuration["DatabaseName"]);
            var connectionString = configuration.GetConnectionString("MongoDb");
            MongoClientSettings settings = MongoClientSettings.FromConnectionString(connectionString);
            settings.SslSettings = new SslSettings() { CheckCertificateRevocation = false };
            var client = new MongoClient(settings);
            _database = client.GetDatabase(configuration["DatabaseName"]);
            Console.WriteLine(_database);

        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        // You can add more collections like:
        // public IMongoCollection<Role> Roles => _database.GetCollection<Role>("Roles");
    }
}
