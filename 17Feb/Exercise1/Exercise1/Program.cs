// Write a C# sharp program that takes three letters as input and display them in reverse order
//Test Case:
/* Enter Letter: O
 * Enter Letter: D
 * Enter Letter: L
 */
//Expected Output: LDO

using System;
class Program
{
    static void Main()
    {
        Console.Write("Enter Letter: ");
        char letter1 = Console.ReadLine()[0];
        Console.Write("Enter Letter: ");
        char letter2 = Console.ReadLine()[0];
        Console.Write("Enter Letter: ");
        char letter3 = Console.ReadLine()[0];
        Console.WriteLine($"Reversed Letters: {letter3}{letter2}{letter1}");
    }
}