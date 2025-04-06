// models/eventAnalytics.model.js
const mongoose = require('mongoose');

const eventAnalyticsSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['SPORTS', 'MOVIES', 'CONCERTS', 'OTHERS'],
    required: true,
  },
  totalTicketsSold: {
    type: Number,
    default: 0,
  },
  maxTickets: {
    type: Number,
    required: true,
  },
  salesByAge: {
    type: Map,
    of: Number, // age -> count
    default: {},
  },
  salesByGender: {
    type: Map,
    of: Number, // gender -> count
    default: {},
  },
  dailySales: {
    type: Map,
    of: Number, // ISO Date (YYYY-MM-DD) -> number of tickets sold
    default: {},
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const EventAnalytics = mongoose.model('EventAnalytics', eventAnalyticsSchema);

module.exports = EventAnalytics;
