Question
1
GenericDES
Description
Step-1 Scenario Overview
You are building a Generic Data Export System for an enterprise application.

Different modules need export functionality:

·        Employee List Export

·        Product List Export

·        Order List Export

Each module contains different data types, but export operations remain the same.

Key Constraints
·        Export logic must be reusable for any data type

·        Type safety must be guaranteed

·        No duplicate export implementations

·        Must support multiple export formats

·        Should dynamically detect object properties

This requirement demands generic programming with reflection, achieved using Generics.

Step-2 Functional Requirements
2.1 Generic Export Class
ExportService

Purpose:
·        Export objects of any type T

·        Convert list of objects into CSV format

·        Convert list of objects into JSON format

·        Avoid rewriting export logic for every model

2.2 Generic Class Definition
class ExportService<T>
2.3 Export Operations
Methods:
string ExportToCSV(List<T> data)

string ExportToJSON(List<T> data)
Method Responsibilities
🔹
ExportToCSV
·        Dynamically read properties using Reflection

·        Generate header row automatically

·        Generate comma-separated data rows

·        Return formatted CSV string

🔹
ExportToJSON
·        Serialize object list into JSON

·        Maintain type safety

·        Return formatted JSON string

Step-3 Export Engine (Core Component)
Export Responsibilities
·        Work with any entity type

·        Remain independent of actual object type

·        Automatically detect object structure

·        Convert data into multiple formats

·        Maintain reusable enterprise utility design

Step-4 Main() Method – Runtime Configuration
Step-by-Step Operations in Main()
1.     Create list of Employee objects

2.     Create list of Product objects

3.     Create ExportService for Employee

4.     Create ExportService for Product

5.     Call ExportToCSV()

6.     Call ExportToJSON()

7.     Display exported results

Step-5 Hardcoded Dataset
Employee List:
Id

Name

Salary

1

John

50000

2

Sara

60000

Product List:
Id

Name

Price

101

Laptop

75000

102

Mobile

25000

Step-6 Expected Output
========= EMPLOYEE CSV =========
Id,Name,Salary

1,John,50000

2,Sara,60000
========= EMPLOYEE JSON =========
[

  {

    "Id": 1,

    "Name": "John",

    "Salary": 50000

  },

  {

    "Id": 2,

    "Name": "Sara",

    "Salary": 60000

  }

]
========= PRODUCT CSV =========
Id,Name,Price

101,Laptop,75000

102,Mobile,25000
========= PRODUCT JSON =========
[

  {

    "Id": 101,

    "Name": "Laptop",

    "Price": 75000

  },

  {

    "Id": 102,

    "Name": "Mobile",

    "Price": 25000

  }

]