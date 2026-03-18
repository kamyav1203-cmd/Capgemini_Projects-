using System;
using System.Collections.Generic;
using System.Linq;

public class Product
{
    public int ProductId { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public int Quantity { get; set; }
}

public class InventoryEngine
{
    public void AnalyzeInventory(List<Product> products)
    {
        var lowStock = products
                       .Where(p => p.Quantity < 10)
                       .Select(p => p.Name);

        Console.WriteLine("Low Stock Products:");
        foreach (var name in lowStock)
        {
            Console.WriteLine(name);
        }

        Console.WriteLine();
        var sortedProducts = products
                             .OrderBy(p => p.Price);

        Console.WriteLine("Products Sorted by Price:");
        foreach (var p in sortedProducts)
        {
            Console.WriteLine(p.Name + " - " + p.Price);
        }

        Console.WriteLine();

        double totalValue = products
                            .Sum(p => p.Price * p.Quantity);

        Console.WriteLine("Total Inventory Value:");
        Console.WriteLine("Rs " + totalValue);
    }
}

public class Solution
{
    public static void Main()
    {
        List<Product> products = new List<Product>
        {
            new Product { ProductId = 201, Name = "Laptop", Price = 60000, Quantity = 5 },
            new Product { ProductId = 202, Name = "Mouse", Price = 800, Quantity = 25 },
            new Product { ProductId = 203, Name = "Keyboard", Price = 1500, Quantity = 8 },
            new Product { ProductId = 204, Name = "Monitor", Price = 12000, Quantity = 12 }
        };

        InventoryEngine engine = new InventoryEngine();

        engine.AnalyzeInventory(products);
        Console.WriteLine();
    }
}