import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { leaveService } from "../../services/leaveService";
import {
  fetchLeaveRequestsStart,
  fetchLeaveRequestsSuccess,
  fetchLeaveRequestsFailure,
  submitLeaveRequestStart,
  submitLeaveRequestSuccess,
  submitLeaveRequestFailure,
  updateLeaveStatusStart,
  updateLeaveStatusSuccess,
  updateLeaveStatusFailure,
} from "../../redux/slices/leaveSlice";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import { formatDate, calculateDateDifference } from "../../utils/helpers";

function LeaveManagement() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { requests, loading, error } = useSelector((state) => state.leave);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [requestForm, setRequestForm] = useState({
    leaveType: "PAID",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      dispatch(fetchLeaveRequestsStart());
      const response = await leaveService.getLeaveRequests();
      const leaveData = Array.isArray(response)
        ? response
        : response.data || [];
      dispatch(fetchLeaveRequestsSuccess(leaveData));
    } catch (error) {
      dispatch(
        fetchLeaveRequestsFailure(
          error.response?.data?.message || "Failed to fetch leave requests"
        )
      );
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm({
      ...requestForm,
      [name]: value,
    });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!requestForm.leaveType) {
      errors.leaveType = "Leave type is required";
    }

    if (!requestForm.startDate) {
      errors.startDate = "Start date is required";
    } else if (new Date(requestForm.startDate) < new Date().setHours(0, 0, 0, 0)) {
      errors.startDate = "Start date cannot be in the past";
    }

    if (!requestForm.endDate) {
      errors.endDate = "End date is required";
    } else if (
      requestForm.endDate &&
      new Date(requestForm.endDate) < new Date(requestForm.startDate)
    ) {
      errors.endDate = "End date must be after start date";
    }

    if (!requestForm.reason.trim()) {
      errors.reason = "Reason is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitLeaveRequest = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(submitLeaveRequestStart());
      const response = await leaveService.submitLeaveRequest(requestForm);
      dispatch(submitLeaveRequestSuccess(response));
      setShowRequestForm(false);
      setRequestForm({
        leaveType: "PAID",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchLeaveRequests();
      alert("Leave request submitted successfully!");
    } catch (error) {
      dispatch(
        submitLeaveRequestFailure(
          error.response?.data?.message || "Failed to submit leave request"
        )
      );
      alert(error.response?.data?.message || "Failed to submit leave request");
    }
  };

  const handleApproveLeave = async () => {
    if (!selectedLeave) return;

    try {
      dispatch(updateLeaveStatusStart());
      await leaveService.approveLeave(selectedLeave._id || selectedLeave.id);
      dispatch(updateLeaveStatusSuccess({ ...selectedLeave, status: "APPROVED" }));
      setShowApprovalModal(false);
      setSelectedLeave(null);
      fetchLeaveRequests();
      alert("Leave request approved successfully!");
    } catch (error) {
      dispatch(updateLeaveStatusFailure(error.response?.data?.message || "Failed to approve leave"));
      alert(error.response?.data?.message || "Failed to approve leave");
    }
  };

  const handleRejectLeave = async () => {
    if (!selectedLeave) return;

    try {
      dispatch(updateLeaveStatusStart());
      await leaveService.rejectLeave(selectedLeave._id || selectedLeave.id);
      dispatch(updateLeaveStatusSuccess({ ...selectedLeave, status: "REJECTED" }));
      setShowApprovalModal(false);
      setSelectedLeave(null);
      fetchLeaveRequests();
      alert("Leave request rejected");
    } catch (error) {
      dispatch(updateLeaveStatusFailure(error.response?.data?.message || "Failed to reject leave"));
      alert(error.response?.data?.message || "Failed to reject leave");
    }
  };

  const openApprovalModal = (leave) => {
    setSelectedLeave(leave);
    setShowApprovalModal(true);
  };

  const getFilteredRequests = () => {
    if (isAdmin) {
      return requests;
    }
    // Employees see only their own requests
    return requests.filter(
      (req) =>
        req.userId?._id === user?._id ||
        req.userId === user?._id ||
        req.user?._id === user?._id
    );
  };

  const pendingRequests = getFilteredRequests().filter(
    (req) => req.status === "PENDING"
  );
  const approvedRequests = getFilteredRequests().filter(
    (req) => req.status === "APPROVED"
  );
  const rejectedRequests = getFilteredRequests().filter(
    (req) => req.status === "REJECTED"
  );

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    return calculateDateDifference(startDate, endDate) + 1;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-main">
          <div className="page-header">
            <h1>Leave Management</h1>
            <p>Manage your leave requests and approvals</p>
            {!isAdmin && (
              <Button
                variant="primary"
                onClick={() => setShowRequestForm(true)}
                className="page-header-action"
              >
                Apply for Leave
              </Button>
            )}
          </div>

          {/* Leave Summary */}
          <div className="dashboard-cards">
            <Card className="stat-card stat-card-warning">
              <div className="stat-content">
                <h3>Pending</h3>
                <h2>{pendingRequests.length}</h2>
              </div>
            </Card>
            <Card className="stat-card stat-card-success">
              <div className="stat-content">
                <h3>Approved</h3>
                <h2>{approvedRequests.length}</h2>
              </div>
            </Card>
            <Card className="stat-card stat-card-danger">
              <div className="stat-content">
                <h3>Rejected</h3>
                <h2>{rejectedRequests.length}</h2>
              </div>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <Card title={isAdmin ? "Pending Leave Approvals" : "Pending Requests"}>
              {loading ? (
                <Loader message="Loading..." />
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {isAdmin && <th>Employee</th>}
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days</th>
                        <th>Reason</th>
                        {isAdmin && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((request, index) => (
                        <tr key={request._id || request.id || index}>
                          {isAdmin && (
                            <td>
                              {request.userId?.name ||
                                request.user?.name ||
                                "Employee"}
                            </td>
                          )}
                          <td>{request.leaveType || "N/A"}</td>
                          <td>
                            {formatDate(request.startDate, "dd/MM/yyyy")}
                          </td>
                          <td>
                            {formatDate(request.endDate, "dd/MM/yyyy")}
                          </td>
                          <td>
                            {calculateDays(request.startDate, request.endDate)}
                          </td>
                          <td>{request.reason || "-"}</td>
                          {isAdmin && (
                            <td>
                              <div className="action-buttons">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => openApprovalModal(request)}
                                >
                                  Review
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* All Leave Requests */}
          <Card title={isAdmin ? "All Leave Requests" : "Your Leave Requests"}>
            {loading ? (
              <Loader message="Loading leave requests..." />
            ) : getFilteredRequests().length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {isAdmin && <th>Employee</th>}
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Applied On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredRequests()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((request, index) => (
                        <tr key={request._id || request.id || index}>
                          {isAdmin && (
                            <td>
                              {request.userId?.name ||
                                request.user?.name ||
                                "Employee"}
                            </td>
                          )}
                          <td>{request.leaveType || "N/A"}</td>
                          <td>
                            {formatDate(request.startDate, "dd/MM/yyyy")}
                          </td>
                          <td>
                            {formatDate(request.endDate, "dd/MM/yyyy")}
                          </td>
                          <td>
                            {calculateDays(request.startDate, request.endDate)}
                          </td>
                          <td>{request.reason || "-"}</td>
                          <td>
                            <span
                              className={`badge badge-${
                                request.status === "APPROVED"
                                  ? "success"
                                  : request.status === "REJECTED"
                                  ? "danger"
                                  : "warning"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {formatDate(request.createdAt, "dd/MM/yyyy")}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No leave requests found.</p>
              </div>
            )}
          </Card>

          {/* Leave Request Form Modal */}
          <Modal
            isOpen={showRequestForm}
            onClose={() => {
              setShowRequestForm(false);
              setFormErrors({});
            }}
            title="Apply for Leave"
            size="md"
          >
            <form onSubmit={handleSubmitLeaveRequest}>
              <div className="form-group">
                <label htmlFor="leaveType" className="form-label">
                  Leave Type *
                </label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={requestForm.leaveType}
                  onChange={handleFormChange}
                  className={`form-input ${
                    formErrors.leaveType ? "input-error" : ""
                  }`}
                  required
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
                {formErrors.leaveType && (
                  <span className="error-text">{formErrors.leaveType}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={requestForm.startDate}
                  onChange={handleFormChange}
                  className={`form-input ${
                    formErrors.startDate ? "input-error" : ""
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                {formErrors.startDate && (
                  <span className="error-text">{formErrors.startDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={requestForm.endDate}
                  onChange={handleFormChange}
                  className={`form-input ${
                    formErrors.endDate ? "input-error" : ""
                  }`}
                  min={requestForm.startDate || new Date().toISOString().split("T")[0]}
                  required
                />
                {formErrors.endDate && (
                  <span className="error-text">{formErrors.endDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reason" className="form-label">
                  Reason *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={requestForm.reason}
                  onChange={handleFormChange}
                  className={`form-input ${
                    formErrors.reason ? "input-error" : ""
                  }`}
                  rows="4"
                  placeholder="Enter reason for leave"
                  required
                />
                {formErrors.reason && (
                  <span className="error-text">{formErrors.reason}</span>
                )}
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRequestForm(false);
                    setFormErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={loading}>
                  Submit Request
                </Button>
              </div>
            </form>
          </Modal>

          {/* Approval Modal */}
          <Modal
            isOpen={showApprovalModal}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedLeave(null);
            }}
            title="Review Leave Request"
            size="md"
          >
            {selectedLeave && (
              <div className="leave-details">
                <div className="detail-item">
                  <strong>Employee:</strong>{" "}
                  {selectedLeave.userId?.name ||
                    selectedLeave.user?.name ||
                    "Employee"}
                </div>
                <div className="detail-item">
                  <strong>Leave Type:</strong> {selectedLeave.leaveType}
                </div>
                <div className="detail-item">
                  <strong>Start Date:</strong>{" "}
                  {formatDate(selectedLeave.startDate, "dd/MM/yyyy")}
                </div>
                <div className="detail-item">
                  <strong>End Date:</strong>{" "}
                  {formatDate(selectedLeave.endDate, "dd/MM/yyyy")}
                </div>
                <div className="detail-item">
                  <strong>Days:</strong>{" "}
                  {calculateDays(
                    selectedLeave.startDate,
                    selectedLeave.endDate
                  )}
                </div>
                <div className="detail-item">
                  <strong>Reason:</strong> {selectedLeave.reason || "-"}
                </div>
                <div className="modal-footer">
                  <Button
                    variant="danger"
                    onClick={handleRejectLeave}
                    loading={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleApproveLeave}
                    loading={loading}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default LeaveManagement;
