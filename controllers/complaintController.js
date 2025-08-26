import Complaint from '../models/Complaint.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
export const createComplaint = async (req, res) => {
  const { category, description, roomNumber } = req.body;

  try {
    let imageURL = '';

    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'hostel_complaints' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      imageURL = result.secure_url;
    }

    const complaint = new Complaint({
      student: req.user._id,
      category,
      description,
      roomNumber,
      imageURL: imageURL,
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
a  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user's complaints
// @route   GET /api/complaints/mycomplaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all complaints (Warden only)
// @route   GET /api/complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate('student', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a complaint's status (Warden only)
// @route   PUT /api/complaints/:id
export const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = req.body.status || complaint.status;
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
