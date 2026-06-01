using Auth.Core.Entities;
using Auth.Core.Interfaces;
using Auth.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Auth.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetProductsByUserIdAsync(string userId)
        {
            return await _context.Products
                .Where(p => p.ApplicationUserId == userId)
                .ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id, string userId)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.ApplicationUserId == userId);
        }

        public async Task AddProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProductAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProductAsync(Product product)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}
