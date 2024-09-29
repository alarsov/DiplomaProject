using System.Security.Claims;

namespace LearningAPI.Helpers
{
    public static class UserClaimsHelper
    {
        public static int GetUserIdFromClaims(HttpContext httpContext)
        {
            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                throw new UnauthorizedAccessException("Invalid token");
            }
            return int.Parse(userIdClaim);
        }
    }
}
