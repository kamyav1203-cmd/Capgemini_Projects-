using FootwearCatalogue.Models.DTOs;
using FootwearCatalogue.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FootwearCatalogue.Controllers
{
    [ApiController]
    [Route("api/footwear")]
    public class FootwearController : ControllerBase
    {
        // In-memory store for assessment/demo purposes.
        private static readonly List<FootwearItem> Items = new();

        [HttpPost]
        public IActionResult Create(CreateFootwearDto dto)
        {
            var item = new FootwearItem
            {
                Id = Guid.NewGuid(),
                Name = dto.Name.Trim(),
                Brand = dto.Brand.Trim(),
                Category = dto.Category.Trim(),
                Gender = dto.Gender?.Trim(),
                Material = dto.Material?.Trim(),
                Color = dto.Color?.Trim(),
                Size = dto.Size,
                Price = dto.Price,
                Stock = dto.Stock,
                ReleaseYear = dto.ReleaseYear
            };

            Items.Add(item);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpGet]
        public ActionResult<List<FootwearSummaryDto>> GetAll(
            [FromQuery] string? category,
            [FromQuery] string? brand)
        {
            var query = Items.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(i => string.Equals(i.Category, category, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrWhiteSpace(brand))
                query = query.Where(i => string.Equals(i.Brand, brand, StringComparison.OrdinalIgnoreCase));

            var result = query
                .Select(i => new FootwearSummaryDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Brand = i.Brand,
                    Category = i.Category,
                    Size = i.Size,
                    Price = i.Price,
                    Stock = i.Stock
                })
                .ToList();

            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            var item = Items.FirstOrDefault(i => i.Id == id);
            if (item is null) return NotFound("Footwear item not found.");
            return Ok(item);
        }

        [HttpGet("search/by-name/{name}")]
        public IActionResult GetByName(string name)
        {
            var item = Items.FirstOrDefault(i => string.Equals(i.Name, name, StringComparison.OrdinalIgnoreCase));
            if (item is null) return NotFound("Footwear item not found.");
            return Ok(item);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult Delete(Guid id)
        {
            var item = Items.FirstOrDefault(i => i.Id == id);
            if (item is null) return NotFound("Delete failed: item not found.");

            Items.Remove(item);
            return Ok("Footwear item deleted successfully.");
        }

        [HttpPatch("{id:guid}/price")]
        public IActionResult PatchPrice(Guid id, [FromQuery] decimal price)
        {
            var item = Items.FirstOrDefault(i => i.Id == id);
            if (item is null) return NotFound("Item not found.");

            if (price < 5 || price > 500) return BadRequest("Price must be between 5 and 500.");

            item.Price = price;
            return Ok(item);
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, UpdateFootwearDto dto)
        {
            var item = Items.FirstOrDefault(i => i.Id == id);
            if (item is null) return NotFound("Update failed: item not found.");

            if (dto.Name is not null) item.Name = dto.Name.Trim();
            if (dto.Brand is not null) item.Brand = dto.Brand.Trim();
            if (dto.Category is not null) item.Category = dto.Category.Trim();
            if (dto.Gender is not null) item.Gender = dto.Gender.Trim();
            if (dto.Material is not null) item.Material = dto.Material.Trim();
            if (dto.Color is not null) item.Color = dto.Color.Trim();
            if (dto.Size is not null) item.Size = dto.Size.Value;
            if (dto.Price is not null) item.Price = dto.Price.Value;
            if (dto.Stock is not null) item.Stock = dto.Stock.Value;
            if (dto.ReleaseYear is not null) item.ReleaseYear = dto.ReleaseYear.Value;

            return Ok(item);
        }
    }
}

