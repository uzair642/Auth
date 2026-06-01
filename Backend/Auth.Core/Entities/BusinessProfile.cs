using System;

namespace Auth.Core.Entities
{
    public class BusinessProfile
    {
        public int Id { get; set; }
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        public string? TaxNumber { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LogoUrl { get; set; }
        
        public string ApplicationUserId { get; set; } = string.Empty;
        public ApplicationUser? ApplicationUser { get; set; }
    }
}
