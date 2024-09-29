using LearningAPI.Interfaces;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningAPI.Actions
{
    public class AssesmentActions : IAssesmentInterface
    {
        private readonly LearningAPIDbContext _context;

        public AssesmentActions(LearningAPIDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> SaveQuizData(QuizDataModel model)
        {
            try
            {
                model.Timestamp = DateTime.Now;
                _context.QuizResult.Add(model);
                await _context.SaveChangesAsync();
                return new OkObjectResult("Quiz results saved successfully!");
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = ex.Message });
            }

        }
        public async Task<IActionResult> SaveReport(ReportModel model)
        {
            try
            {
                model.Timestamp = DateTime.Now;
                _context.ReportResult.Add(model);
                await _context.SaveChangesAsync();
                return new OkObjectResult("Uploaded");
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(500);
            }
        }
        public async Task<IActionResult> GetQuizData(string fileName)
        {
            try
            {
                var result = await _context.QuizResult.ToListAsync();

                var filteredResult = result.Where(q => q.SelectedMaterials.Contains(fileName)).ToList();

                return new OkObjectResult(filteredResult);

            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = ex.Message });
            }
        }

        public async Task<IActionResult> GetReportData(int fileId)
        {
            try
            {
                var result = await _context.ReportResult
                    .Where(q => q.FileID == fileId)
                    .ToListAsync();
                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = ex.Message });
            }
        }
    }
}
