using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningAPI.Models
{
    public class UploadFileModel
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string FileContent { get; set; }

        public string SummarizedContent { get; set; }

        [ForeignKey("UserRegistrationModel")]
        public int UserID { get; set; }

        public string FileName { get; set; }
    }
}
