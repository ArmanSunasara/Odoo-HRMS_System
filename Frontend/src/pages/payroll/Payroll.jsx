import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { payrollService } from "../../services/payrollService";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { formatDate, formatCurrency } from "../../utils/helpers";
import api from "../../services/api";

function Payroll() {
  const { user } = useSelector((state) => state.auth);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [payrollForm, setPayrollForm] = useState({
    userId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
  });
  const [employees, setEmployees] = useState([]);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchPayrollData();
    if (isAdmin) {
      fetchEmployees();
    }
  }, []);

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const response = await payrollService.getPayrollRecords(
        isAdmin ? {} : { userId: user?._id || user?.id }
      );
      const payrollData = Array.isArray(response)
        ? response
        : response.data || [];
      setPayrollRecords(payrollData);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      alert("Failed to fetch payroll records");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/users");
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data?.users || [];
      setEmployees(usersData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetailsModal(true);
  };

  const handleCreatePayroll = async (e) => {
    e.preventDefault();
    try {
      await payrollService.createPayroll(payrollForm);
      alert("Payroll created successfully!");
      setShowCreateModal(false);
      setPayrollForm({
        userId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
      });
      fetchPayrollData();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to create payroll record"
      );
    }
  };

  const calculateNetSalary = (payroll) => {
    const basic = payroll.basicSalary || payroll.salaryStructure?.basicSalary || 0;
    const allowances = payroll.allowances || payroll.salaryStructure?.allowances || 0;
    const deductions = payroll.deductions || payroll.salaryStructure?.deductions || 0;
    return basic + allowances - deductions;
  };

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || "";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-main">
          <div className="page-header">
            <h1>Payroll Management</h1>
            <p>
              {isAdmin
                ? "View and manage employee payroll"
                : "View your salary details"}
            </p>
            {isAdmin && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="page-header-action"
              >
                Create Payroll
              </Button>
            )}
          </div>

          {loading ? (
            <Loader message="Loading payroll records..." />
          ) : payrollRecords.length > 0 ? (
            <>
              {/* Payroll Records Table */}
              <Card title={isAdmin ? "All Payroll Records" : "Your Payroll Records"}>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {isAdmin && <th>Employee</th>}
                        <th>Period</th>
                        <th>Basic Salary</th>
                        <th>Allowances</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollRecords
                        .sort(
                          (a, b) =>
                            new Date(b.year, b.month - 1) -
                            new Date(a.year, a.month - 1)
                        )
                        .map((payroll, index) => (
                          <tr key={payroll._id || payroll.id || index}>
                            {isAdmin && (
                              <td>
                                {payroll.userId?.name ||
                                  payroll.user?.name ||
                                  "Employee"}
                              </td>
                            )}
                            <td>
                              {getMonthName(payroll.month)} {payroll.year}
                            </td>
                            <td>
                              {formatCurrency(
                                payroll.basicSalary ||
                                  payroll.salaryStructure?.basicSalary ||
                                  0
                              )}
                            </td>
                            <td>
                              {formatCurrency(
                                payroll.allowances ||
                                  payroll.salaryStructure?.allowances ||
                                  0
                              )}
                            </td>
                            <td>
                              {formatCurrency(
                                payroll.deductions ||
                                  payroll.salaryStructure?.deductions ||
                                  0
                              )}
                            </td>
                            <td>
                              <strong>
                                {formatCurrency(calculateNetSalary(payroll))}
                              </strong>
                            </td>
                            <td>
                              <span
                                className={`badge badge-${
                                  payroll.status === "PAID"
                                    ? "success"
                                    : payroll.status === "PENDING"
                                    ? "warning"
                                    : "info"
                                }`}
                              >
                                {payroll.status || "PENDING"}
                              </span>
                            </td>
                            <td>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(payroll)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <div className="empty-state">
                <p>No payroll records found.</p>
              </div>
            </Card>
          )}

          {/* Payroll Details Modal */}
          <Modal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedPayroll(null);
            }}
            title="Payroll Details"
            size="lg"
          >
            {selectedPayroll && (
              <div className="payroll-details">
                <div className="detail-section">
                  <h3>Employee Information</h3>
                  <div className="detail-item">
                    <strong>Name:</strong>{" "}
                    {selectedPayroll.userId?.name ||
                      selectedPayroll.user?.name ||
                      "N/A"}
                  </div>
                  <div className="detail-item">
                    <strong>Employee ID:</strong>{" "}
                    {selectedPayroll.userId?.employeeId ||
                      selectedPayroll.user?.employeeId ||
                      "N/A"}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Payroll Period</h3>
                  <div className="detail-item">
                    <strong>Month:</strong> {getMonthName(selectedPayroll.month)}
                  </div>
                  <div className="detail-item">
                    <strong>Year:</strong> {selectedPayroll.year}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Salary Breakdown</h3>
                  <div className="salary-breakdown">
                    <div className="breakdown-item">
                      <span>Basic Salary:</span>
                      <span>
                        {formatCurrency(
                          selectedPayroll.basicSalary ||
                            selectedPayroll.salaryStructure?.basicSalary ||
                            0
                        )}
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span>Allowances:</span>
                      <span className="text-success">
                        +{" "}
                        {formatCurrency(
                          selectedPayroll.allowances ||
                            selectedPayroll.salaryStructure?.allowances ||
                            0
                        )}
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span>Deductions:</span>
                      <span className="text-danger">
                        -{" "}
                        {formatCurrency(
                          selectedPayroll.deductions ||
                            selectedPayroll.salaryStructure?.deductions ||
                            0
                        )}
                      </span>
                    </div>
                    <div className="breakdown-item breakdown-total">
                      <span>
                        <strong>Net Salary:</strong>
                      </span>
                      <span>
                        <strong>
                          {formatCurrency(calculateNetSalary(selectedPayroll))}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-item">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge badge-${
                        selectedPayroll.status === "PAID"
                          ? "success"
                          : selectedPayroll.status === "PENDING"
                          ? "warning"
                          : "info"
                      }`}
                    >
                      {selectedPayroll.status || "PENDING"}
                    </span>
                  </div>
                  {selectedPayroll.createdAt && (
                    <div className="detail-item">
                      <strong>Created:</strong>{" "}
                      {formatDate(selectedPayroll.createdAt, "dd/MM/yyyy")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal>

          {/* Create Payroll Modal (Admin only) */}
          {isAdmin && (
            <Modal
              isOpen={showCreateModal}
              onClose={() => {
                setShowCreateModal(false);
                setPayrollForm({
                  userId: "",
                  month: new Date().getMonth() + 1,
                  year: new Date().getFullYear(),
                  basicSalary: 0,
                  allowances: 0,
                  deductions: 0,
                });
              }}
              title="Create Payroll Record"
              size="md"
            >
              <form onSubmit={handleCreatePayroll}>
                <div className="form-group">
                  <label htmlFor="userId" className="form-label">
                    Employee *
                  </label>
                  <select
                    id="userId"
                    name="userId"
                    value={payrollForm.userId}
                    onChange={(e) =>
                      setPayrollForm({ ...payrollForm, userId: e.target.value })
                    }
                    className="form-input"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id || emp.id} value={emp._id || emp.id}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="month" className="form-label">
                      Month *
                    </label>
                    <select
                      id="month"
                      name="month"
                      value={payrollForm.month}
                      onChange={(e) =>
                        setPayrollForm({
                          ...payrollForm,
                          month: parseInt(e.target.value),
                        })
                      }
                      className="form-input"
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (m) => (
                          <option key={m} value={m}>
                            {getMonthName(m)}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="year" className="form-label">
                      Year *
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={payrollForm.year}
                      onChange={(e) =>
                        setPayrollForm({
                          ...payrollForm,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="form-input"
                      min="2020"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="basicSalary" className="form-label">
                    Basic Salary *
                  </label>
                  <input
                    type="number"
                    id="basicSalary"
                    name="basicSalary"
                    value={payrollForm.basicSalary}
                    onChange={(e) =>
                      setPayrollForm({
                        ...payrollForm,
                        basicSalary: parseFloat(e.target.value),
                      })
                    }
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="allowances" className="form-label">
                    Allowances
                  </label>
                  <input
                    type="number"
                    id="allowances"
                    name="allowances"
                    value={payrollForm.allowances}
                    onChange={(e) =>
                      setPayrollForm({
                        ...payrollForm,
                        allowances: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deductions" className="form-label">
                    Deductions
                  </label>
                  <input
                    type="number"
                    id="deductions"
                    name="deductions"
                    value={payrollForm.deductions}
                    onChange={(e) =>
                      setPayrollForm({
                        ...payrollForm,
                        deductions: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="modal-footer">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Payroll
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payroll;
