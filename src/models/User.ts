import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'User need to have a name'],
    },
    email: {
      type: String,
      unique: [true, 'Email already registred'],
      required: [true, 'User need to have an email'],
    },
    password: {
      type: String,
      required: [true, 'User need to have a password'],
    },
  },
  {
    collection: 'Users',
    timestamps: true,
  },
);

export default mongoose.model('User', Schema);
