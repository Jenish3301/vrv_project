const mockData = {
    users: [
      { id: 1, name: "John Doe", role: "Admin", status: "Active" },
      { id: 2, name: "Jane Smith", role: "Editor", status: "Inactive" },
    ],
    roles: [
      { id: 1, name: "Admin", permissions: ["Read", "Write", "Delete"] },
      { id: 2, name: "Editor", permissions: ["Read", "Write"] },
    ],
  };
  
  export const mockApi = {
    getUsers: () => Promise.resolve(mockData.users),
    getRoles: () => Promise.resolve(mockData.roles),
    addUser: (user) => {
      const newUser = { id: Date.now(), ...user };
      mockData.users.push(newUser);
      return Promise.resolve(newUser);
    },
    updateUser: (id, updates) => {
      const userIndex = mockData.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        mockData.users[userIndex] = { ...mockData.users[userIndex], ...updates };
        return Promise.resolve(mockData.users[userIndex]);
      }
      return Promise.reject("User not found");
    },
    deleteUser: (id) => {
      mockData.users = mockData.users.filter((user) => user.id !== id);
      return Promise.resolve(true);
    },
    addRole: (role) => {
      const newRole = { id: Date.now(), ...role };
      mockData.roles.push(newRole);
      return Promise.resolve(newRole);
    },
    updateRole: (id, updates) => {
      const roleIndex = mockData.roles.findIndex((role) => role.id === id);
      if (roleIndex !== -1) {
        mockData.roles[roleIndex] = { ...mockData.roles[roleIndex], ...updates };
        return Promise.resolve(mockData.roles[roleIndex]);
      }
      return Promise.reject("Role not found");
    },
    deleteRole: (id) => {
      mockData.roles = mockData.roles.filter((role) => role.id !== id);
      return Promise.resolve(true);
    },
  };
  