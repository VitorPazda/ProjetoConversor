using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoConversor.Models;
using ProjetoConversor.Data;
using System.Data;

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

        public async Task<User?> FindByIdAsync(int id)
        {
            return await _context.User.FirstOrDefaultAsync(user => user.IdUser == id);
        }

        public async Task InsertAsync(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Active = true;
            _context.User.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> UpdateAsync(int id, User user)
        {
            var existingUser = await _context.User.FindAsync(id);

            if (existingUser == null)
            {
                return null;
            }

            // Validate if the password has changed
            if (!string.IsNullOrWhiteSpace(user.Password) && (existingUser.Password != user.Password))
            {
                existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }
            
            existingUser.Name = user.Name;
            existingUser.AccountType = user.AccountType;
            existingUser.Active = user.Active;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var user = await FindByIdAsync(id);

                if (user == null)
                {
                    throw new KeyNotFoundException("User not found");
                }

                _context.User.Remove(user);
                await _context.SaveChangesAsync();
            }
            catch (DBConcurrencyException ex)
            {
                throw new Exception("Error: ", ex);
            }
        }

        public async Task<User?> LoginAsync(string name, string password)
        {
            var user = await _context.User.FirstOrDefaultAsync(user => user.Name == user.Name);

            // Verify that the user is not null first
            if (user == null)
            {
                return null;
            }

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(password, user.Password);

            if (!isValidPassword)
            {
                return null;
            }

            // Credenciais válidas
            return user;
        }
    }
}
