using System;                      // For Console, String operations
using System.Collections;          // For ArrayList

namespace ArrayListDemo
{
    class UsingArrayList
    {
        static void Main(string[] args)
        {
            // Creating first ArrayList
            ArrayList listdata = new ArrayList();

            // Adding integer values to ArrayList
            listdata.Add(100);
            listdata.Add(102);
            listdata.Add(103);
            listdata.Add(104);
            listdata.Add(105);

            // Adding string value (ArrayList allows mixed data types)
            listdata.Add("Dotnet");

            // Printing first ArrayList
            Console.WriteLine("Listdata:");
            foreach (object i in listdata)   // object because ArrayList is non-generic
            {
                Console.WriteLine(i);
            }

            // Creating second ArrayList
            ArrayList listdata2 = new ArrayList();

            // Adding values to second ArrayList
            listdata2.Add(200);
            listdata2.Add(202);
            listdata2.Add(203);
            listdata2.Add(204);
            listdata2.Add(205);
            listdata2.Add("Java");

            // Printing second ArrayList
            Console.WriteLine("\nListdata2:");
            foreach (object i in listdata2)
            {
                Console.WriteLine(i);
            }

            // Adding all elements of listdata2 into listdata
            listdata.AddRange(listdata2);

            // Printing ArrayList after AddRange
            Console.WriteLine("\nAfter AddRange:");
            foreach (object i in listdata)
            {
                Console.WriteLine(i);
            }

            // Sample string with extra spaces
            string order = " Order#1001 | Laptop | Dell | 75000 ";
            Console.WriteLine(order);

            // Trim() removes spaces from start and end
            string trimOrder = order.Trim();
            Console.WriteLine(trimOrder);

            // Length of original string
            Console.WriteLine(order.Length);

            // Length after trimming
            Console.WriteLine(trimOrder.Length);

            // Splitting string using '|' delimiter
            string[] parts = trimOrder.Split('|');

            // Printing split values
            Console.WriteLine("After Split");
            foreach (var item in parts)
            {
                // Trim each part to remove extra spaces
                Console.WriteLine(item.Trim());
            }
        }
    }
}