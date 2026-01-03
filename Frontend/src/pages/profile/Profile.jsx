import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "../../redux/slices/userSlice";
import { authService } from "../../services/authService";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

function Profile() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(fetchProfileStart());
      try {
        const userData = await authService.getCurrentUser();
        dispatch(fetchProfileSuccess(userData));
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          position: userData.position || "",
          department: userData.department || "",
          address: userData.address || "",
        });
      } catch (error) {
        dispatch(fetchProfileFailure(error.message));
      }
    };

    if (!profile) {
      fetchProfile();
    } else {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        position: profile.position || "",
        department: profile.department || "",
        address: profile.address || "",
      });
    }
  }, [dispatch, profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateProfileStart());

    try {
      // In a real app, you would call an API to update the profile
      // const response = await userService.updateProfile(formData);
      dispatch(updateProfileSuccess(formData));
      setIsEditing(false);
    } catch (error) {
      dispatch(updateProfileFailure(error.message));
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset form to original values if canceling
      setFormData({
        name: profile?.name || user?.name || "",
        email: profile?.email || user?.email || "",
        phone: profile?.phone || "",
        position: profile?.position || "",
        department: profile?.department || "",
        address: profile?.address || "",
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-layout">
      <Sidebar />
      <div className="profile-content">
        <Navbar />
        <div className="profile-main">
          <h1>Profile</h1>

          {loading && <p>Loading...</p>}

          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <span>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="profile-actions">
                <button onClick={toggleEdit} className="edit-btn">
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="profile-details">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="position">Position</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-row">
                    <div className="info-item">
                      <label>Full Name:</label>
                      <p>{profile?.name || user?.name || "N/A"}</p>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <p>{profile?.email || user?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-item">
                      <label>Phone:</label>
                      <p>{profile?.phone || "N/A"}</p>
                    </div>
                    <div className="info-item">
                      <label>Position:</label>
                      <p>{profile?.position || "N/A"}</p>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-item">
                      <label>Department:</label>
                      <p>{profile?.department || "N/A"}</p>
                    </div>
                    <div className="info-item">
                      <label>Address:</label>
                      <p>{profile?.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
