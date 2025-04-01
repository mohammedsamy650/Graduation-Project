// createAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

async function createAdminUser() {
  try {
    await sequelize.sync();

    const adminPassword = 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        factory: 'Factory A', // You can change this if needed
        isAdmin: true
      }
    });

    if (created) {
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser();