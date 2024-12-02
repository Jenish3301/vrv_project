import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import RoleManagement from "./components/RoleManagement";
import UserManagement from "./components/UserManagement";
import { mockApi } from "./api/mockApi"; 

const App = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const fetchedRoles = await mockApi.getRoles();
    setRoles(fetchedRoles);
  };

  const addRole = (newRole) => {
    setRoles((prevRoles) => [...prevRoles, newRole]);
  };

  return (
    <Box sx={{ backgroundColor: "#1B2333", minHeight: "100vh", padding: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: "#ECF0F1",
            marginBottom: 4,
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: 2,
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          User and Role Management
        </Typography>
            <Paper
              elevation={6}
              sx={{
                padding: 4,
                borderRadius: 3,
                backgroundColor: "#85A98F",
                marginBottom:5,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#FFFFFF",
                  marginBottom: 3,
                  fontWeight: "bold",
                  borderBottom: "3px solid #FFFFFF",
                  paddingBottom: 1,
                  fontSize: "1.6rem",
                }}
              >
                User Management
              </Typography>
              <UserManagement roles={roles} />
            </Paper>
            <Paper
              elevation={6}
              sx={{
                padding: 4,
                borderRadius: 3,
                backgroundColor: "#89A8B2",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#FFFFFF",
                  marginBottom: 3,
                  fontWeight: "bold",
                  borderBottom: "3px solid #FFFFFF",
                  paddingBottom: 1,
                  fontSize: "1.6rem",
                }}
              >
                Role Management
              </Typography>
              <RoleManagement roles={roles} addRole={addRole} />
            </Paper>
      </Container>
    </Box>
  );
};

export default App;
