using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

using TaskManager.Models;
using TaskManager.Data;
using TaskManager.Dtos;

namespace TaskManager.API
{
    [Route("tasks")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get() {
            var tasks = await _context.Tasks
                .AsNoTracking()
                .Select(t => new {
                    t.Id,
                    t.Title,
                    t.IsDone,
                    t.UserId
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskCreateDto dto) {
            // basic server-side validation
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            // map DTO -> entity (do not accept nested user object)
            var task = new TaskItem {
                Title = dto.Title,
                IsDone = dto.IsDone,
                // default to 1 seeded a demo user or use provided dto.UserId
                UserId = dto.UserId ?? 1
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskUpdateDto dto) {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.IsDone = dto.IsDone;
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            return task is null ? NotFound() : Ok(task);   
        }
    }
}
