using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Models;
using ProjetoConversor.Data;
using System.Text;

namespace ProjetoConversor.Server.Services
{
    public class ConversionService : Controller
    {
        private readonly ProjetoConversorContext _context;

        public ConversionService(ProjetoConversorContext context)
        {
            _context = context;
        }

        public async Task<List<ConversionModel>> FindAllAsync() 
        {
            return await _context.Conversion.ToListAsync();
        }

        public async Task<ConversionModel?> FindByIdAsync(int id)
        {
            return await _context.Conversion.FirstOrDefaultAsync(conversion => conversion.IdConversion == id);
        }

        public async Task<(byte[] FileBytes, string FileName)> ProcessAndSaveConversionAsync(int userId, string bank, IFormFile file)
        {
            using var stream = file.OpenReadStream();
            var converter = new SicoobConverter();
            var text = converter.ExtractText(stream);

            var parser = new SicoobParser();
            var statement = parser.Parse(text);

            var ofxGenerator = new OfxGenerator();
            var ofx = ofxGenerator.Generate(statement);

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

            var fileName = $"{DateTime.Now:dd-MM-yyyy}.ofx";
            var bytes = Encoding.GetEncoding(1252).GetBytes(ofx);

            return (bytes, fileName);
        }
    }
}
