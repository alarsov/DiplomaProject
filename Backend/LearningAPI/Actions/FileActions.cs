using LearningAPI.Helpers;
using LearningAPI.Interfaces;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningAPI.Actions
{
    public class FileActions : IFileInterface
    {
        private readonly LearningAPIDbContext _context;

        public FileActions(LearningAPIDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> UploadContent(List<UploadRequestModel> data, int userID)
        {
            try
            {
                foreach (var item in data)
                {
                    var uploadFile = new UploadFileModel
                    {
                        FileContent = item.FileContents,
                        SummarizedContent = item.Summaries,
                        FileName = item.FileName,
                        UserID = userID
                    };
                    _context.UploadFiles.Add(uploadFile);

                }

                await _context.SaveChangesAsync();
                return new OkObjectResult("Uploaded");

            }
            catch (Exception ex)
            {
                return new StatusCodeResult(500);
            }

        }
        public async Task<IActionResult> ReadFromFile(List<IFormFile> files)
        {
            var extractedTexts = new List<string>();
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);
                        memoryStream.Position = 0;
                        string extractedText;

                        if (file.ContentType == "application/pdf")
                        {
                            extractedText = ContentExtractionHelper.ExtractTextFromPdf(memoryStream);
                        }
                        else if (file.ContentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                        {
                            extractedText = ContentExtractionHelper.ExtractTextFromDocx(memoryStream);
                        }
                        else
                        {
                            return new BadRequestObjectResult($"Unsupported file type: {file.ContentType}");
                        }

                        extractedTexts.Add(extractedText);
                    }
                }
            }
            return new OkObjectResult(extractedTexts);
        }
        public async Task<IActionResult> GetMaterials(int userID)
        {
            var materials = await _context.UploadFiles
                .Where(file => file.UserID == userID)
                .Select(file => new { file.ID, file.FileName, file.FileContent, file.SummarizedContent })
                .ToListAsync();

            return new OkObjectResult(materials);
        }
    }
}
