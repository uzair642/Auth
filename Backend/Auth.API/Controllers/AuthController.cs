using Auth.API.DTOs;
using Auth.Core.Entities;
using Auth.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Auth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly IOtpService _otpService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(IUserRepository userRepository, ITokenService tokenService, IOtpService otpService, UserManager<ApplicationUser> userManager)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _otpService = otpService;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
                return BadRequest(new { Message = "User already exists" });

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                IsOtpEnabled = true // Enable OTP by default for this example
            };

            var result = await _userRepository.CreateUserAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Create BusinessProfile if CompanyName is provided
            if (!string.IsNullOrEmpty(request.CompanyName))
            {
                await _userRepository.UpdateBusinessProfileAsync(new BusinessProfile
                {
                    ApplicationUserId = user.Id,
                    CompanyName = request.CompanyName
                });
            }

            // In a real application, you might add default roles here
            return Ok(new { Message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized(new { Message = "Invalid credentials" });

            var isPasswordValid = await _userRepository.CheckPasswordAsync(user, request.Password);
            if (!isPasswordValid)
                return Unauthorized(new { Message = "Invalid credentials" });

            if (user.IsOtpEnabled)
            {
                var otp = _otpService.GenerateOtp();
                await _otpService.SendOtpEmailAsync(user.Email!, otp);
                
                return Ok(new AuthResponse { 
                    Message = "OTP sent to your email",
                    IsOtpRequired = true
                });
            }

            var token = _tokenService.GenerateJwtToken(user, "User");
            return Ok(new AuthResponse { Token = token, Message = "Login successful", IsOtpRequired = false });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized(new { Message = "Invalid user" });

            var isValid = _otpService.ValidateOtp(user.Id, request.Otp);
            if (!isValid)
                return BadRequest(new { Message = "Invalid OTP" });

            var token = _tokenService.GenerateJwtToken(user, "User");
            return Ok(new AuthResponse { Token = token, Message = "OTP verified, login successful", IsOtpRequired = false });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null)
                return Ok(new { Message = "If that email is registered, an OTP has been sent." }); // Prevent email enumeration

            var otp = _otpService.GenerateOtp();
            await _otpService.SendOtpEmailAsync(user.Email!, otp);

            return Ok(new { Message = "If that email is registered, an OTP has been sent." });
        }

        [HttpPost("verify-reset-otp")]
        public async Task<IActionResult> VerifyResetOtp([FromBody] VerifyResetOtpRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null)
                return BadRequest(new { Message = "Invalid OTP or Email" });

            var isValid = _otpService.ValidateOtp(user.Id, request.Otp);
            if (!isValid)
                return BadRequest(new { Message = "Invalid OTP" });

            return Ok(new { Message = "OTP verified" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email);
            if (user == null)
                return BadRequest(new { Message = "Invalid request" });

            var isValid = _otpService.ValidateOtp(user.Id, request.Otp);
            if (!isValid)
                return BadRequest(new { Message = "Invalid OTP" });

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "Password reset successfully" });
        }
    }
}
