// frontend/src/components/Navbar.jsx
import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Edit Profile States
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", email: "", password: "" });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: profileData.name,
        email: profileData.email
      };
      if (profileData.password) {
        body.password = profileData.password;
      }
      
      const response = await api.put('/auth/profile', body);
      
      // Update local storage
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update redux state
      dispatch(updateProfile(response.data));
      
      setOpenEditProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  // Do not show the navbar if the user is not logged in
  if (!user) return null;

  return (
    <>
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            LMS Portal
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Logged in as:{" "}
              <strong>
                {user.name} ({user.role})
              </strong>
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => {
              setProfileData({ name: user.name, email: user.email, password: "" });
              setOpenEditProfile(true);
            }}>
              Edit Profile
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleProfileUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              required
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
            <TextField
              label="New Password (optional)"
              type="password"
              fullWidth
              placeholder="Leave blank to keep current"
              value={profileData.password}
              onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
            />
            <DialogActions sx={{ px: 0, pb: 0, pt: 1 }}>
              <Button onClick={() => setOpenEditProfile(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save Changes</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
