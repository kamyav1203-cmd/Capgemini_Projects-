using System;

class Program
{
    static void Main()
    {
        int number;

        // The loop block executes at least once
        do
        {
            Console.Write("Enter a positive number: ");
            // Convert the user input from string to an integer
            number = Convert.ToInt32(Console.ReadLine());
        } while (number <= 0); // Condition is checked after the first run

        Console.WriteLine($"You entered: {number}");
    }
}