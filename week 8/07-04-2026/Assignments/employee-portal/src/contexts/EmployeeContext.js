import React, { createContext, useState, useCallback, useMemo } from 'react';

export const EmployeeContext = createContext();

const INITIAL_EMPLOYEES = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@company.com',
    position: 'Senior Developer',
    department: 'Engineering',
    salary: 95000,
    joinDate: '2022-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@company.com',
    position: 'Product Manager',
    department: 'Product',
    salary: 105000,
    joinDate: '2021-06-20',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@company.com',
    position: 'UX Designer',
    department: 'Design',
    salary: 85000,
    joinDate: '2023-03-10',
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@company.com',
    position: 'Marketing Manager',
    department: 'Marketing',
    salary: 90000,
    joinDate: '2022-08-01',
    status: 'Active'
  }
];

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');

  const addEmployee = useCallback((employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  }, []);

  const updateEmployee = useCallback((id, updatedData) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...updatedData } : emp))
    );
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  const getEmployeeById = useCallback((id) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'All' || emp.department === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, filterDepartment]);

  const departments = useMemo(() => {
    return ['All', ...new Set(employees.map(emp => emp.department))];
  }, [employees]);

  const analytics = useMemo(() => {
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'Active').length,
      departments: departments.length - 1,
      averageSalary: Math.round(
        employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
      )
    };
  }, [employees, departments]);

  const value = {
    employees: filteredEmployees,
    allEmployees: employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    departments,
    analytics
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};