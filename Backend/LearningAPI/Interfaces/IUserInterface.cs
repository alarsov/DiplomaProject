using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace LearningAPI.Interfaces
{
    public interface IUserInterface
    {
        Task<IActionResult> RegisterUserAsync(UserRegistrationModel model);
        Task<IActionResult> LoginUser(UserLoginModel model);
        Task<IActionResult> GetUserInfo(int userIntId);
        Task<bool> ConfirmEmail(int id);
        Task<IActionResult> SendResetPassword(string email);
        Task<IActionResult> SavePasswordChange(PswChangeModel model);
        Task<IActionResult> SaveProfileInfo(UserInfoModel model);
        string GenerateJwtToken(int userId);
    }
}
