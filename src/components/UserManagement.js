import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Switch,
} from "@mui/material";
import { mockApi } from "../api/mockApi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, name: "", role: "", status: "Active" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await mockApi.getUsers();
    setUsers(fetchedUsers);
  };

  const handleSaveUser = async () => {
    if (isEditMode) {
      await mockApi.updateUser(currentUser.id, currentUser);
    } else {
      await mockApi.addUser(currentUser);
    }
    setOpen(false);
    setCurrentUser({ id: null, name: "", role: "", status: "Active" });
    setIsEditMode(false);
    fetchUsers();
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteUser = async (id) => {
    await mockApi.deleteUser(id);
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const updatedStatus = user.status === "Active" ? "Inactive" : "Active";
    await mockApi.updateUser(user.id, { ...user, status: updatedStatus });
    fetchUsers();
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add User
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
        {users.map((user) => (
          <Card key={user.id} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography>Role: {user.role}</Typography>
              <Typography>Status: {user.status}</Typography>
            </CardContent>
            <CardActions>
              {/* Switch for toggling Active/Inactive status */}
              <Switch
                checked={user.status === "Active"}
                onChange={() => handleToggleStatus(user)}
                color="primary"
              />
              <Button size="small" onClick={() => handleEditUser(user)}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={currentUser.name}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Role"
            type="text"
            fullWidth
            value={currentUser.role}
            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveUser}>{isEditMode ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
