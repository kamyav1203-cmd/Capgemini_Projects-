import React, { useState } from "react";
import EmployeeList from "./features/employees/employeeList";
import EmployeeAdd from "./features/employees/employeeAdd";
import EmployeeEdit from "./features/employees/employeeEdit";

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div>
      <h1>Employee Management</h1>

      <EmployeeAdd />

      <EmployeeList
        onEdit={(employee) => setSelectedEmployee(employee)}
      />

      {selectedEmployee && (
        <EmployeeEdit
          selectedEmployee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}  // ✅ FIX HERE
        />
      )}
    </div>
  );
}

export default App;