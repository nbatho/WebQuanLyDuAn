import express from 'express';
import { authMe, profiles, updateProfile, getProfileStats } from '../controllers/userControllers.js';
const router = express.Router();

router.get('/me', authMe);
router.get('/profiles', profiles);
router.put('/profiles', updateProfile);
router.get('/profiles/stats', getProfileStats);

export default router;