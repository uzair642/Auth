using System.Threading.Tasks;

namespace Auth.Core.Interfaces
{
    public interface IOtpService
    {
        Task SendOtpEmailAsync(string email, string otp);
        string GenerateOtp();
        bool ValidateOtp(string userId, string otp);
    }
}
