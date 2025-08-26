import mongoose from 'mongoose';

const complaintSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a relationship between this complaint and the User model
    },
    category: {
      type: String,
      required: true,
      enum: ['Mess Food', 'Electrical', 'Water Issue', 'Washing Machine', 'Other'],
    },
    description: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: function () {
        return ['Electrical', 'Water Issue'].includes(this.category);
      },
    },
    imageURL: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;