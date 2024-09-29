using LearningAPI.Interfaces;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;
using System.Text;
using Microsoft.AspNetCore.Http;
using EllipticCurve.Utils;
using Microsoft.Extensions.ObjectPool;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using LearningAPI.Helpers;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserInterface _userInterface;

        public UserController(IUserInterface userInterface)
        {
            _userInterface = userInterface;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(UserRegistrationModel model)
        {
            return await _userInterface.RegisterUserAsync(model);
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(UserLoginModel model)
        {
            return await _userInterface.LoginUser(model);

        }

        [Authorize]
        [HttpGet]
        [Route("getUserInfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            int userId = UserClaimsHelper.GetUserIdFromClaims(HttpContext);
            var result = await _userInterface.GetUserInfo(userId);
            return Ok(result);
        }

        [HttpPost]
        [Route("confirmEmail/{id}")]
        public async Task<IActionResult> ConfirmEmail(int id)
        {
            var result = await _userInterface.ConfirmEmail(id);
            if (!result)
            {
                return BadRequest(new { message = "Email confirmation failed" });
            }
            return Ok(new { message = "Email confirmed successfully" });
        }

        [HttpPost]
        [Route("sendResetEmail/{email}")]
        public async Task<IActionResult> SendResetPassword(string email)
        {
            await _userInterface.SendResetPassword(email);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("savePasswordEdit")]
        public async Task<IActionResult> SavePasswordChange([FromBody] PswChangeModel model)
        {
            if (model.UserId == null)
            {    
                model.UserId = UserClaimsHelper.GetUserIdFromClaims(HttpContext);
            }
            await _userInterface.SavePasswordChange(model);
            return Ok();

        }

        [Authorize]
        [HttpPost]
        [Route("saveProfileEdit")]
        public async Task<IActionResult> SaveProfileInfo(UserInfoModel model)
        {
            model.Id = UserClaimsHelper.GetUserIdFromClaims(HttpContext);
            await _userInterface.SaveProfileInfo(model);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("refreshToken")]
        public IActionResult RefreshToken()
        {
            int userId = UserClaimsHelper.GetUserIdFromClaims(HttpContext);
            var newToken = _userInterface.GenerateJwtToken(userId);
            return Ok(new { token = newToken });
        }

        [Authorize] 
        [HttpGet]
        [Route("verifyToken")]
        public IActionResult VerifyToken()
        {
            return Ok();
        }
    }
}
