using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Models;
using ProjetoConversor.Data;
using BCrypt.Net;
using Microsoft.AspNetCore.Identity.Data;
using ProjetoConversor.Server.Models;
using System.Data;
using Microsoft.VisualBasic;

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

        public async Task<ConversionModel> InsertAsync(int userId, string bank, IFormFile file)
        {
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

            return conversion;
        }
    }
}
