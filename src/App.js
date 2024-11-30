import React from "react";
import { Box, Typography } from "@mui/material";
import UserManagement from "./components/UserManagement";
import RoleManagement from "./components/RoleManagement";

const App = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" gutterBottom>
        User and Role Management System
      </Typography>
      <UserManagement />
      <RoleManagement />
    </Box>
  );
};

export default App;
