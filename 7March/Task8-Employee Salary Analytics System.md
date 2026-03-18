Question
8
Employee Salary Analytics System
Description
1. Scenario Overview
You are building an Employee Salary Analytics System for an organization.

Employee records are stored in collections, and HR requires insights using LINQ.

Analytics requirements include:

Filtering high-salary employees
Sorting employees by salary
Calculating average salary
Key Constraints
Data stored in memory
No manual iteration
Queries should be flexible and readable
This scenario relies on LINQ over collections.

2. Functional Requirements
2.1 Entity Class
Employee
Properties:

int EmployeeId
string Name
double Salary
2.2 LINQ Usage
LINQ is used to:

Filter (Where)
Sort (OrderByDescending)
Aggregate (Average)
2.3 LINQ Operations Required
High Salary Employees
Salary ≥ 50000
Salary Sorting
Descending order
Average Salary
Compute average
3. Analytics Engine (Core Component)
AnalyticsEngine Responsibilities
Accept employee collection
Apply LINQ queries
Display analytics results
Important Design Rule
No loops
LINQ must be used for all processing
4. Main() Method – Runtime Configuration
Step-by-Step Operations in Main()
Create employee list
Populate hardcoded employee data
Create analytics engine
Filter high salary employees
Sort employees by salary
Calculate average salary
5. Hardcoded Dataset
301, Ramesh, 45000
302, Suresh, 52000
303, Kavya, 68000
304, Anita, 39000
6. Expected Output
High Salary Employees:
Suresh
Kavya

Employees Sorted by Salary:
Kavya - 68000
Suresh - 52000
Ramesh - 45000
Anita - 39000

Average Salary:
Rs 51000
