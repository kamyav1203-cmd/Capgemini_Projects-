Question
6
Product Inventory Management System
Description
1. Scenario Overview
You are building a Product Inventory Management System for a retail store.

Products are stored in collections, and management needs real-time insights using LINQ.

Requirements include:

Filtering low-stock products
Sorting products by price
Calculating total inventory value
Key Constraints
Inventory data is in-memory
Queries must be concise and readable
Frequent changes in reporting requirements
This requires LINQ-based data querying.

2. Functional Requirements
2.1 Entity Class
Product
Properties:

int ProductId
string Name
double Price
int Quantity
2.2 LINQ Usage
LINQ is used to:

Filter (Where)
Sort (OrderBy)
Aggregate (Sum)
2.3 LINQ Operations Required
Low Stock Products
Quantity < 10
Price Sorting
Ascending order
Inventory Value
Price × Quantity
3. Inventory Engine (Core Component)
InventoryEngine Responsibilities
Accept product collection
Apply LINQ queries
Display inventory reports
Important Design Rule
No traditional loops
Only LINQ expressions allowed
4. Main() Method – Runtime Configuration
Step-by-Step Operations in Main()
Create product list
Add hardcoded inventory data
Create inventory engine
Filter low stock products using LINQ
Sort products using LINQ
Calculate total inventory value
5. Hardcoded Dataset
201, Laptop, 60000, 5
202, Mouse, 800, 25
203, Keyboard, 1500, 8
204, Monitor, 12000, 12
6. Expected Output
Low Stock Products:
Laptop
Keyboard

Products Sorted by Price:
Mouse - 800
Keyboard - 1500
Monitor - 12000
Laptop - 60000

Total Inventory Value:
Rs 476000