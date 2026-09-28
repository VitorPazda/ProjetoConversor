using Microsoft.EntityFrameworkCore;
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
        public DbSet<ConversionModel> Conversion { get; set; }

        // Make auto-increment work for PostgreSQL
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .Property(u => u.IdUser)
                .UseIdentityByDefaultColumn()
                .IsRequired(); // Force to be not null on the db

            modelBuilder.Entity<ConversionModel>()
                .Property(c => c.IdConversion)
                .UseIdentityByDefaultColumn()
                .IsRequired(); // Force to be not null on the db
        }
    }
}
