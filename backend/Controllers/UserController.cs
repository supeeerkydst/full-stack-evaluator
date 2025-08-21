using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.API {
    [Route("users")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly ApplicationDbContext _context;
        public UsersController(ApplicationDbContext context) => _context = context;

        // GET /users
        [HttpGet]
        public async Task<IActionResult> Get() {
            var users = await _context.Users
                .AsNoTracking()
                .Select(u => new { u.Id, u.Email }) // don't leak PasswordHash
                .ToListAsync();

            return Ok(users);
        }

        // GET /users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) {
            var user = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new { u.Id, u.Email })
                .FirstOrDefaultAsync();

            return user is null ? NotFound() : Ok(user);
        }

        // POST /users - for email and hashed password, but never retun hashed passwords
        public record UserCreateDto(string Email, string PasswordHash);

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateDto dto) {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            var user = new User { Email = dto.Email, PasswordHash = dto.PasswordHash };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // return only safe shape
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new { user.Id, user.Email });
        }

        // PUT /users/{id}
        public record UserUpdateDto(string Email, string PasswordHash);

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto) {
            var user = await _context.Users.FindAsync(id);
            if (user is null) return NotFound();

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            user.Email = dto.Email;
            user.PasswordHash = dto.PasswordHash;
            await _context.SaveChangesAsync();

            return Ok(new { user.Id, user.Email });
        }

        // DELETE /users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            var user = await _context.Users.FindAsync(id);
            if (user is null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
