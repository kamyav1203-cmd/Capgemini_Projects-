import React, { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import EmployeeCard from './EmployeeCard';
import EmployeeForm from './EmployeeForm';
import { Search, Plus, Filter } from 'lucide-react';

const EmployeeList = () => {
  const {
    employees,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    departments,
    deleteEmployee
  } = useEmployees();

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div className="employees">
      <div className="page-header">
        <h1>Employee Management</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={20} />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="employee-grid">
        {employees.length === 0 ? (
          <div className="empty-state">
            <p>No employees found</p>
          </div>
        ) : (
          employees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default EmployeeList;