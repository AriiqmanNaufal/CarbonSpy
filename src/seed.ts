import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();

const seedUsers = [
  {
    email: 'testuser@example.com',
    password: 'password123',
    plan: 'free',
    weeklyCredits: 1,
  },
  {
    email: 'prouser@example.com',
    password: 'password123',
    plan: 'pro',
    weeklyCredits: 9999,
  },
];

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await User.insertMany(seedUsers);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
      await connectDB();
      await User.deleteMany();

      console.log('Data Destroyed!');
      process.exit();
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  };

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
