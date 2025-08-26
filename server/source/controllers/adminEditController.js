import * as adminEdit from '../services/adminEditServices.js';

export const updateUserEmailUsernameController = async (req, res) => {
    const { oldEmail, oldUsername, newEmail, newUsername } = req.body;
    if (!oldEmail && !oldUsername) return res.status(400).json({ success: false, message: 'Old email or username required.' });
    if (!newEmail && !newUsername) return res.status(400).json({ success: false, message: 'New email or username required.' });
    const result = await adminEdit.updateUserEmailUsername(oldEmail, oldUsername, newEmail, newUsername);
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

export const updateProfileFeesController = async (req, res) => {
    const { username, school_fee_due, penalty_fee, excess_fee } = req.body;
    if (!username) return res.status(400).json({ success: false, message: 'Username required.' });
    const result = await adminEdit.updateProfileFees(username, school_fee_due, penalty_fee, excess_fee);
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};
