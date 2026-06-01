using Auth.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<BusinessProfile> BusinessProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .HasOne(a => a.BusinessProfile)
                .WithOne(b => b.ApplicationUser)
                .HasForeignKey<BusinessProfile>(b => b.ApplicationUserId);

            builder.Entity<ApplicationUser>()
                .HasMany<Product>()
                .WithOne(p => p.ApplicationUser)
                .HasForeignKey(p => p.ApplicationUserId);
                
            builder.Entity<Product>()
                .Property(p => p.RegularPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<Product>()
                .Property(p => p.SalePrice)
                .HasColumnType("decimal(18,2)");
        }
    }
}
