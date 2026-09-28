using ProjetoConversor.Models;
using System.Net.NetworkInformation;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
            
            User user01 = new User("Vitor", "Administrator", BCrypt.Net.BCrypt.HashPassword("1234"), true);
            User user02 = new User("Ana", "User", BCrypt.Net.BCrypt.HashPassword("1234"), true);

            // Add users to db
            _context.User.AddRange(user01, user02);
            _context.SaveChanges();
           
            // Then the conversion
            ConversionModel conversion01 = new ConversionModel(user01.IdUser, "Sicoob", "Extrato_Exemplo_Sicoob.pdf", DateTime.Now, "Success");
            _context.Conversion.Add(conversion01);
            _context.SaveChanges();
        }
    }
}
