using System.ComponentModel.DataAnnotations;

namespace ProjectManagerApi.Models
{
    public class Project
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

       
        public Guid UserId { get; set; }
        
        public User Owner { get; set; }

        public List<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    }
}