using System.Security.Claims;

namespace ProjectManagerApi.Helpers
{
    public static class ClaimsPrincipalExtensions
    {
        t
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
            
         
            if (string.IsNullOrEmpty(userIdClaim))
            {
                userIdClaim = user.FindFirstValue("sub");
            }
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new InvalidOperationException("User ID not found in token.");
            }
            
            return userId;
        }
    }
}