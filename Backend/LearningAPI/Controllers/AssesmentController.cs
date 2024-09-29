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
    public class AssesmentController : ControllerBase
    {
        private readonly IAssesmentInterface _assesment;
        
        public AssesmentController(IAssesmentInterface assesment)
        {
            _assesment = assesment;
        }

        [Authorize]
        [HttpPost]
        [Route("saveQuizData")]
        public async Task<IActionResult> SaveQuizData([FromBody] QuizDataModel model)
        {
            model.UserId = UserClaimsHelper.GetUserIdFromClaims(HttpContext); 
            var result = await _assesment.SaveQuizData(model);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [Route("saveReport")]
        public async Task<IActionResult> SaveReport([FromBody] ReportModel model)
        {
            model.UserId = UserClaimsHelper.GetUserIdFromClaims(HttpContext);
            var result = await _assesment.SaveReport(model);
            return Ok(result);

        }

        [Authorize]
        [HttpGet]
        [Route("getQuizResults/{fileName}")]
        public async Task<IActionResult> GetQuizData(string fileName)
        {
            var result = await _assesment.GetQuizData(fileName);
            return Ok(result);
        }

        [Authorize]
        [HttpGet]
        [Route("getLearnedData/{fileId}")]
        public async Task<IActionResult> GetReportData(int fileId)
        {
            var result = await _assesment.GetReportData(fileId);
            return Ok(result);
        }


    }
}
