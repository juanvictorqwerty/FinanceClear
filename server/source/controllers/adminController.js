import * as userAdmin from '../services/userAdminServices.js';
import * as profileAdmin from '../services/profileAdminServices.js';
import * as clearanceAdmin from '../services/clearanceAdminServices.js';
import * as usedUBAAdmin from '../services/usedUBAAdminServices.js';

// Get all users
export const getAllUsersController = async (req, res) => {
    const result = await userAdmin.getAllUsers();
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Search users
export const searchUsersController = async (req, res) => {
    const { q } = req.query;
    const result = await userAdmin.searchUsers(q || '');
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Get all profiles
export const getAllProfilesController = async (req, res) => {
    const result = await profileAdmin.getAllProfiles();
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Search profiles
export const searchProfilesController = async (req, res) => {
    const { q } = req.query;
    const result = await profileAdmin.searchProfiles(q || '');
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Get all clearances
export const getAllClearancesController = async (req, res) => {
    const result = await clearanceAdmin.getAllClearances();
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Search clearances
export const searchClearancesController = async (req, res) => {
    const { q } = req.query;
    const result = await clearanceAdmin.searchClearances(q || '');
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Get all usedUBA_receipt
export const getAllUsedUBAReceiptsController = async (req, res) => {
    const result = await usedUBAAdmin.getAllUsedUBAReceipts();
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Search usedUBA_receipt
export const searchUsedUBAReceiptsController = async (req, res) => {
    const { q } = req.query;
    const result = await usedUBAAdmin.searchUsedUBAReceipts(q || '');
    if (result.success) return res.json(result);
    return res.status(500).json(result);
};

// Add a clearance to a user's profile
export const addClearanceController = async (req, res) => {
    const { userEmail } = req.body;

    if (!userEmail) {
        return res.status(400).json({ success: false, message: "User email is required." });
    }

    const result = await clearanceAdmin.addClearanceToProfile(userEmail);
    if (result.success) {
        return res.json(result);
    }

    if (result.message.includes("not found")) {
        return res.status(404).json(result);
    }

    return res.status(500).json(result);
};
