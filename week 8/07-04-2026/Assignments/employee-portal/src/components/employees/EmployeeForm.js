import React, { useState, useEffect } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { X } from 'lucide-react';

const EmployeeForm = ({ employee, onClose }) => {
  const { addEmployee, updateEmployee } = useEmployees();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (employee) {
      updateEmployee(employee.id, formData);
    } else {
      addEmployee(formData);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button onClick={onClose} className="btn btn-icon">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="form-group">
            <label>Salary *</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {employee ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;