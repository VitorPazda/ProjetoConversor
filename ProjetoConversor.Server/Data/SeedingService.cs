using ProjetoConversor.Models;
using BCrypt.Net;

namespace ProjetoConversor.Data
{
    public class SeedingService
    {
        private ProjetoConversorContext _context;
        public SeedingService(ProjetoConversorContext context)
        {
            _context = context;
        }

        // Function to seed our database
        public void Seed()
        {
            // Check if are users created
            if (_context.User.Any())
            {
                return;
            }

            // If not, populate the db
            User user01 = new User(1, "Vitor", "Administrator", BCrypt.Net.BCrypt.HashPassword("1234"));

            // Add to db
            _context.User.AddRange(user01);
            _context.SaveChanges();
        }
    }
}
