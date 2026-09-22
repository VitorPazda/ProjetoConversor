using Microsoft.AspNetCore.Mvc;
using ProjetoConversor.Models;
using ProjetoConversor.Server.Services;

namespace ProjetoConversor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
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
            await _userService.InsertAsync(user);
            return StatusCode(201);
        }

        // PUT Edit User
        [HttpPut("{id:int}")]
        public async Task<ActionResult<User>> EditUser(int id, User user)
        {
            var existingUser = await _userService.UpdateAsync(id, user);

            if (existingUser == null)
            {
                return NotFound();
            }

            return Ok(existingUser);
        }

        // DELETE User from DB
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userService.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            await _userService.DeleteAsync(id);
            return NoContent();
        }

        // POST User Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var user = await _userService.LoginAsync(request.Name, request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos" });
            }

            return Ok(new{idUser = user.IdUser, name = user.Name,accountType = user.AccountType});
        }
    }
}
