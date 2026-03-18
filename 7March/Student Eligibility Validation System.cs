using System;

public class Student
{
    public int StudentId { get; set; }
    public string Name { get; set; }
    public int Marks { get; set; }
    public int Age { get; set; }
    public int Attendance { get; set; }
}

public class EligibilityEngine
{
    public void CheckEligibility(Student student, string program, Predicate<Student> rule)
    {
        bool isEligible = rule(student);

        Console.WriteLine("========= ELIGIBILITY CHECK =========");
        Console.WriteLine($"Student Name : {student.Name}");
        Console.WriteLine($"Program      : {program}");
        Console.WriteLine($"Eligible     : {isEligible}");
        Console.WriteLine("-----------------------------------");
        Console.WriteLine();
    }
}

public class Solution
{
    public static void Main()
    {
        Student student = new Student
        {
            StudentId = 301,
            Name = "Ananya",
            Marks = 78,
            Age = 18,
            Attendance = 85
        };

        Predicate<Student> EngineeringEligibility = s => s.Marks >= 60;

        Predicate<Student> MedicalEligibility = s => s.Marks >= 70 && s.Age >= 17;

        Predicate<Student> ManagementEligibility = s => s.Marks >= 55 && s.Attendance >= 75;

        EligibilityEngine engine = new EligibilityEngine();

        engine.CheckEligibility(student, "Engineering", EngineeringEligibility);
        engine.CheckEligibility(student, "Medical", MedicalEligibility);
        engine.CheckEligibility(student, "Management", ManagementEligibility);
    }
}