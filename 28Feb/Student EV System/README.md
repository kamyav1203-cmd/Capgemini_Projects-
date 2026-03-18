Question
3
Student EV System
Description
Question: Student Eligibility Validation SystemDescription:
1. Scenario Overview
You are building a Student Eligibility Validation System for a university admission portal.

Before allowing students to apply for courses, the system must validate eligibility conditions.

Different programs have different eligibility rules:

Engineering Program → Based on marks
Medical Program → Based on marks + age
Management Program → Based on marks + attendance
Key Constraints
Eligibility rules may change every academic year
Validation logic must be reusable
Core validation engine must remain unchanged
Validation logic should return true or false
This requirement demands condition-based validation, which is achieved using Predicate.

2. Functional Requirements
2.1 Entity Class
Student
Properties:

int StudentId
string Name
int Marks
int Age
int Attendance
This class represents student data for eligibility validation.

2.2 Predicate Definition
Predicate<Student>
Purpose:

Represents an eligibility condition
Accepts a Student object
Returns true if eligible, otherwise false
Enables flexible rule validation at runtime
2.3 Eligibility Rule Definitions
EngineeringEligibility
Rule:

Marks ≥ 60 → Eligible
MedicalEligibility
Rule:

Marks ≥ 70 AND Age ≥ 17 → Eligible
ManagementEligibility
Rule:

Marks ≥ 55 AND Attendance ≥ 75 → Eligible
3. Eligibility Engine (Core Component)
EligibilityEngine Responsibilities
Accept Student data
Accept a Predicate<Student>
Invoke predicate
Display eligibility status
Important Design Rule
EligibilityEngine must NOT contain eligibility rules
Core Method
CheckEligibility(Student student, string program, Predicate<Student> rule)
4. Main() Method – Runtime Configuration
Step-by-Step Operations in Main()
Create student object
Define eligibility predicates
Create eligibility engine
Validate eligibility for Engineering
Validate eligibility for Medical
Validate eligibility for Management
5. Hardcoded Dataset
StudentId  : 301
Name       : Ananya
Marks      : 78
Age        : 18
Attendance : 85
6. Expected Output
========= ELIGIBILITY CHECK =========
Student Name : Ananya
Program      : Engineering
Eligible     : True
-----------------------------------

========= ELIGIBILITY CHECK =========
Student Name : Ananya
Program      : Medical
Eligible     : True
-----------------------------------

========= ELIGIBILITY CHECK =========
Student Name : Ananya
Program      : Management
Eligible     : True
-----------------------------------