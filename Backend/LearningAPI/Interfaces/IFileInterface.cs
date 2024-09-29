using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace LearningAPI.Interfaces
{
    public interface IFileInterface
    {
        Task<IActionResult> UploadContent(List<UploadRequestModel> data, int userID);
        Task<IActionResult> ReadFromFile(List<IFormFile> file);
        Task<IActionResult> GetMaterials(int userIntId);
    }
}
