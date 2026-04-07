import React, { useMemo } from 'react';
import { useEmployees } from '../../hooks/useEmployees';

const Analytics = () => {
  const { allEmployees } = useEmployees();

  const departmentStats = useMemo(() => {
    const stats = {};
    allEmployees.forEach(emp => {
      if (!stats[emp.department]) {
        stats[emp.department] = { count: 0, totalSalary: 0 };
      }
      stats[emp.department].count++;
      stats[emp.department].totalSalary += emp.salary;
    });

    return Object.entries(stats).map(([dept, data]) => ({
      department: dept,
      count: data.count,
      avgSalary: Math.round(data.totalSalary / data.count)
    }));
  }, [allEmployees]);

  const statusStats = useMemo(() => {
    const active = allEmployees.filter(e => e.status === 'Active').length;
    return {
      active,
      percentage: ((active / allEmployees.length) * 100).toFixed(1)
    };
  }, [allEmployees]);

  return (
    <div className="analytics">
      <h1>Analytics</h1>

      <div className="analytics-overview">
        <div className="analytics-card">
          <h3>Employee Status</h3>
          <div className="big-stat">{statusStats.percentage}%</div>
          <p>Active Employees</p>
        </div>
      </div>

      <div className="analytics-section">
        <h2>Department Overview</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
                <th>Avg. Salary</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map(stat => (
                <tr key={stat.department}>
                  <td><strong>{stat.department}</strong></td>
                  <td>{stat.count}</td>
                  <td>${stat.avgSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;