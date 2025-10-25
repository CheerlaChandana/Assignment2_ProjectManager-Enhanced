using System.Text.Json.Serialization;

namespace ProjectManagerApi.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }

        [JsonIgnore] 
        public string PasswordHash { get; set; }

        
        public List<Project> Projects { get; set; } = new List<Project>();
    }
}