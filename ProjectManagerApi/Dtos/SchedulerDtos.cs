using System.ComponentModel.DataAnnotations;

namespace ProjectManagerApi.Dtos
{
  
    public class ScheduleTaskInput
    {
        [Required]
        public string Title { get; set; }
        
        [Required]
        [Range(1, 100)] 
        public int EstimatedHours { get; set; }
        
       
        public DateTime DueDate { get; set; }
        
        public List<string> Dependencies { get; set; } = new List<string>();
    }

   
    public class ScheduleRequest
    {
        [Required]
        public List<ScheduleTaskInput> Tasks { get; set; }
    }

    public class ScheduleResponse
    {
        public List<string> RecommendedOrder { get; set; }
    }
}