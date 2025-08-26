import mongoose from 'mongoose';

const whitelistSchema = mongoose.Schema({
  collegeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // Stores the ID in uppercase for consistency
  },
  name: { // Good to store the student's name for the warden's reference
    type: String,
    required: true,
  }
});

const Whitelist = mongoose.model('Whitelist', whitelistSchema);
export default Whitelist;