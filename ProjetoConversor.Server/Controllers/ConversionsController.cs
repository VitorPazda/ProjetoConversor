using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Data;
using ProjetoConversor.Models;
using ProjetoConversor.Server.Services;
using System.Text;

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

        [HttpPost("convert")]
        public async Task<IActionResult> ConvertPdf([FromForm] int userId, [FromForm] string bank, [FromForm] IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Arquivo não enviado.");
            }

            // Extract pdf
            using var stream = file.OpenReadStream();

            var converter = new SicoobConverter();
            var text = converter.ExtractText(stream);

            // Read the pdf
            var parser = new SicoobParser();
            var statement = parser.Parse(text);

            // Generate OFX
            var ofxGenerator = new OfxGenerator();
            var ofx = ofxGenerator.Generate(statement);

            // Register conversion into db
            var conversion = new ConversionModel
            {
                UserId = userId,
                Bank = bank,
                FileName = file.FileName,
                Date = DateTime.Now,
                Status = "Success"
            };

            _context.Conversion.Add(conversion);
            await _context.SaveChangesAsync();

            // Generate file name
            var fileName = Path.GetFileNameWithoutExtension(file.FileName) + ".ofx";

            // Generate string OFX into bytes
            var bytes = Encoding.GetEncoding(1252).GetBytes(ofx);

            // Return the file
            return File(bytes, "application/x-ofx", fileName);
        }
    }
}
