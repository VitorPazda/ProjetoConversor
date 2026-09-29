using Microsoft.AspNetCore.Mvc;
using ProjetoConversor.Data;
using ProjetoConversor.Server.Services;

namespace ProjetoConversor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversionsController : ControllerBase
    {
        private readonly ProjetoConversorContext _context;
        private readonly ConversionService _conversionService;

        public ConversionsController(ProjetoConversorContext context, ConversionService conversionService)
        {
            _context = context;
            _conversionService = conversionService;
        }

        // GET All Conversion from db
        [HttpGet]
        public async Task<IActionResult> GetConversions()
        {
            var conversion = await _conversionService.FindAllAsync();
            return Ok(conversion);
        }

        // GET Conversions by UserId
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserConversions(int userId)
        {
            var result = await _conversionService.ConversionResultAsync(userId);
            return Ok(result);
        }

        // GET Download converted file
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadConversion(int id)
        {
            var conversion = await _conversionService.FindByIdAsync(id);
            if (conversion == null || conversion.ConvertedFile == null)
            {
                return NotFound(new { message = "Conversion not found or file missing." });
            }

            var fileName = $"{conversion.Date:dd-MM-yyyy}.ofx";
            return File(conversion.ConvertedFile, "application/x-ofx", fileName);
        }

        [HttpPost("convert")]
        public async Task<IActionResult> ConvertPdf([FromForm] int userId, [FromForm] string bank, [FromForm] IFormFile? file)
        {
            // Validate if the file was sent
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "File not sent." });
            }

            // Validate if the file is .pdf
            var allowedExtensions = new[] { ".pdf" };
            var fileExtesion = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtesion))
            {
                return BadRequest(new { message = "Invalid file" });
            }

            try
            {
                var (fileBytes, fileName) = await _conversionService.SaveConversionAsync(userId, bank, file);

                return File(fileBytes, "application/x-ofx", fileName);
            }

            catch (Exception ex)
            {
                return BadRequest(new { message = $"Conversion failed: {ex.Message}" });
            }
        }
    }
}
