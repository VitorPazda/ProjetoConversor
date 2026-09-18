using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Models;
using ProjetoConversor.Data;
using BCrypt.Net;
using Microsoft.AspNetCore.Identity.Data;
using ProjetoConversor.Server.Models;

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

        public async Task InsertAsync(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Active = true;
            _context.User.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> UpdateAsync(int id, User user)
        {
            var existingUser = await _context.User.FindAsync(id);

            existingUser.Name = user.Name;
            existingUser.AccountType = user.AccountType;
            existingUser.Password = user.Password;
            existingUser.Active = user.Active;

            await _context.SaveChangesAsync();
            return existingUser;
        }
    }
}
