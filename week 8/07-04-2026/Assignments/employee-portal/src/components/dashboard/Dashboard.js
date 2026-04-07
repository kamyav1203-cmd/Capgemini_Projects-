import React from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../hooks/useAuth';
import { Users, UserCheck, Building2, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { analytics } = useEmployees();
  const { user } = useAuth();

  const stats = [
    {
      icon: Users,
      label: 'Total Employees',
      value: analytics.totalEmployees,
      color: 'blue'
    },
    {
      icon: UserCheck,
      label: 'Active Employees',
      value: analytics.activeEmployees,
      color: 'green'
    },
    {
      icon: Building2,
      label: 'Departments',
      value: analytics.departments,
      color: 'purple'
    },
    {
      icon: DollarSign,
      label: 'Avg. Salary',
      value: `$${analytics.averageSalary.toLocaleString()}`,
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">
              <stat.icon size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user?.name}!</h2>
          <p>Manage your workforce efficiently with our comprehensive employee management system.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;