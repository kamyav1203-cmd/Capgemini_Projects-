using System.ComponentModel.DataAnnotations;

namespace FoodOrdering.Api.Models;

public class Category
{
    public int Id { get; set; }

    [Required, MaxLength(80)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Description { get; set; }

    public ICollection<FoodItem> FoodItems { get; set; } = new List<FoodItem>();
}
