using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        // Step 1: Input data
        var salesData = new List<(string product, string region, int amount)>
        {
            ("P001","North",1500),
            ("P001","South",2000),
            ("P002","North",3000),
            ("P001","East",2500),
            ("P002","South",1800),
            ("P003","North",1200),
            ("P001","West",2200),
            ("P002","West",2800),
            ("P003","South",900),
            ("P002","East",3200)
        };

        int threshold = 2000;

        // Step 2: Group data → Product → Region → Sales
        Dictionary<string, Dictionary<string, int>> data =
            new Dictionary<string, Dictionary<string, int>>();

        foreach (var entry in salesData)
        {
            if (!data.ContainsKey(entry.product))
                data[entry.product] = new Dictionary<string, int>();

            data[entry.product][entry.region] = entry.amount;
        }

        Console.WriteLine("--- Sales Report by Product and Region ---\n");

        // Step 3: Product-wise report
        Dictionary<string, double> productAvg = new Dictionary<string, double>();

        foreach (var product in data)
        {
            Console.WriteLine($"Product {product.Key}:");

            var regions = product.Value;

            foreach (var r in regions)
            {
                Console.WriteLine($"  {r.Key}: ${r.Value}");
            }

            int total = regions.Values.Sum();
            double avg = regions.Values.Average();

            Console.WriteLine($"  Total: ${total}, Average: ${avg:F2}\n");

            productAvg[product.Key] = avg;
        }

        // Step 4: Best-selling product in each region
        Console.WriteLine("Best Selling Product by Region:");

        var regionData = new Dictionary<string, (string product, int amount)>();

        foreach (var entry in salesData)
        {
            if (!regionData.ContainsKey(entry.region) ||
                entry.amount > regionData[entry.region].amount)
            {
                regionData[entry.region] = (entry.product, entry.amount);
            }
        }

        foreach (var r in regionData)
        {
            Console.WriteLine($"{r.Key}: {r.Value.product} (${r.Value.amount})");
        }

        // Step 5: Underperforming products
        Console.WriteLine($"\nUnderperforming Products (< ${threshold} average):");

        foreach (var p in productAvg)
        {
            if (p.Value < threshold)
            {
                Console.WriteLine($"{p.Key} (${p.Value:F2})");
            }
        }
    }
}