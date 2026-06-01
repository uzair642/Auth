using Auth.Core.Entities;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Auth.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<ApplicationUser?> GetUserByIdAsync(string userId);
        Task<ApplicationUser?> GetUserByEmailAsync(string email);
        Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password);
        Task<IdentityResult> UpdateUserAsync(ApplicationUser user);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string role);
        Task<BusinessProfile?> GetBusinessProfileAsync(string userId);
        Task UpdateBusinessProfileAsync(BusinessProfile profile);
    }
}
