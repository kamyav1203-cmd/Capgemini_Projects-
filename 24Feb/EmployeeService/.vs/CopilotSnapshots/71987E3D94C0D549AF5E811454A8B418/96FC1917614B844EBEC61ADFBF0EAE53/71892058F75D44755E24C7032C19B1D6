using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace ConsoleApp1
{
    internal class EmployeeModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public double Salary { get; set; }
    }

    internal class EmployeeService
    {
        private readonly string connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=EmployeeModel;Integrated Security=True";

        private void InitializeDatabase()
        {
            string masterConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=master;Integrated Security=True";
            using SqlConnection conn = new SqlConnection(masterConnectionString);
            conn.Open();

            string checkDbQuery = "SELECT database_id FROM sys.databases WHERE Name = 'EmployeeModel'";
            using SqlCommand checkCmd = new SqlCommand(checkDbQuery, conn);
            object result = checkCmd.ExecuteScalar();

            if (result == null)
            {
                string createDbQuery = "CREATE DATABASE EmployeeModel";
                using SqlCommand createDbCmd = new SqlCommand(createDbQuery, conn);
                createDbCmd.ExecuteNonQuery();
            }

            using SqlConnection empConn = new SqlConnection(connectionString);
            empConn.Open();
            string createTableQuery = @"
                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Employee')
                CREATE TABLE Employee (
                    Id INT PRIMARY KEY IDENTITY(1,1),
                    Name NVARCHAR(100),
                    Department NVARCHAR(100),
                    Salary FLOAT
                )";
            using SqlCommand createTableCmd = new SqlCommand(createTableQuery, empConn);
            createTableCmd.ExecuteNonQuery();
        }

        public void Run()
        {
            InitializeDatabase();

            while (true)
            {
                Console.Clear();
                Console.WriteLine("Employee Management System");
                Console.WriteLine("1. View all employees");
                Console.WriteLine("2. Insert new employee");
                Console.WriteLine("3. Update employee");
                Console.WriteLine("4. Delete employee");
                Console.WriteLine("5. Search by Employee ID");
                Console.WriteLine("6. Search by Department Name");
                Console.WriteLine("7. Exit");
                Console.Write("Enter your choice: ");

                if (!int.TryParse(Console.ReadLine(), out int choice))
                {
                    Console.WriteLine("Invalid input. Please enter a number.");
                    Console.WriteLine("\nPress Enter key to continue...");
                    Console.ReadLine();
                    continue;
                }

                try
                {
                    switch (choice)
                    {
                        case 1:
                            ViewAllEmployees();
                            break;
                        case 2:
                            InsertEmployee();
                            break;
                        case 3:
                            UpdateEmployee();   
                            break;
                        case 4:
                            DeleteEmployee();
                            break;
                        case 5:
                            SearchById();
                            break;
                        case 6:
                            SearchByDepartment();
                            break;
                        case 7:
                            return;
                        default:
                            Console.WriteLine("Invalid choice. Please try again.");
                            break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }

                Console.WriteLine("\nPress Enter key to continue...");
                Console.ReadLine();
            }
        }
        public void ViewAllEmployees()
        {
            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();
            string query = "SELECT Id, Name, Department, Salary FROM Employee";
            using SqlCommand cmd = new SqlCommand(query, conn);
            using SqlDataReader reader = cmd.ExecuteReader();
            Console.WriteLine("\n------ Employee List -------");
            while (reader.Read())
            {
                Console.WriteLine($"{reader.GetInt32(0)}" +
                    $"| {reader.GetString(1)}" +
                    $"| {reader.GetString(2)}" +
                    $"| {reader.GetDouble(3)}");
            }
        }

        public void InsertEmployee()
        {
            EmployeeModel emp = new EmployeeModel();
            Console.WriteLine("Enter Employee Name: ");
            emp.Name = Console.ReadLine() ?? string.Empty;
            Console.WriteLine("Enter Employee Department: ");
            emp.Department = Console.ReadLine() ?? string.Empty;
            Console.WriteLine("Enter Employee Salary: ");
            double salary;
            while (!double.TryParse(Console.ReadLine(), out salary))
            {
                Console.WriteLine("Invalid input. Enter Employee Salary: ");
            }
            emp.Salary = salary;

            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();
            string query = "INSERT INTO Employee (Name, Department, Salary) VALUES (@Name, @Department, @Salary)";
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Name", emp.Name);
            cmd.Parameters.AddWithValue("@Department", emp.Department);
            cmd.Parameters.AddWithValue("@Salary", emp.Salary);
            cmd.ExecuteNonQuery();
            Console.WriteLine("Employee inserted successfully.");
        }
        public void DeleteEmployee()
        {
            Console.WriteLine("Enter Employee ID to delete: ");
            int id;
            while (!int.TryParse(Console.ReadLine(), out id))
            {
                Console.WriteLine("Invalid input. Enter Employee ID to delete: ");
            }
            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();
            string query = "DELETE FROM Employee WHERE Id = @Id";
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            int rowsAffected = cmd.ExecuteNonQuery();
            if (rowsAffected > 0)
                Console.WriteLine("Employee deleted successfully.");
            else
                Console.WriteLine("Employee not found.");
        }
        public void UpdateEmployee()
        {
            Console.WriteLine("Enter Employee ID to update: ");
            int id;
            while (!int.TryParse(Console.ReadLine(), out id))
            {
                Console.WriteLine("Invalid input. Enter Employee ID to update: ");
            }

            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();
            string checkQuery = "SELECT COUNT(*) FROM Employee WHERE Id = @Id";
            using SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
            checkCmd.Parameters.AddWithValue("@Id", id);
            int count = (int)checkCmd.ExecuteScalar();

            if (count == 0)
            {
                Console.WriteLine("Employee not found.");
                return;
            }

            Console.WriteLine("Enter new Employee Name: ");
            string name = Console.ReadLine() ?? string.Empty;
            Console.WriteLine("Enter new Employee Department: ");
            string department = Console.ReadLine() ?? string.Empty;
            Console.WriteLine("Enter new Employee Salary: ");
            double salary;
            while (!double.TryParse(Console.ReadLine(), out salary))
            {
                Console.WriteLine("Invalid input. Enter Employee Salary: ");
            }

            string query = "UPDATE Employee SET Name = @Name, Department = @Department, Salary = @Salary WHERE Id = @Id";
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Name", name);
            cmd.Parameters.AddWithValue("@Department", department);
            cmd.Parameters.AddWithValue("@Salary", salary);
            cmd.ExecuteNonQuery();
            Console.WriteLine("Employee updated successfully.");
        }

        public void SearchById()
        {
            Console.WriteLine("Enter Employee ID: ");
            int id;
            while (!int.TryParse(Console.ReadLine(), out id))
            {
                Console.WriteLine("Invalid input. Enter Employee ID: ");
            }

            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();
            string query = "SELECT Id, Name, Department, Salary FROM Employee WHERE Id = @Id";
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            using SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                Console.WriteLine("\n------ Employee Details -------");
                Console.WriteLine($"ID: {reader.GetInt32(0)}");
                Console.WriteLine($"Name: {reader.GetString(1)}");
                Console.WriteLine($"Department: {reader.GetString(2)}");
                Console.WriteLine($"Salary: {reader.GetDouble(3)}");
            }
            else
            {
                Console.WriteLine("Employee not found.");
            }
        }

        public void SearchByDepartment()
        {
            Console.WriteLine("Enter Department Name: ");
            string department = Console.ReadLine() ?? string.Empty;

            using SqlConnection conn = new SqlConnection(connectionString);
            conn.Open();
            string query = "SELECT Id, Name, Department, Salary FROM Employee WHERE Department = @Department";
            using SqlCommand cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Department", department);
            using SqlDataReader reader = cmd.ExecuteReader();

            Console.WriteLine($"\n------ Employees in {department} Department -------");
            bool found = false;
            while (reader.Read())
            {
                found = true;
                Console.WriteLine($"{reader.GetInt32(0)}" +
                    $"| {reader.GetString(1)}" +
                    $"| {reader.GetString(2)}" +
                    $"| {reader.GetDouble(3)}");
            }

            if (!found)
            {
                Console.WriteLine("No employees found in this department.");
            }
        }
        class Program
        {
            static void Main(string[] args)
            {
                EmployeeService service = new EmployeeService();
                service.Run();
            }
        }
    }
}