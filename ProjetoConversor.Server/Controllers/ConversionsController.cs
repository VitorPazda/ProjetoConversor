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

        [HttpPost("convert")]
        public async Task<IActionResult> ConvertPdf([FromForm] int userId, [FromForm] string bank, [FromForm] IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Arquivo não enviado." });
            }

            try
            {
                var (fileBytes, fileName) = await _conversionService.ProcessAndSaveConversionAsync(userId, bank, file);

                return File(fileBytes, "application/x-ofx", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Falha ao converter o arquivo: {ex.Message}" });
            }
        }
    }
}
