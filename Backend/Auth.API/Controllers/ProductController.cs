using Auth.Core.Entities;
using Auth.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Auth.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var products = await _productRepository.GetProductsByUserIdAsync(userId);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var userId = GetUserId();
            var product = await _productRepository.GetProductByIdAsync(id, userId);
            if (product == null) return NotFound();

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            var userId = GetUserId();
            product.ApplicationUserId = userId;

            await _productRepository.AddProductAsync(product);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            var userId = GetUserId();
            var existingProduct = await _productRepository.GetProductByIdAsync(id, userId);
            if (existingProduct == null) return NotFound();

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.RegularPrice = product.RegularPrice;
            existingProduct.SalePrice = product.SalePrice;
            existingProduct.IsActive = product.IsActive;
            existingProduct.Category = product.Category;
            existingProduct.ImageUrl = product.ImageUrl;

            await _productRepository.UpdateProductAsync(existingProduct);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var userId = GetUserId();
            var product = await _productRepository.GetProductByIdAsync(id, userId);
            if (product == null) return NotFound();

            await _productRepository.DeleteProductAsync(product);
            return NoContent();
        }
    }
}
