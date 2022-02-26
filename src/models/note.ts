import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Note need to have a title'],
    },
    content: {
      type: String,
      required: [true, 'Note need to have a body'],
    },
  },
  {
    timestamps: true,
  },
);

Schema.index({ title: 'text', content: 'text' });

export default mongoose.model('Note', Schema);
