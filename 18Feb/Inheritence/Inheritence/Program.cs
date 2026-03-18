// Inheritence means getting some thing(properties) as heredity.
// The variables and methods are accessible to the sub class, but keep in mind that only public ones
// And the methods are accessible can be called without creating the object of that super class
// The class which is inherited is called super class and the class which inherits is called sub class
// Promotes code reuability and reduce complexity

using System;

namespace InheritenceDemo
{
    // Interface should be outside classes
    interface Department
    {
        string DepartmentName { get; set; }
        void DisplayDepartmentDetails();
    }

    public class Person
    {
        private string name;
        private int age;

        public void GetInformation()
        {
            Console.WriteLine("Enter your name:");
            name = Console.ReadLine();

            Console.WriteLine("Enter your age:");
            age = int.Parse(Console.ReadLine());
        }

        public void DisplayInformation()
        {
            Console.WriteLine(
                "Welcome to .NET Training Program Mr./Ms. {0} and your age is {1}",
                name, age
            );
        }
    }

    public class Employee : Person
    {
        private string CompanyName;
        private int EmployeeID;
        protected int EmployeeScore;   // protected so subclass can use

        public int GetEmployeeInformation()
        {
            Console.WriteLine("Enter your Company Name:");
            CompanyName = Console.ReadLine();

            Console.WriteLine("Enter your Employee ID:");
            EmployeeID = int.Parse(Console.ReadLine());

            Console.WriteLine("Enter your Employee Score:");
            EmployeeScore = int.Parse(Console.ReadLine());

            return EmployeeScore;
        }

        public void DisplayEmployeeInformation()
        {
            Console.WriteLine(
                "Company: {0}, Employee ID: {1}, Score: {2}",
                CompanyName, EmployeeID, EmployeeScore
            );
        }
    }

    // Implements Department interface
    public class GradeLevel : Employee, Department
    {
        public string DepartmentName { get; set; }

        public void CheckEligibility()
        {
            Console.WriteLine("Every Employee should have score above 150");

            if (EmployeeScore > 150)
            {
                Console.WriteLine("Congratulations! You are eligible for the next level.");
            }
            else
            {
                Console.WriteLine("Unfortunately, you aren't eligible.");
            }
        }

        public void DisplayDepartmentDetails()
        {
            Console.WriteLine("Department Name: {0}", DepartmentName);
        }
    }

    public class TestProgram
    {
        static void Main(string[] args)
        {
            GradeLevel gradeLevel = new GradeLevel();

            gradeLevel.GetInformation();
            gradeLevel.DisplayInformation();

            gradeLevel.GetEmployeeInformation();
            gradeLevel.DisplayEmployeeInformation();

            gradeLevel.DepartmentName = "Software Engineering";
            gradeLevel.DisplayDepartmentDetails();

            gradeLevel.CheckEligibility();
        }
    }
}
