/**
 * PAGE: Employees
 * ----------------
 * PURPOSE: Full CRUD interface for managing employee records.
 *
 * REDUX USAGE:
 * - useSelector → reads employee list and searchQuery from Redux store
 * - dispatch(addEmployee(data))        → adds new employee to Redux store
 * - dispatch(updateEmployee({id,...})) → updates employee in Redux store
 * - dispatch(deleteEmployee(id))       → removes employee from Redux store
 * - dispatch(setSearchQuery(text))     → updates search filter in Redux store
 *
 * LOCAL STATE (useState):
 * Form data, editId, showForm are LOCAL state — they don't need to be
 * in Redux because only this component uses them.
 * RULE: Use Redux for GLOBAL shared state, useState for LOCAL component state.
 *
 * SEARCH:
 * searchQuery stored in Redux so it persists when user navigates away.
 * Filtering happens here using .filter() on the employees list.
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSearchQuery,
} from "../features/employees/employeeSlice";

// Empty form template
const emptyForm = { name: "", dept: "", role: "", salary: "", status: "Active" };

function Employees({ theme }) {
  const dispatch = useDispatch();

  // Read employees list and search query from Redux store
  const { list: employees, searchQuery } = useSelector((state) => state.employees);

  // LOCAL state — only used inside this component
  const [form, setForm]         = useState(emptyForm);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Filter employees based on searchQuery from Redux
  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submit — add or update
  const handleSubmit = () => {
    if (!form.name || !form.dept || !form.role || !form.salary) {
      return alert("Please fill all fields");
    }
    if (editId) {
      // Dispatch update action with id + new data
      dispatch(updateEmployee({ id: editId, ...form, salary: Number(form.salary) }));
      setEditId(null);
    } else {
      // Dispatch add action with new employee data
      dispatch(addEmployee({ ...form, salary: Number(form.salary) }));
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  // Populate form with employee data for editing
  const handleEdit = (emp) => {
    setForm({ name: emp.name, dept: emp.dept, role: emp.role, salary: emp.salary, status: emp.status });
    setEditId(emp.id);
    setShowForm(true);
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: `1px solid ${theme.border}`, borderRadius: "7px",
    background: theme.inputBg, color: theme.text,
    fontSize: "0.9rem", outline: "none", marginBottom: "12px",
  };

  return (
    <div style={{ padding: "32px 28px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "4px" }}>Employees</h1>
          <p style={{ color: theme.subtext }}>Redux-managed CRUD operations</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          style={{
            background: theme.accent, color: "#fff", border: "none",
            padding: "10px 22px", borderRadius: "8px", fontWeight: "700", cursor: "pointer",
          }}
        >
          + Add Employee
        </button>
      </div>

      {/* Add/Edit Form — shown when showForm is true */}
      {showForm && (
        <div style={{
          background: theme.cardBg, border: `1px solid ${theme.border}`,
          borderRadius: "12px", padding: "24px", marginBottom: "24px",
        }}>
          <h3 style={{ marginBottom: "20px" }}>
            {editId ? "✏️ Edit Employee" : "➕ Add New Employee"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ color: theme.subtext, fontSize: "0.82rem" }}>Full Name</label>
              <input style={inputStyle} placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ color: theme.subtext, fontSize: "0.82rem" }}>Department</label>
              <input style={inputStyle} placeholder="Department" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
            </div>
            <div>
              <label style={{ color: theme.subtext, fontSize: "0.82rem" }}>Role</label>
              <input style={inputStyle} placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label style={{ color: theme.subtext, fontSize: "0.82rem" }}>Salary (₹)</label>
              <input style={inputStyle} type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            </div>
          </div>
          <select
            style={{ ...inputStyle, width: "50%" }}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button onClick={handleSubmit} style={{ background: theme.accent, color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
              {editId ? "Update" : "Add"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} style={{ background: "transparent", border: `1px solid ${theme.border}`, color: theme.text, padding: "10px 24px", borderRadius: "8px", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search — dispatches setSearchQuery to Redux */}
      <input
        style={{ ...inputStyle, width: "300px", marginBottom: "16px" }}
        placeholder="🔍 Search by name or department..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />

      {/* Employee Table */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: theme.inputBg }}>
              {["Name", "Department", "Role", "Salary", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: theme.subtext, fontSize: "0.82rem", fontWeight: "700", borderBottom: `1px solid ${theme.border}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "13px 16px", fontWeight: "600" }}>{e.name}</td>
                <td style={{ padding: "13px 16px", color: theme.subtext }}>{e.dept}</td>
                <td style={{ padding: "13px 16px" }}>{e.role}</td>
                <td style={{ padding: "13px 16px", color: theme.accent, fontWeight: "600" }}>₹{e.salary.toLocaleString()}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "20px",
                    fontSize: "0.78rem", fontWeight: "600",
                    background: e.status === "Active" ? "#dcfce7" : "#fef3c7",
                    color:      e.status === "Active" ? "#16a34a" : "#d97706",
                  }}>
                    {e.status}
                  </span>
                </td>
                <td style={{ padding: "13px 16px" }}>
                  {/* Edit button — loads employee into form */}
                  <button onClick={() => handleEdit(e)} style={{ background: "#dbeafe", color: "#2563eb", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "8px", fontWeight: "600", fontSize: "0.82rem" }}>
                    Edit
                  </button>
                  {/* Delete button — dispatches deleteEmployee action */}
                  <button onClick={() => dispatch(deleteEmployee(e.id))} style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.82rem" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: theme.subtext }}>
            No employees found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;