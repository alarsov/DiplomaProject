using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningAPI.Models
{
    public class ReportModel
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UploadFileModel")]
        public int FileID { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public float PercentageLearned { get; set; }

        [Required]
        public int UserId { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
