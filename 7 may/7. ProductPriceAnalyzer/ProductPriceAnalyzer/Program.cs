using System;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] prices = { 299, 499, 199, 399, 599, 159, 699, 259 };
        int target = 698;

        Console.WriteLine("--- Product Price Analysis ---\n");

        // Original
        Console.WriteLine("Original Prices: " + string.Join(", ", prices));

        // 1. Bubble Sort
        int[] sorted = (int[])prices.Clone();
        BubbleSort(sorted);

        Console.WriteLine("\nSorted Prices (Ascending): " + string.Join(", ", sorted));

        // 2. Binary Search
        Console.WriteLine("\nBinary Search Results:");
        BinarySearch(sorted, 399);
        BinarySearch(sorted, 500);

        // 3. Pair Sum
        Console.WriteLine("\nPairs that sum to " + target + ":");
        FindPairs(sorted, target);

        // 4. Longest Increasing Subsequence
        Console.WriteLine("\nLongest Increasing Subsequence:");
        LIS(sorted);

        // 5. Statistics
        Console.WriteLine("\nStatistics:");
        Console.WriteLine("Lowest Price: " + sorted.Min());
        Console.WriteLine("Highest Price: " + sorted.Max());
        Console.WriteLine("Average Price: " + sorted.Average().ToString("0.00"));

        double median = (sorted[3] + sorted[4]) / 2.0;
        Console.WriteLine("Median Price: " + median.ToString("0.00"));
    }

    // Bubble Sort
    static void BubbleSort(int[] arr)
    {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++)
        {
            for (int j = 0; j < n - i - 1; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // Binary Search
    static void BinarySearch(int[] arr, int key)
    {
        int left = 0, right = arr.Length - 1;

        while (left <= right)
        {
            int mid = (left + right) / 2;

            if (arr[mid] == key)
            {
                Console.WriteLine($"Price {key} found at index {mid}");
                return;
            }
            else if (arr[mid] < key)
                left = mid + 1;
            else
                right = mid - 1;
        }

        Console.WriteLine($"Price {key} not found");
    }

    // Pair Sum using two pointers
    static void FindPairs(int[] arr, int target)
    {
        int left = 0, right = arr.Length - 1;

        while (left < right)
        {
            int sum = arr[left] + arr[right];

            if (sum == target)
            {
                Console.WriteLine($"({arr[left]}, {arr[right]})");
                left++;
                right--;
            }
            else if (sum < target)
                left++;
            else
                right--;
        }
    }

    // Longest Increasing Subsequence (simple DP)
    static void LIS(int[] arr)
    {
        int n = arr.Length;
        int[] dp = new int[n];
        int[] parent = new int[n];

        for (int i = 0; i < n; i++)
        {
            dp[i] = 1;
            parent[i] = -1;
        }

        int maxLen = 1, lastIndex = 0;

        for (int i = 1; i < n; i++)
        {
            for (int j = 0; j < i; j++)
            {
                if (arr[i] > arr[j] && dp[i] < dp[j] + 1)
                {
                    dp[i] = dp[j] + 1;
                    parent[i] = j;
                }
            }

            if (dp[i] > maxLen)
            {
                maxLen = dp[i];
                lastIndex = i;
            }
        }

        // Reconstruct sequence
        int[] sequence = new int[maxLen];
        int k = maxLen - 1;

        while (lastIndex != -1)
        {
            sequence[k--] = arr[lastIndex];
            lastIndex = parent[lastIndex];
        }

        Console.WriteLine(string.Join(", ", sequence) + $" (Length: {maxLen})");
    }
}