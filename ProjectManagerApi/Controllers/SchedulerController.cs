using Microsoft.AspNetCore.Mvc;
using ProjectManagerApi.Dtos;
using ProjectManagerApi.Services;
using Microsoft.EntityFrameworkCore;
using ProjectManagerApi.Data;
using Microsoft.AspNetCore.Authorization;
using ProjectManagerApi.Helpers;
using System.Security.Claims;

namespace ProjectManagerApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class SchedulerController : ControllerBase
    {
        private readonly ISchedulerService _schedulerService;
        private readonly ApplicationDbContext _context;

        public SchedulerController(ISchedulerService schedulerService, ApplicationDbContext context)
        {
            _schedulerService = schedulerService;
            _context = context;
        }

        [HttpPost("projects/{projectId}/schedule")]
        public async Task<IActionResult> GenerateSchedule(Guid projectId)
        {
            Guid userId;
            try
            {
                userId = User.GetUserId();
            }
            catch (InvalidOperationException)
            {
                return Unauthorized("Invalid authorization token.");
            }

            var projectExists = await _context.Projects
                .AnyAsync(p => p.Id == projectId && p.UserId == userId);

            if (!projectExists)
            {
                return NotFound("Project not found or you do not have permission.");
            }

            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();

            if (!tasks.Any())
            {
                return BadRequest(new { error = "No tasks found in this project to schedule." });
            }

            try
            {
                var response = _schedulerService.GenerateSchedule(tasks);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An unexpected server error occurred during scheduling." });
            }
        }
    }
}
