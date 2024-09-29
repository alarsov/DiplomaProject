using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class QuizDataModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public List<string> SelectedMaterials { get; set; }

        [Required]
        public int NumQuestions { get; set; }

        [Required]
        public int Score { get; set; }

        [Required]
        public int TimeTaken { get; set; }

        [Required]
        public int UserId { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
