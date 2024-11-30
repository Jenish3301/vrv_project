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
} from "@mui/material";
import { mockApi } from "../api/mockApi";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState({ id: null, name: "", permissions: [] });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const fetchedRoles = await mockApi.getRoles();
    setRoles(fetchedRoles);
  };

  const handleSaveRole = async () => {
    if (isEditMode) {
      await mockApi.updateRole(currentRole.id, currentRole);
    } else {
      await mockApi.addRole(currentRole);
    }
    setOpen(false);
    setCurrentRole({ id: null, name: "", permissions: [] });
    setIsEditMode(false);
    fetchRoles();
  };

  const handleEditRole = (role) => {
    setCurrentRole(role);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteRole = async (id) => {
    await mockApi.deleteRole(id);
    fetchRoles();
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="h4" gutterBottom>
        Role Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Role
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
        {roles.map((role) => (
          <Card key={role.id} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6">{role.name}</Typography>
              <Typography>
                Permissions: {role.permissions.join(", ")}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleEditRole(role)}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={() => handleDeleteRole(role.id)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditMode ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            type="text"
            fullWidth
            value={currentRole.name}
            onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Permissions (comma-separated)"
            type="text"
            fullWidth
            value={currentRole.permissions.join(",")}
            onChange={(e) =>
              setCurrentRole({ ...currentRole, permissions: e.target.value.split(",") })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRole}>{isEditMode ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
