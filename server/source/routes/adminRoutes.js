import express from 'express';
import {
    getAllUsersController,
    searchUsersController,
    getAllProfilesController,
    searchProfilesController,
    getAllClearancesController,
    searchClearancesController,
    getAllUsedUBAReceiptsController,
    searchUsedUBAReceiptsController
} from '../controllers/adminController.js';
import {
    updateUserEmailUsernameController,
    updateProfileFeesController
} from '../controllers/adminEditController.js';

const router = express.Router();

// Users
router.get('/users', getAllUsersController);
router.get('/users/search', searchUsersController);

// Profiles
router.get('/profiles', getAllProfilesController);
router.get('/profiles/search', searchProfilesController);

// Clearances
router.get('/clearances', getAllClearancesController);
router.get('/clearances/search', searchClearancesController);

// UsedUBA_receipt
router.get('/useduba', getAllUsedUBAReceiptsController);
router.get('/useduba/search', searchUsedUBAReceiptsController);

// Admin edit endpoints
router.put('/user/edit', updateUserEmailUsernameController); // expects {oldEmail, oldUsername, newEmail, newUsername}
router.put('/profile/fees', updateProfileFeesController); // expects {username, school_fee_due, penalty_fee, excess_fee}

export default router;
