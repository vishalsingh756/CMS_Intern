// Mock Database for Development
// This is an in-memory database for testing without MongoDB

const users = [];
const posts = [];
const categories = [];
const tags = [];
const comments = [];

// Initialize with test data
export const initializeMockDB = () => {
  console.log('✅ Mock Database initialized');
};

export const mockDB = {
  users,
  posts,
  categories,
  tags,
  comments,
};
