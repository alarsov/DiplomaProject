using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace LearningAPI.Interfaces
{
    public interface IAssesmentInterface
    {
        Task<IActionResult> SaveQuizData(QuizDataModel model);
        Task<IActionResult> SaveReport(ReportModel model);
        Task<IActionResult> GetQuizData(string fileName);
        Task<IActionResult> GetReportData(int fileId);
    }
}
