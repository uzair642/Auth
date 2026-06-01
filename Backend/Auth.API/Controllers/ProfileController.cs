using Auth.API.DTOs;
using Auth.Core.Entities;
using Auth.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Auth.API.Controllers
{ 
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public ProfileController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userRepository.GetUserByIdAsync(GetUserId());
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.ProfilePictureUrl,
                user.IsOtpEnabled
            });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var user = await _userRepository.GetUserByIdAsync(GetUserId());
            if (user == null) return NotFound();

            user.FullName = request.FullName ?? user.FullName;
            if (!string.IsNullOrEmpty(request.Email))
            {
                user.Email = request.Email;
                user.UserName = request.Email;
            }

            if (request.IsOtpEnabled.HasValue)
            {
                user.IsOtpEnabled = request.IsOtpEnabled.Value;
            }

            var result = await _userRepository.UpdateUserAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { Message = "Profile updated successfully" });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var user = await _userRepository.GetUserByIdAsync(GetUserId());
            if (user == null) return NotFound();

            var isValid = await _userRepository.CheckPasswordAsync(user, request.CurrentPassword);
            if (!isValid) return BadRequest(new { Message = "Incorrect current password" });

            // Identity doesn't have a direct "ChangePassword" via User object without UserManager.
            // But since we abstracted UserManager away, we might need a specific method.
            // Wait, we need UserManager to change password. I'll just remove the old password and add a new one.
            var token = await ((Microsoft.AspNetCore.Identity.UserManager<ApplicationUser>)HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Identity.UserManager<ApplicationUser>))!)
                .GeneratePasswordResetTokenAsync(user);
            
            var result = await ((Microsoft.AspNetCore.Identity.UserManager<ApplicationUser>)HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Identity.UserManager<ApplicationUser>))!)
                .ResetPasswordAsync(user, token, request.NewPassword);

            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { Message = "Password changed successfully" });
        }

        [HttpPost("upload-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            var user = await _userRepository.GetUserByIdAsync(GetUserId());
            if (user == null) return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "No file uploaded" });

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.ProfilePictureUrl = $"/uploads/{fileName}";
            await _userRepository.UpdateUserAsync(user);

            return Ok(new { Message = "Profile picture updated", Url = user.ProfilePictureUrl });
        }

        [HttpGet("business")]
        public async Task<IActionResult> GetBusinessProfile()
        {
            var profile = await _userRepository.GetBusinessProfileAsync(GetUserId());
            if (profile == null) return Ok(null);

            return Ok(new BusinessProfileDto
            {
                Id = profile.Id,
                CompanyName = profile.CompanyName,
                Address = profile.Address,
                TaxNumber = profile.TaxNumber,
                PhoneNumber = profile.PhoneNumber,
                LogoUrl = profile.LogoUrl
            });
        }

        [HttpPut("business")]
        public async Task<IActionResult> UpdateBusinessProfile([FromBody] BusinessProfileDto request)
        {
            var userId = GetUserId();
            var profile = await _userRepository.GetBusinessProfileAsync(userId);

            if (profile == null)
            {
                profile = new BusinessProfile
                {
                    ApplicationUserId = userId,
                    CompanyName = request.CompanyName,
                    Address = request.Address,
                    TaxNumber = request.TaxNumber,
                    PhoneNumber = request.PhoneNumber
                };
            }
            else
            {
                profile.CompanyName = request.CompanyName;
                profile.Address = request.Address;
                profile.TaxNumber = request.TaxNumber;
                profile.PhoneNumber = request.PhoneNumber;
            }

            await _userRepository.UpdateBusinessProfileAsync(profile);
            return Ok(new { Message = "Business profile updated successfully" });
        }

        [HttpPost("business/upload-logo")]
        public async Task<IActionResult> UploadBusinessLogo(IFormFile file)
        {
            var userId = GetUserId();
            var profile = await _userRepository.GetBusinessProfileAsync(userId);
            
            if (profile == null)
            {
                // Create a basic profile if it doesn't exist
                profile = new BusinessProfile { ApplicationUserId = userId };
            }

            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "No file uploaded" });

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "business");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            profile.LogoUrl = $"/uploads/business/{fileName}";
            await _userRepository.UpdateBusinessProfileAsync(profile);

            return Ok(new { Message = "Business logo updated", Url = profile.LogoUrl });
        }
    }
}
