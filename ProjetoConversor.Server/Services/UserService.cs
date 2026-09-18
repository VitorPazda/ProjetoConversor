using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Data;
using ProjetoConversor.Models;
using ProjetoConversor.Server.Models;
using System.Globalization;
using System.Text;

namespace ProjetoConversor.Server.Services
{
    public class UserService : Controller
    {
        private readonly ProjetoConversorContext _context;

        public UserService(ProjetoConversorContext context)
        {
            _context = context;
        }

        public async Task<List<User>> FindAllAsync()
        {
            return await _context.User.ToListAsync();
        }

        public async Task<User> FindByIdAsync(int id)
        {
            return await _context.User.FirstOrDefaultAsync(u => u.IdUser == id);
        }
    }
}
