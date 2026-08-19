using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Models;
using ProjetoConversor.Data;
using BCrypt.Net;

namespace ProjetoConversor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ProjetoConversorContext _context;

        public UsersController(ProjetoConversorContext context)
        {
            _context = context;
        }

        // GET All Users from db
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.User.ToListAsync();
        }

        // GET User by Id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST User
        [HttpPost]
        public async Task<IActionResult> InsertUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _context.User.Add(user);
            await _context.SaveChangesAsync();
            return StatusCode(201);
        }

        // PUT Edit User
        [HttpPut("{id:int}")]
        public async Task<ActionResult<User>> EditUser(int id, User user)
        {
            var existingUser = await _context.User.FindAsync(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.Name = user.Name;
            existingUser.AccountType = user.AccountType;
            existingUser.Password = user.Password;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        // DELETE User from DB
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var existingUser = await _context.User.FindAsync(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            _context.User.Remove(existingUser);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
