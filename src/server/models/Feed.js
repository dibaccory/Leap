import mongoose from 'mongoose';

const feedSchema = mongoose.Schema({
  name: { type: String, unique: true },
  id: String,
  private: Boolean,
  rooms: Array,
});

export default mongoose.model('Feed', feedSchema);
