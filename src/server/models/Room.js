import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
  name: { type: String, unique: true },
  id: String,
  private: Boolean,
  player: {
    one: String,
    two: String,
  },
  users: Array,
});

export default mongoose.model('Room', roomSchema);
