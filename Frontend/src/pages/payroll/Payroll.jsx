import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { payrollService } from "../../services/payrollService";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { formatDate, formatCurrency } from "../../utils/helpers";

function Payroll() {
  const { user } = useSelector((state) => state.auth);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        // In a real app, this would fetch from the API
        // const history = await payrollService.getPayrollHistory(user.id);
        // const summary = await payrollService.getPayrollSummary(user.id);

        const mockHistory = [
          {
            id: 1,
            period: "June 2023",
            salary: 5000,
            bonus: 500,
            deductions: 200,
            netPay: 5300,
            date: "2023-06-30",
            status: "Paid",
          },
          {
            id: 2,
            period: "May 2023",
            salary: 5000,
            bonus: 200,
            deductions: 150,
            netPay: 5050,
            date: "2023-05-31",
            status: "Paid",
          },
          {
            id: 3,
            period: "April 2023",
            salary: 5000,
            bonus: 0,
            deductions: 180,
            netPay: 4820,
            date: "2023-04-30",
            status: "Paid",
          },
        ];

        const mockCurrentPayroll = {
          period: "July 2023",
          salary: 5000,
          bonus: 300,
          deductions: 100,
          netPay: 5200,
          status: "Processing",
          dueDate: "2023-07-31",
        };

        setPayrollHistory(mockHistory);
        setCurrentPayroll(mockCurrentPayroll);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [user]);

  const handleDownloadSlip = (payrollId) => {
    // In a real app, this would download the salary slip
    alert(`Downloading salary slip for payroll ID: ${payrollId}`);
  };

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll);
  };

  const closeDetailsModal = () => {
    setSelectedPayroll(null);
  };

  return (
    <div className="payroll-layout">
      <Sidebar />
      <div className="payroll-content">
        <Navbar />
        <div className="payroll-main">
          <h1>Payroll</h1>

          <div className="current-payroll">
            <h2>Current Payroll</h2>
            {currentPayroll ? (
              <div className="payroll-card">
                <div className="payroll-header">
                  <h3>{currentPayroll.period}</h3>
                  <span
                    className={`status ${currentPayroll.status.toLowerCase()}`}
                  >
                    {currentPayroll.status}
                  </span>
                </div>
                <div className="payroll-summary">
                  <div className="summary-item">
                    <p>Salary</p>
                    <p>{formatCurrency(currentPayroll.salary)}</p>
                  </div>
                  <div className="summary-item">
                    <p>Bonus</p>
                    <p>{formatCurrency(currentPayroll.bonus)}</p>
                  </div>
                  <div className="summary-item">
                    <p>Deductions</p>
                    <p>-{formatCurrency(currentPayroll.deductions)}</p>
                  </div>
                  <div className="summary-item total">
                    <p>Net Pay</p>
                    <p>{formatCurrency(currentPayroll.netPay)}</p>
                  </div>
                </div>
                <p className="due-date">
                  Due Date: {formatDate(currentPayroll.dueDate)}
                </p>
              </div>
            ) : (
              <p>No current payroll information available.</p>
            )}
          </div>

          <div className="payroll-history">
            <h2>Payroll History</h2>
            {loading ? (
              <p>Loading payroll history...</p>
            ) : payrollHistory.length > 0 ? (
              <div className="payroll-list">
                {payrollHistory.map((payroll) => (
                  <div key={payroll.id} className="payroll-item">
                    <div className="payroll-info">
                      <h3>{payroll.period}</h3>
                      <p>{formatDate(payroll.date)}</p>
                    </div>
                    <div className="payroll-amount">
                      <p>{formatCurrency(payroll.netPay)}</p>
                      <span
                        className={`status ${payroll.status.toLowerCase()}`}
                      >
                        {payroll.status}
                      </span>
                    </div>
                    <div className="payroll-actions">
                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(payroll)}
                      >
                        View Details
                      </button>
                      <button
                        className="download-btn"
                        onClick={() => handleDownloadSlip(payroll.id)}
                      >
                        Download Slip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No payroll history found.</p>
            )}
          </div>
        </div>
      </div>

      {selectedPayroll && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payroll Details - {selectedPayroll.period}</h2>
              <button className="close-btn" onClick={closeDetailsModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="payroll-breakdown">
                <div className="breakdown-row">
                  <span>Basic Salary</span>
                  <span>{formatCurrency(selectedPayroll.salary)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Bonus</span>
                  <span>{formatCurrency(selectedPayroll.bonus)}</span>
                </div>
                <div className="breakdown-row deductions">
                  <span>Deductions</span>
                  <span>-{formatCurrency(selectedPayroll.deductions)}</span>
                </div>
                <div className="breakdown-row total">
                  <span>Net Pay</span>
                  <span>{formatCurrency(selectedPayroll.netPay)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;
