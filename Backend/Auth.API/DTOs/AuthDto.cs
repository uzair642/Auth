using System.ComponentModel.DataAnnotations;

namespace Auth.API.DTOs
{
    public class RegisterRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
        
        public string? FullName { get; set; }
        
        public string? CompanyName { get; set; }

        public string? PhoneNumber { get; set; }
    }

    public class LoginRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
         public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsOtpRequired { get; set; }
    }

    public class VerifyOtpRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Otp { get; set; } = string.Empty;
    }

    public class ForgotPasswordRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Otp { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }

    public class VerifyResetOtpRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Otp { get; set; } = string.Empty;
    }
}
