namespace Auth.API.DTOs
{
    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public bool? IsOtpEnabled { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class BusinessProfileDto
    {
        public int Id { get; set; }
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        public string? TaxNumber { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LogoUrl { get; set; }
    }
}
