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

        public async Task<(byte[] FileBytes, string FileName)> SaveConversionAsync(int userId, string bank, IFormFile file)
        {
            // Prepare the conversion model to be saved in the db
            var conversion = new ConversionModel
            {
                UserId = userId,
                Bank = bank,
                FileName = file.FileName,
                Date = DateTime.Now,
            };

            try
            {
                // Extract text from the PDF file
                using var stream = file.OpenReadStream();
                var converter = new SicoobConverter();
                var text = converter.ExtractText(stream);

                // Parse the extracted text into a bank statement
                var parser = new SicoobParser();
                var statement = parser.Parse(text);

                var ofxGenerator = new OfxGenerator();
                var ofx = ofxGenerator.Generate(statement);

                // If everything went well, set the status to "Success" and save to db
                conversion.Status = "Success";
                _context.Conversion.Add(conversion);
                await _context.SaveChangesAsync();

                var fileName = $"{DateTime.Now:dd-MM-yyyy}.ofx";
                var bytes = Encoding.GetEncoding(1252).GetBytes(ofx);

                return (bytes, fileName);
            }

            catch (Exception ex)
            {
                conversion.Status = "Failed";

                _context.Conversion.Add(conversion);
                await _context.SaveChangesAsync();

                // Relaunche the exception in order to sign to Controller
                throw new InvalidOperationException($"Falha ao processar o arquivo PDF: {ex.Message}", ex);
            }
        }
    }
}
