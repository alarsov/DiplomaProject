using SendGrid.Helpers.Mail;
using SendGrid;

namespace LearningAPI.Helpers
{
    public class EmailHelper
    {
        public async Task SendConfEmail(string email, string firstName, int id, string emailType)
        {

            var configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();
            string apiKey = configuration["SendGrid:ApiKey"];

            string htmlPath = string.Empty;
            string subject = string.Empty;
            string link = string.Empty;

            if (emailType == "confirmation")
            {
                htmlPath = @"C:\repos\LearningAI\LearningAPI\LearningAPI\EmailTemplates\ConfAccount.html";
                subject = "Email Confirmation";
                link = $"http://localhost:3000/emailConfirmed/{id}";

            }
            else
            {
                htmlPath = @"C:\repos\LearningAI\LearningAPI\LearningAPI\EmailTemplates\ResetPassword.html";
                subject = "Password Reset";
                link = $"http://localhost:3000/passwordChange/{id}";
            }

            var emailTemplate = await File.ReadAllTextAsync(htmlPath);
            var emailBody = emailTemplate.Replace("{{name}}", firstName).Replace("{{confLink}}", link);
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("aca.arsov@gmail.com", "LearningAI");
            var to = new EmailAddress(email);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, " ", emailBody);
            var response = await client.SendEmailAsync(msg);

        }

    }
}
