export const queryKeys = {
  vehicles: {
    all: ['vehicles'],
    list: (params) => ['vehicles', 'list', params],
    detail: (id) => ['vehicles', 'detail', id],
    adminList: () => ['vehicles', 'admin', { limit: 100 }],
  },
  users: {
    all: ['users'],
    list: () => ['users', 'list'],
    tracking: () => ['users', 'tracking'],
  },
  admin: {
    dashboard: () => ['admin', 'dashboard'],
  },
  profile: {
    requests: (userId, email) => ['profile', 'requests', userId, email],
    favorites: (userId) => ['profile', 'favorites', userId],
  },
};
