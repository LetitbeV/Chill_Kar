import express from 'express';
import { processTicketPurchase, getAllEventsAnalytics, getOrganizerAnalytics } from '../controllers/event.controller.js';

const router = express.Router();

// Ticket purchase and update event stats
router.post('/purchase', processTicketPurchase);

// Get all event analytics (filterable by organizerId or category)
router.get('/events', getAllEventsAnalytics);

// Get full dashboard data for an organizer
router.get('/organizer/:organizerId', getOrganizerAnalytics);

export default router;
