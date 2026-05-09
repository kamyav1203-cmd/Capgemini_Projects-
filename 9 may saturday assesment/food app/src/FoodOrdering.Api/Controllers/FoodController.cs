using FoodOrdering.Api.Dtos;
using FoodOrdering.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrdering.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FoodController(IFoodService foodService) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(CancellationToken cancellationToken)
        => Ok(await foodService.GetCategoriesAsync(cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpPost("categories")]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CategoryUpsertDto dto, CancellationToken cancellationToken)
        => Ok(await foodService.CreateCategoryAsync(dto, cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpPut("categories/{id:int}")]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, CategoryUpsertDto dto, CancellationToken cancellationToken)
        => Ok(await foodService.UpdateCategoryAsync(id, dto, cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpDelete("categories/{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id, CancellationToken cancellationToken)
    {
        await foodService.DeleteCategoryAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FoodItemDto>>> GetFoodItems([FromQuery] int? categoryId, [FromQuery] decimal? maxPrice, [FromQuery] string? search, CancellationToken cancellationToken)
        => Ok(await foodService.GetFoodItemsAsync(categoryId, maxPrice, search, cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FoodItemDto>> GetFoodItem(int id, CancellationToken cancellationToken)
        => Ok(await foodService.GetFoodItemAsync(id, cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<FoodItemDto>> CreateFoodItem(FoodItemUpsertDto dto, CancellationToken cancellationToken)
        => Ok(await foodService.CreateFoodItemAsync(dto, cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<FoodItemDto>> UpdateFoodItem(int id, FoodItemUpsertDto dto, CancellationToken cancellationToken)
        => Ok(await foodService.UpdateFoodItemAsync(id, dto, cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteFoodItem(int id, CancellationToken cancellationToken)
    {
        await foodService.DeleteFoodItemAsync(id, cancellationToken);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("upload")]
    public async Task<ActionResult<object>> UploadImage(IFormFile file, CancellationToken cancellationToken)
        => Ok(new { imageUrl = await foodService.SaveImageAsync(file, Request, cancellationToken) });
}
