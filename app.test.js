const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../app');
const User = require('../UserDetails');

describe('User Registration API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost/test_db', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });
});
