import User from '../models/UserModel.js';

// Get user profile
export const getUserProfile = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-passwordHash'); // Exclude sensitive data
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    const userId = req.params.userId;
    const { username, email } = req.body; // Example fields to update

    const user = await User.findById(userId);
    if (user) {
        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();
        res.json({ message: "Profile updated successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// Delete user profile
export const deleteUserProfile = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
};
