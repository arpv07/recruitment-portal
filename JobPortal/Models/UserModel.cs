using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JobPortal.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("FullName")]
        public string FullName { get; set; }

        [BsonElement("Email")]
        public string Email { get; set; }

        [BsonElement("Phone")]
        public string Phone { get; set; }

        [BsonElement("LinkedInUrl")]
        public string LinkedInUrl { get; set; }

        [BsonElement("Location")]
        public string Location { get; set; }

        [BsonElement("Username")]
        public string Username { get; set; }

        [BsonElement("Password")]
        public string Password { get; set; }

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
         public string Role { get; set; }
    }
}
