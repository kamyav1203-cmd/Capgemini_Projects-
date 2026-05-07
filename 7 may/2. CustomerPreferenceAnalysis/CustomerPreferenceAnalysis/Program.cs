using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Step 1: Create sets for each category
        HashSet<string> electronics = new HashSet<string>()
        { "C001","C002","C003","C005","C008" };

        HashSet<string> clothing = new HashSet<string>()
        { "C002","C004","C005","C006","C009" };

        HashSet<string> books = new HashSet<string>()
        { "C003","C005","C007","C008","C010" };

        Console.WriteLine("--- Customer Preference Analysis ---\n");

        // 1. UNION (ANY category)
        HashSet<string> union = new HashSet<string>(electronics);
        union.UnionWith(clothing);
        union.UnionWith(books);

        Console.WriteLine("1. Customers in ANY category (Union):");
        PrintSet(union);

        // 2. INTERSECTION (ALL categories)
        HashSet<string> intersection = new HashSet<string>(electronics);
        intersection.IntersectWith(clothing);
        intersection.IntersectWith(books);

        Console.WriteLine("\n2. Customers in ALL categories (Intersection):");
        PrintSet(intersection);

        // 3. ONLY Electronics
        HashSet<string> onlyElectronics = new HashSet<string>(electronics);
        onlyElectronics.ExceptWith(clothing);
        onlyElectronics.ExceptWith(books);

        Console.WriteLine("\n3. Customers ONLY in Electronics:");
        PrintSet(onlyElectronics);

        // 4. Electronics AND Books but NOT Clothing
        HashSet<string> eAndB = new HashSet<string>(electronics);
        eAndB.IntersectWith(books);
        eAndB.ExceptWith(clothing);

        Console.WriteLine("\n4. Electronics AND Books but NOT Clothing:");
        PrintSet(eAndB);
    }

    // Helper function to print set
    static void PrintSet(HashSet<string> set)
    {
        foreach (var item in set)
        {
            Console.Write(item + ", ");
        }
        Console.WriteLine("\nTotal: " + set.Count + " customers");
    }
}