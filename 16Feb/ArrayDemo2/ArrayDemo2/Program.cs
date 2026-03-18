using System;

class Program
{
    static void Main()
    {
        int[] arr = { 5, 2, 9, 1, 3 };
        Array.Sort(arr);
        Console.WriteLine("Sorted Array:");
        foreach (int i in arr)
        {
            Console.Write(i + " ");
        }
    }
}