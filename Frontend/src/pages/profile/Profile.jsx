import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "../../redux/slices/userSlice";
import { updateUser } from "../../redux/slices/authSlice";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { authService } from "../../services/authService";
import api from "../../services/api";
import { formatDate } from "../../utils/helpers";

function Profile() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const { profile, loading, error } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    department: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const isAdmin = currentUser?.role === "ADMIN";
  const isViewingOtherUser = userId && userId !== currentUser?._id && userId !== currentUser?.id;
  const canEdit = isAdmin || !isViewingOtherUser;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      dispatch(fetchProfileStart());
      let userData;

      if (userId && isAdmin) {
        // Admin viewing another user's profile
        const response = await api.get(`/users/${userId}`);
        userData = response.data;
      } else {
        // Current user's profile
        userData = await authService.getCurrentUser();
      }

      dispatch(fetchProfileSuccess(userData));
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        position: userData.jobDetails?.position || "",
        department: userData.jobDetails?.department || "",
        basicSalary: userData.salaryStructure?.basicSalary || "",
        allowances: userData.salaryStructure?.allowances || "",
        deductions: userData.salaryStructure?.deductions || "",
      });
    } catch (error) {
      dispatch(
        fetchProfileFailure(
          error.response?.data?.message || "Failed to fetch profile"
        )
      );
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(updateProfileStart());

      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      // Employees can only update limited fields
      if (isAdmin && userId) {
        // Admin updating another user - can update all fields
        updateData.jobDetails = {
          position: formData.position.trim() || undefined,
          department: formData.department.trim() || undefined,
        };
        updateData.salaryStructure = {
          basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : undefined,
          allowances: formData.allowances ? parseFloat(formData.allowances) : 0,
          deductions: formData.deductions ? parseFloat(formData.deductions) : 0,
        };

        const response = await api.put(`/users/${userId}`, updateData);
        dispatch(updateProfileSuccess(response.data));
      } else {
        // Current user updating own profile
        const response = await api.put(`/users/${currentUser._id || currentUser.id}`, updateData);
        dispatch(updateProfileSuccess(response.data));
        dispatch(updateUser(response.data));
      }

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      dispatch(
        updateProfileFailure(
          error.response?.data?.message || "Failed to update profile"
        )
      );
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading && !profile) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          <Navbar />
          <div className="dashboard-main">
            <Loader message="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          <Navbar />
          <div className="dashboard-main">
            <Card>
              <div className="empty-state">
                <p>Profile not found.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-main">
          <div className="page-header">
            <h1>
              {isViewingOtherUser ? `${profile.name}'s Profile` : "My Profile"}
            </h1>
            <p>View and manage profile information</p>
            {canEdit && !isEditing && (
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                className="page-header-action"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <div className="profile-container">
            {/* Personal Information */}
            <Card title="Personal Information">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className={`form-input ${
                        formErrors.name ? "input-error" : ""
                      }`}
                      required
                    />
                    {formErrors.name && (
                      <span className="error-text">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`form-input ${
                        formErrors.email ? "input-error" : ""
                      }`}
                      required
                    />
                    {formErrors.email && (
                      <span className="error-text">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`form-input ${
                        formErrors.phone ? "input-error" : ""
                      }`}
                      placeholder="+1234567890"
                    />
                    {formErrors.phone && (
                      <span className="error-text">{formErrors.phone}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className="form-input"
                      rows="3"
                      placeholder="Enter your address"
                    />
                  </div>

                  {isAdmin && userId && (
                    <>
                      <div className="form-group">
                        <label htmlFor="position" className="form-label">
                          Position
                        </label>
                        <input
                          type="text"
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleFormChange}
                          className="form-input"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="department" className="form-label">
                          Department
                        </label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleFormChange}
                          className="form-input"
                          placeholder="e.g., IT"
                        />
                      </div>
                    </>
                  )}

                  <div className="form-actions">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormErrors({});
                        fetchProfile();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <strong>Name:</strong> {profile.name}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="detail-item">
                      <strong>Phone:</strong> {profile.phone}
                    </div>
                  )}
                  {profile.address && (
                    <div className="detail-item">
                      <strong>Address:</strong> {profile.address}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Job Details */}
            <Card title="Job Details">
              <div className="profile-details">
                <div className="detail-item">
                  <strong>Employee ID:</strong> {profile.employeeId}
                </div>
                <div className="detail-item">
                  <strong>Role:</strong>{" "}
                  <span
                    className={`badge badge-${
                      profile.role === "ADMIN" ? "danger" : "primary"
                    }`}
                  >
                    {profile.role}
                  </span>
                </div>
                {profile.jobDetails?.position && (
                  <div className="detail-item">
                    <strong>Position:</strong> {profile.jobDetails.position}
                  </div>
                )}
                {profile.jobDetails?.department && (
                  <div className="detail-item">
                    <strong>Department:</strong> {profile.jobDetails.department}
                  </div>
                )}
                {profile.jobDetails?.dateOfJoining && (
                  <div className="detail-item">
                    <strong>Date of Joining:</strong>{" "}
                    {formatDate(profile.jobDetails.dateOfJoining, "dd/MM/yyyy")}
                  </div>
                )}
              </div>
            </Card>

            {/* Salary Structure (Admin only or own profile) */}
            {(isAdmin || !isViewingOtherUser) && profile.salaryStructure && (
              <Card title="Salary Structure">
                <div className="profile-details">
                  <div className="detail-item">
                    <strong>Basic Salary:</strong>{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(profile.salaryStructure.basicSalary || 0)}
                  </div>
                  <div className="detail-item">
                    <strong>Allowances:</strong>{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(profile.salaryStructure.allowances || 0)}
                  </div>
                  <div className="detail-item">
                    <strong>Deductions:</strong>{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(profile.salaryStructure.deductions || 0)}
                  </div>
                  <div className="detail-item">
                    <strong>Net Salary:</strong>{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      (profile.salaryStructure.basicSalary || 0) +
                        (profile.salaryStructure.allowances || 0) -
                        (profile.salaryStructure.deductions || 0)
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
