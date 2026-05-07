using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        // Step 1: Store student data
        Dictionary<string, int[]> students = new Dictionary<string, int[]>()
        {
            {"John", new int[]{85, 90, 78, 92}},
            {"Sarah", new int[]{95, 88, 91, 89}},
            {"Mike", new int[]{70, 65, 80, 75}},
            {"Emma", new int[]{88, 92, 94, 96}}
        };

        Console.WriteLine("--- Student Grade Report ---\n");

        double maxAvg = 0;
        string topStudent = "";

        HashSet<int> uniqueGrades = new HashSet<int>();

        // Step 2: Process each student
        foreach (var student in students)
        {
            string name = student.Key;
            int[] marks = student.Value;

            double avg = marks.Average();
            int highest = marks.Max();
            int lowest = marks.Min();

            Console.WriteLine($"{name}: Average = {avg:F2}, Highest = {highest}, Lowest = {lowest}");

            // Track top performer
            if (avg > maxAvg)
            {
                maxAvg = avg;
                topStudent = name;
            }

            // Add grades to HashSet
            foreach (int m in marks)
            {
                uniqueGrades.Add(m);
            }
        }

        // Step 3: Top Performer
        Console.WriteLine($"\nTop Performer: {topStudent} (Average: {maxAvg:F2})\n");

        // Step 4: Students with all grades >= 80
        Console.WriteLine("Students with all grades >= 80:");

        foreach (var student in students)
        {
            if (student.Value.All(m => m >= 80))
            {
                Console.WriteLine(student.Key + " (" + string.Join(",", student.Value) + ")");
            }
        }

        // Step 5: Unique Grades
        Console.WriteLine("\nUnique Grade Values Across All Students:");
        var sortedGrades = uniqueGrades.OrderBy(x => x);

        Console.WriteLine(string.Join(",", sortedGrades));
        Console.WriteLine("Total unique grades: " + uniqueGrades.Count);
    }
}