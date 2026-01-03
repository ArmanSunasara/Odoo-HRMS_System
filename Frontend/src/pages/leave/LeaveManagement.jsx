import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { leaveService } from "../../services/leaveService";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { formatDate } from "../../utils/helpers";

function LeaveManagement() {
  const { user } = useSelector((state) => state.auth);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would fetch from the API
        // const requests = await leaveService.getLeaveRequests(user.id);
        // const balance = await leaveService.getLeaveBalance(user.id);

        const mockRequests = [
          {
            id: 1,
            leaveType: "Vacation",
            startDate: "2023-07-01",
            endDate: "2023-07-05",
            reason: "Annual vacation",
            status: "Approved",
            appliedDate: "2023-06-15",
          },
          {
            id: 2,
            leaveType: "Sick",
            startDate: "2023-06-20",
            endDate: "2023-06-21",
            reason: "Medical appointment",
            status: "Approved",
            appliedDate: "2023-06-18",
          },
          {
            id: 3,
            leaveType: "Casual",
            startDate: "2023-06-25",
            endDate: "2023-06-25",
            reason: "Personal work",
            status: "Pending",
            appliedDate: "2023-06-22",
          },
        ];

        const mockBalance = {
          casual: 8,
          vacation: 12,
          sick: 10,
        };

        setLeaveRequests(mockRequests);
        setLeaveBalance(mockBalance);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleFormChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    // In a real app, this would call the API to submit the request
    const newRequest = {
      id: leaveRequests.length + 1,
      ...requestForm,
      status: "Pending",
      appliedDate: formatDate(new Date(), "yyyy-MM-dd"),
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setRequestForm({
      leaveType: "Casual",
      startDate: "",
      endDate: "",
      reason: "",
    });
    setShowRequestForm(false);
  };

  const handleCancelRequest = (requestId) => {
    // In a real app, this would call the API to cancel the request
    setLeaveRequests(leaveRequests.filter((req) => req.id !== requestId));
  };

  return (
    <div className="leave-layout">
      <Sidebar />
      <div className="leave-content">
        <Navbar />
        <div className="leave-main">
          <h1>Leave Management</h1>

          <div className="leave-actions">
            <button
              className="request-leave-btn"
              onClick={() => setShowRequestForm(!showRequestForm)}
            >
              {showRequestForm ? "Cancel Request" : "Request Leave"}
            </button>
          </div>

          {showRequestForm && (
            <div className="leave-request-form">
              <h2>Request Leave</h2>
              <form onSubmit={handleSubmitRequest}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="leaveType">Leave Type</label>
                    <select
                      id="leaveType"
                      name="leaveType"
                      value={requestForm.leaveType}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Casual">Casual Leave</option>
                      <option value="Vacation">Vacation Leave</option>
                      <option value="Sick">Sick Leave</option>
                      <option value="Personal">Personal Leave</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={requestForm.startDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={requestForm.endDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="reason">Reason</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={requestForm.reason}
                    onChange={handleFormChange}
                    required
                    rows="4"
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Submit Request
                </button>
              </form>
            </div>
          )}

          <div className="leave-balance">
            <h2>Leave Balance</h2>
            <div className="balance-cards">
              <div className="balance-card">
                <h3>Casual</h3>
                <p>{leaveBalance.casual || 0} days</p>
              </div>
              <div className="balance-card">
                <h3>Vacation</h3>
                <p>{leaveBalance.vacation || 0} days</p>
              </div>
              <div className="balance-card">
                <h3>Sick</h3>
                <p>{leaveBalance.sick || 0} days</p>
              </div>
            </div>
          </div>

          <div className="leave-requests">
            <h2>Leave Requests</h2>
            {loading ? (
              <p>Loading leave requests...</p>
            ) : leaveRequests.length > 0 ? (
              <div className="requests-list">
                {leaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`request-card ${request.status.toLowerCase()}`}
                  >
                    <div className="request-header">
                      <h3>{request.leaveType} Leave</h3>
                      <span
                        className={`status ${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="request-details">
                      <p>
                        <strong>Duration:</strong>{" "}
                        {formatDate(request.startDate)} to{" "}
                        {formatDate(request.endDate)}
                      </p>
                      <p>
                        <strong>Reason:</strong> {request.reason}
                      </p>
                      <p>
                        <strong>Applied on:</strong>{" "}
                        {formatDate(request.appliedDate)}
                      </p>
                    </div>
                    {request.status === "Pending" && (
                      <div className="request-actions">
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelRequest(request.id)}
                        >
                          Cancel Request
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No leave requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveManagement;
