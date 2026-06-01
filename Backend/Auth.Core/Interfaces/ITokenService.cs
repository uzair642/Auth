using Auth.Core.Entities;

namespace Auth.Core.Interfaces
{
    public interface ITokenService
    {
        string GenerateJwtToken(ApplicationUser user, string role);
    }
}
