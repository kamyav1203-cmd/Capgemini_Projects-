//Program to get Employee Data
using System;
using System.Collections.Generic;
namespace ConsoleApp
{
    class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string Salary { get; set; }
        public string Position { get; set; }
        public DateTime DateofJoining { get; set; }


        public void GetEmployeeData()
        {
            Console.WriteLine("Enter Employee ID:");
            Id = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Enter Employee Name:");
            Name = Console.ReadLine();
            Console.WriteLine("Enter Employee Department:");
            Department = Console.ReadLine();
            Console.WriteLine("Enter Employee Salary:");
            Salary = Console.ReadLine();
            Console.WriteLine("Enter Employee Position:");
            Position = Console.ReadLine();
            Console.WriteLine("Enter Employee Date of Joining (MM/DD/YYYY):");
            DateofJoining = Convert.ToDateTime(Console.ReadLine());
        }
        public void DisplayEmployeeData()
        {
            Console.WriteLine($"Employee ID: {Id}");
            Console.WriteLine($"Employee Name: {Name}");
            Console.WriteLine($"Department: {Department}");
            Console.WriteLine($"Salary: {Salary}");
            Console.WriteLine($"Position: {Position}");
            Console.WriteLine($"Date of Joining: {DateofJoining.ToShortDateString()}");
            Console.WriteLine("------------------------------");
        }
    }
    class Program
    {
        static List<Employee> employees = new List<Employee>();

        static void Main(string[] args)
        {
            bool exit = false;

            while (!exit)
            {
                Console.WriteLine("\n=== Employee Management System ===");
                Console.WriteLine("1. Add Employee Data");
                Console.WriteLine("2. View All Employees");
                Console.WriteLine("3. Exit");
                Console.Write("Enter your choice: ");

                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        AddEmployee();
                        break;
                    case "2":
                        ViewAllEmployees();
                        break;
                    case "3":
                        exit = true;
                        Console.WriteLine("Thank you for using Employee Management System!");
                        break;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }
            }
        }

        static void AddEmployee()
        {
            Console.WriteLine("\n--- Add New Employee ---");
            Employee emp = new Employee();
            emp.GetEmployeeData();
            employees.Add(emp);
            Console.WriteLine("\nEmployee added successfully!");
        }

        static void ViewAllEmployees()
        {
            Console.WriteLine("\n--- All Employees ---");
            if (employees.Count == 0)
            {
                Console.WriteLine("No employees found.");
            }
            else
            {
                foreach (Employee emp in employees)
                {
                    emp.DisplayEmployeeData();
                }
                Console.WriteLine($"Total Employees: {employees.Count}");
            }
        }
    }
}