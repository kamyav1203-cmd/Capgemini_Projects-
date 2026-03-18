using System;

namespace CalculatorApp
{
    class Calculator
    {
        public double Add(double num1, double num2)
        {
            return num1 + num2;
        }

        public double Subtract(double num1, double num2)
        {
            return num1 - num2;
        }

        public double Multiply(double num1, double num2)
        {
            return num1 * num2;
        }

        public double Divide(double num1, double num2)
        {
            if (num2 == 0)
            {
                throw new DivideByZeroException("Cannot divide by zero!");
            }
            return num1 / num2;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Calculator calc = new Calculator();

            Console.WriteLine("Enter first number:");
            double num1 = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine("Enter second number:");
            double num2 = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine($"\nResults:");
            Console.WriteLine($"Addition: {num1} + {num2} = {calc.Add(num1, num2)}");
            Console.WriteLine($"Subtraction: {num1} - {num2} = {calc.Subtract(num1, num2)}");
            Console.WriteLine($"Multiplication: {num1} * {num2} = {calc.Multiply(num1, num2)}");
            
            try
            {
                Console.WriteLine($"Division: {num1} / {num2} = {calc.Divide(num1, num2)}");
            }
            catch (DivideByZeroException ex)
            {
                Console.WriteLine($"Division: {ex.Message}");
            }
        }
    }
}
