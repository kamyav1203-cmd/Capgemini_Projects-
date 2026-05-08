using System;
using System.Threading.Tasks;

class AsyncService
{
    public int requestCount = 0;
    public long lastResponseTime = 0;

    public virtual async Task<string> FetchDataAsync(string endpoint)
    {
        await Task.Delay(2000);
        return "Base Fetch";
    }

    public virtual async Task<string> GetStatusAsync()
    {
        await Task.Delay(100);
        return $"Requests:{requestCount}";
    }
}

class WeatherService : AsyncService
{
    public string city;
    public int temperature = 22;

    public override async Task<string> FetchDataAsync(string endpoint)
    {
        requestCount++;
        Console.WriteLine($"Weather Fetch Started,{city}");

        await Task.Delay(2000);

        Console.WriteLine($"Weather Data Received,{city},{temperature}°C");
        return "Done";
    }

    public override async Task<string> GetStatusAsync()
    {
        return $"Weather Service Status,Requests:{requestCount}";
    }
}

class StockService : AsyncService
{
    public string symbol;
    public double currentPrice = 150.5;

    public override async Task<string> FetchDataAsync(string endpoint)
    {
        requestCount++;
        Console.WriteLine($"Stock Fetch Started,{symbol}");

        await Task.Delay(2000);

        Console.WriteLine($"Stock Price Update,{symbol},${currentPrice}");
        return "Done";
    }

    public override async Task<string> GetStatusAsync()
    {
        return $"Stock Service Status,Requests:{requestCount}";
    }
}

class Program
{
    static async Task Main()
    {
        string serviceType = Console.ReadLine();
        string identifier = Console.ReadLine();
        string command = Console.ReadLine();

        AsyncService service;

        if (serviceType == "Weather")
        {
            service = new WeatherService()
            {
                city = identifier
            };
        }
        else
        {
            service = new StockService()
            {
                symbol = identifier
            };
        }

        if (command == "FetchDataAsync")
        {
            await service.FetchDataAsync(identifier);
        }
        else if (command == "GetStatusAsync")
        {
            string status = await service.GetStatusAsync();
            Console.WriteLine(status);
        }
    }
}