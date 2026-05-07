using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<int, int> inventory = new Dictionary<int, int>();

        int n = int.Parse(Console.ReadLine());

        for (int i = 0; i < n; i++)
        {
            string input = Console.ReadLine();
            string[] parts = input.Split(' ');

            string command = parts[0];

            if (command == "ADD")
            {
                int productId = int.Parse(parts[1]);
                int qty = int.Parse(parts[2]);

                if (inventory.ContainsKey(productId))
                    inventory[productId] += qty;
                else
                    inventory[productId] = qty;
            }

            else if (command == "REMOVE")
            {
                int productId = int.Parse(parts[1]);
                int qty = int.Parse(parts[2]);

                if (inventory.ContainsKey(productId) && inventory[productId] >= qty)
                {
                    inventory[productId] -= qty;
                }
                else
                {
                    Console.WriteLine("Invalid operation");
                }
            }

            else if (command == "CHECK")
            {
                int productId = int.Parse(parts[1]);

                if (inventory.ContainsKey(productId))
                    Console.WriteLine($"Product {productId}: {inventory[productId]} units");
                else
                    Console.WriteLine($"Product {productId}: 0 units");
            }

            else if (command == "BULK")
            {
                string[] items = parts[1].Split(',');

                foreach (string item in items)
                {
                    string[] pair = item.Split(':');
                    int productId = int.Parse(pair[0]);
                    int qty = int.Parse(pair[1]);

                    if (inventory.ContainsKey(productId))
                        inventory[productId] += qty;
                    else
                        inventory[productId] = qty;
                }
            }

            else if (command == "DISPLAY")
            {
                Console.WriteLine("--- Current Inventory ---");

                foreach (var item in inventory)
                {
                    if (item.Value > 0)
                        Console.WriteLine($"{item.Key}: {item.Value} units");
                }
            }
        }
    }
}