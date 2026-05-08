using System;
using System.Collections.Generic;
using System.Linq;

class Query
{
    public List<int> dataSource;
    public bool isExecuted = false;

    public virtual IEnumerable<int> Apply()
    {
        return dataSource;
    }

    public virtual List<int> Execute()
    {
        isExecuted = true;
        return Apply().ToList();
    }

    public virtual string GetQueryType()
    {
        return "Base Query";
    }
}

class FilterQuery : Query
{
    public string predicate;
    public int filteredCount;

    public override IEnumerable<int> Apply()
    {
        if (predicate.StartsWith(">"))
        {
            int value = int.Parse(predicate.Substring(1));
            return dataSource.Where(x => x > value);
        }
        else if (predicate.StartsWith("<"))
        {
            int value = int.Parse(predicate.Substring(1));
            return dataSource.Where(x => x < value);
        }
        else if (predicate == "even")
        {
            return dataSource.Where(x => x % 2 == 0);
        }
        else if (predicate == "odd")
        {
            return dataSource.Where(x => x % 2 != 0);
        }

        return dataSource;
    }

    public override List<int> Execute()
    {
        var result = Apply().ToList();
        filteredCount = result.Count;
        isExecuted = true;

        Console.WriteLine($"Filter Executed,Predicate:{predicate},Result Count:{filteredCount}");
        return result;
    }

    public override string GetQueryType()
    {
        return "Filter";
    }
}

class AggregateQuery : Query
{
    public string operation;
    public double result;

    public override IEnumerable<int> Apply()
    {
        return dataSource; // no execution here
    }

    public override List<int> Execute()
    {
        if (operation == "Sum")
            result = dataSource.Sum();
        else if (operation == "Average")
            result = dataSource.Average();
        else if (operation == "Max")
            result = dataSource.Max();
        else if (operation == "Min")
            result = dataSource.Min();

        isExecuted = true;

        Console.WriteLine($"Aggregation Executed,Operation:{operation},Result:{result}");
        return dataSource;
    }

    public override string GetQueryType()
    {
        return "Aggregate";
    }
}

class Program
{
    static void Main()
    {
        string queryType = Console.ReadLine();
        List<int> data = Console.ReadLine().Split().Select(int.Parse).ToList();
        string input = Console.ReadLine();

        Query query;

        if (queryType == "Filter")
        {
            query = new FilterQuery()
            {
                dataSource = data,
                predicate = input
            };
        }
        else
        {
            query = new AggregateQuery()
            {
                dataSource = data,
                operation = input
            };
        }

        query.Apply();   // deferred
        query.Execute(); // actual execution
    }
}