import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

export const userModel = model(
  'users',
  new Schema({
    firstName: {
      type: String,
      max: 100,
    },
    lastName: {
      type: String,
      max: 100,
    },
    password: {
      type: String,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },

    admin: {
      default: false,
      type: Boolean,
    },
    age: {
      type: Number,
    },
  }).plugin(monsoosePaginate)
);
