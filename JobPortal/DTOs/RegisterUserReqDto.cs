using System.ComponentModel.DataAnnotations;
namespace JobPortal.DTOs
{
    public class RegisterUserReqDto
    {
        [Required(ErrorMessage = "Full Name is required")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone is required")]
        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Not a valid Phone No.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "LinkedInUrl is required")]
        public string LinkedInUrl { get; set; }

        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
        public string Password { get; set; }
    }
}
//form user sent info fro frontend