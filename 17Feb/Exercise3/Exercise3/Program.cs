// Write a C# Sharp program that takes 2 numbers as input and return true or false when both numbers are even or odd.

using System;
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Enter the first number:");
        int num1 = Convert.ToInt32(Console.ReadLine());
        Console.WriteLine("Enter the second number:");
        int num2 = Convert.ToInt32(Console.ReadLine());
        bool result = AreBothEvenOrOdd(num1, num2);
        Console.WriteLine($"Are both numbers even or odd? {result}");
    }
    static bool AreBothEvenOrOdd(int a, int b)
    {
        return (a % 2 == 0 && b % 2 == 0) || (a % 2 != 0 && b % 2 != 0);
    }
}