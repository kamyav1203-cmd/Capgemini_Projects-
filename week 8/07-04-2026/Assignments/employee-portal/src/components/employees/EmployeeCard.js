import React from 'react';
import { Mail, Briefcase, Calendar, Edit2, Trash2 } from 'lucide-react';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="employee-card">
      <div className="employee-header">
        <div className="employee-avatar">
          {employee.name.charAt(0).toUpperCase()}
        </div>
        <div className="employee-info">
          <h3>{employee.name}</h3>
          <span className="badge">{employee.status}</span>
        </div>
      </div>

      <div className="employee-details">
        <div className="detail-row">
          <Mail size={16} />
          <span>{employee.email}</span>
        </div>
        <div className="detail-row">
          <Briefcase size={16} />
          <span>{employee.position}</span>
        </div>
        <div className="detail-row">
          <Calendar size={16} />
          <span>Joined: {employee.joinDate}</span>
        </div>
      </div>

      <div className="employee-footer">
        <div className="department-tag">{employee.department}</div>
        <div className="salary">${employee.salary.toLocaleString()}</div>
      </div>

      <div className="employee-actions">
        <button onClick={() => onEdit(employee)} className="btn btn-icon btn-edit">
          <Edit2 size={18} />
        </button>
        <button onClick={() => onDelete(employee.id)} className="btn btn-icon btn-delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;