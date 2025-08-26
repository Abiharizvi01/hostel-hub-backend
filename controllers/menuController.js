import Menu from '../models/Menu.js';

// @desc    Get the weekly menu
// @route   GET /api/menu
export const getMenu = async (req, res) => {
  try {
    // We find all 7 days of the menu
    const menu = await Menu.find({});
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/// controllers/menuController.js

// @desc    Set or update the weekly menu (Warden only)
// @route   POST /api/menu
export const setMenu = async (req, res) => {
    // Expects an array of 7 menu objects in the body
    const menuData = req.body;
  
    try {
      // Add the logged-in warden's ID to each menu item
      const menuDataWithUser = menuData.map((item) => ({
        ...item,
        user: req.user._id, // This is the new, important line
      }));
  
      // Clear the old menu
      await Menu.deleteMany({});
      
      // Insert the new menu with the user ID included
      const newMenu = await Menu.insertMany(menuDataWithUser);
      
      res.status(201).json(newMenu);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };