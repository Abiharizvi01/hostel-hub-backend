import Whitelist from '../models/Whitelist.js';
import User from '../models/user.js';

// ... addToWhitelist and getWhitelist functions ...

// @desc    Create a new warden account (Warden only)
// @route   POST /api/warden/create-warden
export const createWarden = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Warden with this email already exists.' });
        }
        
        // We create the warden but provide a placeholder collegeId
        const warden = await User.create({
            name,
            email,
            password,
            collegeId: `WARDEN-${Date.now()}`, // Assign a unique placeholder ID
            role: 'Warden',
        });
        
        res.status(201).json({
            _id: warden._id,
            name: warden.name,
            email: warden.email,
            role: warden.role,
        });

    } catch (error) {
        res.status(400).json({ message: "Invalid data" });
    }
};