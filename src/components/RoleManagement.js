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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { mockApi } from "../api/mockApi";

const availablePermissions = ["Read", "Write", "Delete"];

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    id: null,
    name: "",
    permissions: [],
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const fetchedRoles = await mockApi.getRoles();
    setRoles(fetchedRoles);
  };

  const generateUniqueId = () => {
    return Math.floor(Math.random() * 10000);
  };

  const handleSaveRole = async () => {
    if (isEditMode) {
      await mockApi.updateRole(currentRole.id, currentRole);
    } else {
      const newRole = {
        ...currentRole,
        id: generateUniqueId(),
      };
      await mockApi.addRole(newRole);
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

  const handlePermissionChange = (permission) => {
    setCurrentRole((prevRole) => {
      const permissions = prevRole.permissions.includes(permission)
        ? prevRole.permissions.filter((p) => p !== permission)
        : [...prevRole.permissions, permission];
      return { ...prevRole, permissions };
    });
  };

  const handleOpenAddRole = () => {
    setCurrentRole({ id: null, name: "", permissions: ["Read"] });
    setIsEditMode(false);
    setOpen(true);
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="h4" gutterBottom>
        Role Management
      </Typography>
      <Button variant="outlined" color="inherit" onClick={handleOpenAddRole}>
        Add Role
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
        {roles.map((role) => (
          <Card key={role.id} sx={{ width: 300,
            boxShadow: 24, 
            borderRadius: 3, 
            transition: "0.3s",
            "&:hover": {
              boxShadow: 16, 
              transform: "scale(1.05)", 
            },
            backgroundColor: "#B3C8CF" }}>
            <CardContent>
              <Typography variant="h6">{role.name}</Typography>
              <Typography>
                Permissions: {role.permissions.join(", ")}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="inherit" variant="outlined" onClick={() => handleEditRole(role)}>
                Edit
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle style={{backgroundColor:"#B3C8CF"}}>{isEditMode ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent style={{backgroundColor:"#B3C8CF"}}>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            type="text"
            fullWidth
            value={currentRole.name}
            onChange={(e) =>
              setCurrentRole({ ...currentRole, name: e.target.value })
            }
          />
          <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
            Permissions:
          </Typography>
          <FormGroup>
            {availablePermissions.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={currentRole.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                  />
                }
                label={permission}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions style={{backgroundColor:"#B3C8CF"}}>
          <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSaveRole} variant="outlined" color="inherit">
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
