using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] arr = { 1, 3, 2, 3, 3, 4, 5, 3, 6, 7, 8, 9, 10, 3 };
        int K = 2;

        Console.WriteLine("--- Access Pattern Analysis ---\n");

        // 1. Longest Consecutive Sequence
        HashSet<int> set = new HashSet<int>(arr);
        int longest = 0;
        int start = 0;

        foreach (int num in set)
        {
            if (!set.Contains(num - 1)) // start of sequence
            {
                int current = num;
                int length = 1;

                while (set.Contains(current + 1))
                {
                    current++;
                    length++;
                }

                if (length > longest)
                {
                    longest = length;
                    start = num;
                }
            }
        }

        Console.Write("Longest Consecutive Sequence: ");
        for (int i = 0; i < longest; i++)
        {
            Console.Write((start + i) + (i < longest - 1 ? "," : ""));
        }
        Console.WriteLine(" (Length: " + longest + ")\n");

        // 2. Most Frequent Element
        Dictionary<int, int> freq = new Dictionary<int, int>();

        foreach (int num in arr)
        {
            if (freq.ContainsKey(num))
                freq[num]++;
            else
                freq[num] = 1;
        }

        var mostFreq = freq.OrderByDescending(x => x.Value).First();
        Console.WriteLine("Most Frequent Element: " + mostFreq.Key + " (appears " + mostFreq.Value + " times)\n");

        // 3. First Non-Repeating Element
        int firstNonRepeat = -1;
        foreach (int num in arr)
        {
            if (freq[num] == 1)
            {
                firstNonRepeat = num;
                break;
            }
        }
        Console.WriteLine("First Non-Repeating Element: " + firstNonRepeat + "\n");

        // 4. Pairs with Difference K
        Console.WriteLine("Pairs with Difference " + K + ":");
        HashSet<int> pairSet = new HashSet<int>(arr);

        foreach (int num in pairSet)
        {
            if (pairSet.Contains(num + K))
            {
                Console.WriteLine("(" + num + ", " + (num + K) + ")");
            }
        }

        // 5. Majority Element (> n/2)
        int n = arr.Length;
        var majority = freq.OrderByDescending(x => x.Value).First();

        double percentage = (majority.Value * 100.0) / n;

        if (majority.Value > n / 2)
        {
            Console.WriteLine("\nMajority Element: " + majority.Key);
        }
        else
        {
            Console.WriteLine("\nMajority Element: " + majority.Key +
                " (appears " + majority.Value + " out of " + n +
                " times - " + percentage.ToString("0.0") + "% - No majority)");
        }
    }
}