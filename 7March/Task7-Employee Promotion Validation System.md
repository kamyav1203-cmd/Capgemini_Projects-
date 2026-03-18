Question
7
Employee Promotion Validation System
Description
1. Scenario Overview
You are building an Employee Promotion Validation System for an organization.

Before promoting employees, HR must validate promotion eligibility rules.

Different departments follow different rules:

Technical Department → Experience-based
HR Department → Experience + performance
Management Department → Experience + salary
Key Constraints
Promotion rules change over time
Validation must be reusable
Core logic must not change
Rules return only true or false
This scenario uses Predicate for validation logic.

2. Functional Requirements
2.1 Entity Class
Employee
Properties:

int EmployeeId
string Name
int Experience
double Salary
int PerformanceRating
2.2 Predicate Definition
Predicate<Employee>
Purpose:

Represents a promotion eligibility condition
Returns boolean result
2.3 Promotion Rules
TechnicalPromotionRule
Rule:

Experience ≥ 3 → Eligible
HRPromotionRule
Rule:

Experience ≥ 2 AND PerformanceRating ≥ 4 → Eligible
ManagementPromotionRule
Rule:

Experience ≥ 5 AND Salary ≥ 60000 → Eligible
3. Promotion Engine (Core Component)
PromotionEngine Responsibilities
Accept Employee
Accept Predicate<Employee>
Invoke rule
Display promotion status
Important Design Rule
PromotionEngine must NOT contain rule logic
Core Method
Validate(Employee employee, string department, Predicate<Employee> rule)
4. Main() Method – Runtime Configuration
Step-by-Step Operations in Main()
Create employee object
Define promotion predicates
Create promotion engine
Validate for Technical department
Validate for HR department
Validate for Management department
5. Hardcoded Dataset
EmployeeId : 501
Name       : Ravi
Experience : 5
Salary     : 65000
Rating     : 4
6. Expected Output
========= PROMOTION VALIDATION =========
Employee Name : Ravi
Department    : Technical
Eligible      : True
--------------------------------------

========= PROMOTION VALIDATION =========
Employee Name : Ravi
Department    : HR
Eligible      : True
--------------------------------------

========= PROMOTION VALIDATION =========
Employee Name : Ravi
Department    : Management
Eligible      : True
--------------------------------------
