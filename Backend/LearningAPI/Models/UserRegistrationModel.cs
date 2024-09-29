using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningAPI.Models
{
    public class UserRegistrationModel
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName ="nvarchar(100)")]
        public string FirstName { get; set; }
        [Column(TypeName ="nvarchar(100)")]
        public string LastName { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Email { get; set; }
        [Column(TypeName ="nvarchar(100)")]
        public string Password { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime Birthday { get; set; }

    }
}
