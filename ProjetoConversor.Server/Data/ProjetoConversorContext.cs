using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using ProjetoConversor.Models;

namespace ProjetoConversor.Data
{
    public class ProjetoConversorContext : DbContext
    {
        public ProjetoConversorContext(DbContextOptions<ProjetoConversorContext> options)
            : base(options)
        {
        }

        // Entities
        public DbSet<User> User { get; set; }
        public DbSet<ConversionApp> Conversion { get; set; }
    }
}
