using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        string text = "The quick brown fox jumps over the lazy dog. The fox is quick and the dog is lazy. Quick brown fox jumps over the lazy dog again.";
        int N = 3;

        // Step 1: Clean text (lowercase + remove punctuation)
        char[] separators = new char[] { ' ', '.', ',', '!', '?' };
        string[] words = text.ToLower().Split(separators, StringSplitOptions.RemoveEmptyEntries);

        // Step 2: Count frequency
        Dictionary<string, int> freq = new Dictionary<string, int>();

        foreach (string word in words)
        {
            if (freq.ContainsKey(word))
                freq[word]++;
            else
                freq[word] = 1;
        }

        Console.WriteLine("--- Word Frequency Analysis ---\n");

        // Total words
        Console.WriteLine("Total words: " + words.Length);

        // Unique words
        Console.WriteLine("Unique words: " + freq.Count);

        // Top N frequent words
        Console.WriteLine("\nTop " + N + " Frequent Words:");
        var topWords = freq.OrderByDescending(x => x.Value).Take(N);

        foreach (var item in topWords)
        {
            Console.WriteLine(item.Key + ": " + item.Value + " times");
        }

        // Words appearing exactly once
        Console.WriteLine("\nWords appearing exactly once:");
        var singleWords = freq.Where(x => x.Value == 1).Select(x => x.Key);

        Console.WriteLine(string.Join(", ", singleWords));

        // Average frequency
        double avg = freq.Values.Average();
        Console.WriteLine("\nAverage frequency: " + avg.ToString("0.00") + " times per unique word");
    }
}