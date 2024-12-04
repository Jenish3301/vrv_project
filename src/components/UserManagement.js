import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Checkbox,
} from "@mui/material";
import { mockApi } from "../api/mockApi";

const UserManagement = ({ roles }) => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "",
    role: "Editor",
    status: "Active",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await mockApi.getUsers();
    setUsers(fetchedUsers);
  };

  const generateUniqueId = () => Math.floor(Math.random() * 10000);

  const handleSaveUser = async () => {
    if (isEditMode) {
      await mockApi.updateUser(currentUser.id, currentUser);
    } else {
      const newUser = { ...currentUser, id: generateUniqueId() };
      await mockApi.addUser(newUser);
    }
    setOpen(false);
    setCurrentUser({ id: null, name: "", role: "Editor", status: "Active" });
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
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleRoleChange = (event) => {
    setCurrentUser((prevUser) => ({ ...prevUser, role: event.target.value }));
  };

  const handleBulkDelete = async () => {
    for (const id of selectedUsers) {
      await mockApi.deleteUser(id);
    }
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
  };

  const sortedUsers = [...users]
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            setCurrentUser({
              id: null,
              name: "",
              role: "Editor",
              status: "Active",
            });
            setIsEditMode(false);
            setOpen(true);
          }}
        >
          Add User
        </Button>
      </Box>

      <Box>
        <Button
          variant="outlined"
          color="error"
          onClick={handleBulkDelete}
          disabled={selectedUsers.length === 0}
        >
          Delete Selected
        </Button>
      </Box>

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
        {sortedUsers.map((user) => (
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
            <Checkbox
              checked={selectedUsers.includes(user.id)}
              onChange={(e) => {
                setSelectedUsers((prev) =>
                  e.target.checked
                    ? [...prev, user.id]
                    : prev.filter((id) => id !== user.id)
                );
              }}
            />
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography>Role: {user.role}</Typography>
              <Typography>Status: {user.status}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                onClick={() => handleEditUser(user)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                onClick={() => handleDeleteUser(user.id)}
              >
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
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.target.value })
            }
          />
          <FormControl>
            <Typography>Roles:</Typography>
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
                  setCurrentUser((prev) => ({
                    ...prev,
                    status: prev.status === "Active" ? "Inactive" : "Active",
                  }))
                }
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveUser}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
