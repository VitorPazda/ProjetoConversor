using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Models;
using ProjetoConversor.Data;
using BCrypt.Net;
using Microsoft.AspNetCore.Identity.Data;
using ProjetoConversor.Server.Services;

namespace ProjetoConversor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ProjetoConversorContext _context;
        private readonly UserService _userService;

        public UsersController(ProjetoConversorContext context, UserService userService)
        {
            _context = context;
            _userService = userService;
        }

        // GET All Users from db
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var user = await _userService.FindAllAsync();
            return Ok(user);
        }

        // GET User by Id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _userService.FindByIdAsync(id);
            return Ok(user);
        }

        // POST User
        [HttpPost]
        public async Task<IActionResult> InsertUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Active = true;
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
            existingUser.Active = user.Active;

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

        // POST User Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var user = await _context.User.FirstOrDefaultAsync(user => user.Name == request.Name);

            // Verify that the user is not null first
            if (user == null)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos" });
            }
            
            // And then after it, verify the password
            var validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

            if (!validPassword)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos" });
            }

            return Ok(new {idUser = user.IdUser, name = user.Name, accountType = user.AccountType});
        }
    }
}
