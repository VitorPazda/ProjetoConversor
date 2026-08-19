using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Models;
using ProjetoConversor.Data;

namespace ProjetoConversor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversionsController : ControllerBase
    {
        private readonly ProjetoConversorContext _context;

        public ConversionsController(ProjetoConversorContext context)
        {
            _context = context;
        }

        // POST Conversion
        [HttpPost]
        public async Task<IActionResult> InsertConversion([FromForm] int userId, [FromForm] string bank, [FromForm] IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Arquivo não enviado.");
            }

            var conversion = new ConversionModel
            {
                UserId = userId,
                Bank = bank,
                FileName = file.FileName,
                Date = DateTime.Now,
                Status = "Pending"
            };

            _context.Conversion.Add(conversion);
            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created);
        }
    }
}
