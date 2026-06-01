using Auth.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Auth.Core.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetProductsByUserIdAsync(string userId);
        Task<Product?> GetProductByIdAsync(int id, string userId);
        Task AddProductAsync(Product product);
        Task UpdateProductAsync(Product product);
        Task DeleteProductAsync(Product product);
    }
}
