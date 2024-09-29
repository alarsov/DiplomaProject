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
    public class FileController : ControllerBase
    {
        private readonly IFileInterface _file;
        
        public FileController(IFileInterface file)
        {
            _file = file;
        }

        [Authorize]
        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> UploadContent([FromBody] List<UploadRequestModel> data)
        {
            
            int userIntId = UserClaimsHelper.GetUserIdFromClaims(HttpContext);
            var result = await _file.UploadContent(data, userIntId);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [Route("read")]
        public async Task<IActionResult> ReadFromFile(List<IFormFile> files)
        {
            var results = await _file.ReadFromFile(files);
            return Ok(results);

        }

        [Authorize]
        [HttpGet]
        [Route("getMaterials")]
        public async Task<IActionResult> GetMaterials()
        {
            int userIntId = UserClaimsHelper.GetUserIdFromClaims(HttpContext);
            var result = await _file.GetMaterials(userIntId);
            return Ok(result);
        }
    }
}
