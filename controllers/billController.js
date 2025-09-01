import Bill from '../models/Bill.js';
import User from '../models/user.js';

// @desc    Create a new bill (Warden only)
// @route   POST /api/bills
export const createBill = async (req, res) => {
  const { student, month, year, amount } = req.body;

  try {
    const studentExists = await User.findById(student);
    if (!studentExists || studentExists.role !== 'Student') {
        return res.status(404).json({ message: 'Student not found' });
    }

    const bill = new Bill({
      student,
      month,
      year,
      amount,
      warden: req.user._id, // The logged-in warden
    });

    const createdBill = await bill.save();
    res.status(201).json(createdBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bills (Warden only)
// @route   GET /api/bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({}).populate('student', 'name email');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in student's bills
// @route   GET /api/bills/mybills
export const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ student: req.user._id });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a bill's status (Warden only)
// @route   PUT /api/bills/:id/status
export const updateBillStatus = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (bill) {
      bill.status = req.body.status || bill.status;
      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};