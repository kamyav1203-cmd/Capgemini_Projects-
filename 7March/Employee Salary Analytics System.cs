using System;
using System.Collections.Generic;
using System.Linq;

public class Employee
{
    public int EmployeeId { get; set; }
    public string Name { get; set; }
    public double Salary { get; set; }
}

public class AnalyticsEngine
{
    private List<Employee> employees;

    public AnalyticsEngine(List<Employee> employees)
    {
        this.employees = employees;
    }

    public IEnumerable<Employee> GetHighSalaryEmployees()
    {
        return employees.Where(e => e.Salary >= 50000);
    }

    public IEnumerable<Employee> GetSortedEmployees()
    {
        return employees.OrderByDescending(e => e.Salary);
    }

    public double GetAverageSalary()
    {
        return employees.Average(e => e.Salary);
    }
}

public class Solution
{
    public static void Main()
    {
        List<Employee> employees = new List<Employee>
        {
            new Employee { EmployeeId = 301, Name = "Ramesh", Salary = 45000 },
            new Employee { EmployeeId = 302, Name = "Suresh", Salary = 52000 },
            new Employee { EmployeeId = 303, Name = "Kavya", Salary = 68000 },
            new Employee { EmployeeId = 304, Name = "Anita", Salary = 39000 }
        };

        AnalyticsEngine engine = new AnalyticsEngine(employees);

        Console.WriteLine("High Salary Employees:");
        foreach (var e in engine.GetHighSalaryEmployees())
            Console.WriteLine(e.Name);

        Console.WriteLine();

        Console.WriteLine("Employees Sorted by Salary:");
        foreach (var e in engine.GetSortedEmployees())
            Console.WriteLine($"{e.Name} - {(int)e.Salary}");

        Console.WriteLine();

        Console.WriteLine("Average Salary:");
        Console.WriteLine($"Rs {(int)engine.GetAverageSalary()}");
        Console.WriteLine();
    }
}