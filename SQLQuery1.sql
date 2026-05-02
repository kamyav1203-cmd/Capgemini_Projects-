CREATE DATABASE EMPSystem;
GO
USE EMPSystem;
GO

CREATE TABLE Employees (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100),
    Department NVARCHAR(50),
    Salary DECIMAL(10,2),
    CreatedDate DATETIME DEFAULT GETDATE()
);
GO
INSERT INTO Employees (Name, Department, Salary)
VALUES 
('John', 'HR', 30000),
('Alice', 'IT', 50000),
('Bob', 'Finance', 40000);
GO
SELECT * FROM Employees;
GO
CREATE PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT * FROM Employees;
END;
GO
EXEC GetAllEmployees;