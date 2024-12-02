import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Radio,
  TextField,
} from "@mui/material";
import { mockApi } from "../api/mockApi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "",
    role: "Editor", 
    status: "Active",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await mockApi.getUsers();
    setUsers(fetchedUsers);
  };

  const fetchRoles = async () => {
    const fetchedRoles = await mockApi.getRoles();
    setRoles(fetchedRoles);
  };

  const generateUniqueId = () => {
    return Math.floor(Math.random() * 10000);
  };

  const handleSaveUser = async () => {
    if (isEditMode) {
      await mockApi.updateUser(currentUser.id, currentUser);
    } else {
      const newUser = {
        ...currentUser,
        id: generateUniqueId(),
      };
      await mockApi.addUser(newUser);
    }
    setOpen(false);
    setCurrentUser({ id: null, name: "", role: "Editor", status: "Active" }); 
    setIsEditMode(false);
    fetchUsers();
  };

  const handleEditUser = (user) => {
    setCurrentUser({ ...user });
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await mockApi.deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRoleChange = (event) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      role: event.target.value,
    }));
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => {
          setCurrentUser({ id: null, name: "", role: "Editor", status: "Active" }); 
          setIsEditMode(false);
          setOpen(true);
        }}
      >
        Add User
      </Button>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          marginTop: 2,
          padding: 2, 
          borderRadius: 2, 
        }}
      >
        {users.map((user) => (
          <Card
            key={user.id}
            sx={{
              width: 300,
              boxShadow: 24, 
              borderRadius: 3, 
              transition: "0.3s",
              "&:hover": {
                boxShadow: 16, 
                transform: "scale(1.05)", 
              },
              backgroundColor: "#D3F1DF", 
            }}
          >
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography>Role: {user.role}</Typography>
              <Typography>Status: {user.status}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="inherit" variant="outlined" onClick={() => handleEditUser(user)}>
                Edit
              </Button>
              <Button size="small" color="inherit" variant="outlined" onClick={() => handleDeleteUser(user.id)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle style={{backgroundColor:"#D3F1DF"}}>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent style={{backgroundColor:"#D3F1DF"}}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            style={{marginBottom:20}}
            value={currentUser.name}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
          />
          <FormControl component="fieldset" sx={{ marginTop: 5 }}>
            <Typography variant="subtitle1">Roles:</Typography>
            <RadioGroup value={currentUser.role} onChange={handleRoleChange}>
              {roles.map((role) => (
                <FormControlLabel
                  key={role.id}
                  value={role.name}
                  control={<Radio />}
                  label={role.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={currentUser.status === "Active"}
                onChange={() =>
                  setCurrentUser((prevUser) => ({
                    ...prevUser,
                    status: prevUser.status === "Active" ? "Inactive" : "Active",
                  }))
                }
                color="primary"
              />
            }
            labelPlacement="start"
            style={{backgroundColor:"#D3F1DF"}}
            label="User Status"
          />
        </DialogContent>
        <DialogActions style={{backgroundColor:"#D3F1DF"}}>
          <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSaveUser} variant="outlined" color="inherit">{isEditMode ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
