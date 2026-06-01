using Auth.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Auth.Infrastructure.Services
{
    public class SmtpEmailService : IOtpService
    {
        private readonly IConfiguration _config;

        public SmtpEmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpEmailAsync(string email, string otp)
        {
            var host = _config["Smtp:Host"];
            var port = int.Parse(_config["Smtp:Port"] ?? "587");
            var user = _config["Smtp:Username"];
            var pass = _config["Smtp:Password"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass))
            {
                // In development, if SMTP is not configured, we'll just log it to console or ignore.
                Console.WriteLine($"[Mock Email] To: {email}, OTP: {otp}");
                return;
            }

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, pass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(user),
                Subject = "Your Login OTP",
                Body = $"Your OTP code is {otp}. It is valid for 10 minutes.",
                IsBodyHtml = false,
            };
            mailMessage.To.Add(email);

            try
            {
                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SMTP Failed] Error sending OTP: {ex.Message}");
                Console.WriteLine($"[Mock Email] To: {email}, OTP: {otp}");
            }
        }

        public string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        // Simple mock implementation for demo. In production, store OTP in DB or Redis with expiry.
        public bool ValidateOtp(string userId, string otp)
        {
            // For now, any OTP is valid for the sake of the beginner friendly demo
            // In a real system, you'd look it up from a cache
            return !string.IsNullOrEmpty(otp) && otp.Length == 6; 
        }
    }
}
