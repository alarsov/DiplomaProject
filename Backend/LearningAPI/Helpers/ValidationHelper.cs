using System.Text.RegularExpressions;

namespace LearningAPI.Helpers
{
    public static class ValidationHelper
    {
        public static bool IsValidEmail(string email)
        {
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }
        public static string IsValidPassword(string password)
        {
            int minLength = 8;
            bool hasUpperCase = false;
            bool hasLowerCase = false;
            bool hasNumber = false;

            if (password.Length < minLength)
            {
                return "Password must be at least " + minLength + " characters long.";
            }

            foreach (char c in password)
            {
                if (char.IsUpper(c))
                {
                    hasUpperCase = true;
                }
                else if (char.IsLower(c))
                {
                    hasLowerCase = true;
                }
                else if (char.IsDigit(c))
                {
                    hasNumber = true;
                }
            }
            if (!hasUpperCase)
            {
                return "Password must contain at least one uppercase letter.";
            }
            if (!hasLowerCase)
            {
                return "Password must contain at least one lowercase letter.";
            }
            if (!hasNumber)
            {
                return "Password must contain at least one digit.";
            }
            return "Password is valid.";
        }

    }
}
