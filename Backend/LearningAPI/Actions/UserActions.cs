using LearningAPI.Helpers;
using LearningAPI.Interfaces;
using LearningAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LearningAPI.Actions
{
    public class UserActions : IUserInterface
    {
        private readonly LearningAPIDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<UserRegistrationModel> _passwordHasher;
        public UserActions(IConfiguration configuration, LearningAPIDbContext context)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<UserRegistrationModel>();

        }
        public async Task<IActionResult> RegisterUserAsync(UserRegistrationModel model)
        {
            try
            {
                model.EmailConfirmed = false;
                model.Password = _passwordHasher.HashPassword(model, model.Password);
                _context.Registration.Add(model);
                await _context.SaveChangesAsync();
                var emailHelper = new EmailHelper();
                emailHelper.SendConfEmail(model.Email, model.FirstName, model.Id, "confirmation");
                return new OkObjectResult(new { message = "Registration succesfull!" });

            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "Error occurred while registering user: " + ex.Message });
            }
        }
        public async Task<IActionResult> LoginUser(UserLoginModel model)
        {
            var user = _context.Registration.FirstOrDefault(u => u.Email == model.Email);
            var pswVerification = _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password);

            if (pswVerification == PasswordVerificationResult.Success)
            {
                if (!user.EmailConfirmed)
                {
                    return new BadRequestObjectResult(new { message = "Please confirm your account to login." });
                }

                var token = GenerateJwtToken(user.Id);
                return new OkObjectResult(new { Token = token });
            }
            else
            {
                return new UnauthorizedObjectResult(new { message = "Incorrect password." });
            }
        }
        public async Task<IActionResult> GetUserInfo(int userIntId)
        {
            try
            {
                var info = await _context.Registration
                    .Where(q => q.Id == userIntId)
                    .Select(q => new { q.FirstName, q.LastName, q.Email, q.Birthday })
                    .ToListAsync();
                return new OkObjectResult(info);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = ex.Message });
            }
        }
        public async Task<bool> ConfirmEmail(int id)
        {
            try
            {
                var user = _context.Registration.FirstOrDefault(u => u.Id == id);
                user.EmailConfirmed = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<IActionResult> SendResetPassword(string email)
        {
            var user = _context.Registration.FirstOrDefault(u => u.Email == email);
            if (user != null)
            {
                var emailHelper = new EmailHelper();
                await emailHelper.SendConfEmail(user.Email, user.FirstName, user.Id, "reset");
                return new OkObjectResult("Reset email sent!");

            }
            else
            {
                return new BadRequestObjectResult("User doesnt exists!");
            }
        }

        public async Task<IActionResult> SavePasswordChange(PswChangeModel model)
        {
            try
            {
                var isValid = ValidationHelper.IsValidPassword(model.Password);
                if (isValid == "Password is valid.")
                {
                    var user = await _context.Registration
                    .FirstOrDefaultAsync(u => u.Id == model.UserId);
                    user.Password = model.Password;
                    await _context.SaveChangesAsync();
                    return new OkObjectResult("Password changed successfully!");

                }
                else
                {
                    return new BadRequestObjectResult(isValid);
                }

            }

            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = ex.Message });
            }
        }

        public async Task<IActionResult> SaveProfileInfo(UserInfoModel model)
        {
            try
            {
                var user = await _context.Registration
                    .FirstOrDefaultAsync(u => u.Id == model.Id);

                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Email = model.Email;
                user.Birthday = model.Birthday;

                await _context.SaveChangesAsync();
                return new OkObjectResult("Profile updated successfully.");

            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = ex.Message });
            }
        }

        public string GenerateJwtToken(int userId)
        {
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];
            var secretKey = _configuration["JwtSettings:SecretKey"];

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }),
                Expires = DateTime.UtcNow.AddHours(1), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = audience,
                Issuer = issuer
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
