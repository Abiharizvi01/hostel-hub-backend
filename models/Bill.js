import mongoose from 'mongoose';

const billSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // The student this bill is for
    },
    warden: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // The warden who uploaded the bill
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model('Bill', billSchema);
export default Bill;