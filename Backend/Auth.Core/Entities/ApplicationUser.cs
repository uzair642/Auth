using Microsoft.AspNetCore.Identity;
using System;

namespace Auth.Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public bool IsOtpEnabled { get; set; }
        
        // Navigation Properties
        public BusinessProfile? BusinessProfile { get; set; }
    }
}
