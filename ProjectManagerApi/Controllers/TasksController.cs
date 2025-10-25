using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagerApi.Data;
using ProjectManagerApi.Dtos;
using ProjectManagerApi.Models;
using ProjectManagerApi.Helpers;
using System.Security.Claims;

namespace ProjectManagerApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task<bool> UserOwnsTask(Guid taskId)
        {
            var userId = User.GetUserId();
            var task = await _context.Tasks
                .Include(t => t.ParentProject)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            return task != null && task.ParentProject.UserId == userId;
        }

        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(Guid taskId, [FromBody] UpdateTaskDto taskDto)
        {
            if (!await UserOwnsTask(taskId))
            {
                return Forbid();
            }

            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null)
            {
                return NotFound();
            }

            task.Title = taskDto.Title;
            task.DueDate = taskDto.DueDate;
            task.IsCompleted = taskDto.IsCompleted;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(Guid taskId)
        {
            if (!await UserOwnsTask(taskId))
            {
                return Forbid();
            }

            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
