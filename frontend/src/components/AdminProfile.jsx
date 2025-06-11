import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/components/AdminProfile.css";

const AdminProfile = () => {
  const { user, logout } = useUser();

  // Local state for editing username and email
  const [editMode, setEditMode] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState(user?.username || "");
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");

  // Handle update profile
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: updatedUsername,
            email: updatedEmail,
          }),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong.");
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/users/${user.id}/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        setNewPassword("");
      } else {
        alert("Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Something went wrong.");
    }
  };

  if (!user) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="admin-profile-container">
      <h2>Admin Profile</h2>

      <div className="admin-profile-details">
        <label>Username:</label>
        {editMode ? (
          <input
            type="text"
            value={updatedUsername}
            onChange={(e) => setUpdatedUsername(e.target.value)}
          />
        ) : (
          <p>{user.username}</p>
        )}

        <label>Email:</label>
        {editMode ? (
          <input
            type="email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
          />
        ) : (
          <p>{user.email}</p>
        )}

        <label>Role:</label>
        <p>{user.role}</p>
      </div>

      {editMode ? (
        <button className="admin-save-button" onClick={handleUpdateProfile}>
          Save Changes
        </button>
      ) : (
        <button className="admin-edit-button" onClick={() => setEditMode(true)}>
          Edit Profile
        </button>
      )}

      {/* Change Password */}
      <div className="admin-change-password-section">
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <button
          className="admin-change-password-button"
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>

      {/* Logout */}
      <button className="admin-logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default AdminProfile;
