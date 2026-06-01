using System;
using System.Text.Json.Serialization;

namespace Auth.Core.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal RegularPrice { get; set; }
        public decimal SalePrice { get; set; }
        public bool IsActive { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        
        [JsonIgnore]
        public string ApplicationUserId { get; set; } = string.Empty;
        [JsonIgnore]
        public ApplicationUser? ApplicationUser { get; set; }
    }
}
