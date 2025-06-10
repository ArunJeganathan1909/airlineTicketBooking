import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/components/UserProfile.css";

const UserProfile = () => {
  const { user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user ? { ...user } : {});
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/auth/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update user");
      alert("User details updated successfully.");
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await fetch(
        `/api/auth/users/${user.id}/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );
      if (!response.ok) throw new Error("Failed to change password");
      alert("Password changed successfully.");
      setChangePassword(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <p>No user logged in</p>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {!editMode ? (
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <button onClick={() => setEditMode(true)}>Edit Details</button>
        </div>
      ) : (
        <div className="edit-form">
          <label>
            Username:
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      )}

      <div className="password-change">
        {!changePassword ? (
          <button onClick={() => setChangePassword(true)}>
            Change Password
          </button>
        ) : (
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Submit</button>
            <button onClick={() => setChangePassword(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
