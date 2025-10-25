using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectManagerApi.Models
{
    public class ProjectTask
    {
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; } = false;
        
        [JsonIgnore] 
        public string DependenciesJson { get; set; } = "[]"; // <--- NEW FIELD: Stores dependency titles as JSON array
        
        // Foreign Key for the Project
        public Guid ProjectId { get; set; }
        
        [JsonIgnore] 
        public Project ParentProject { get; set; } 
    }
}