import mongoose from 'mongoose';
const { Schema } = mongoose;

// Enum for event categories
export const EventCategory = {
  SPORTS: 'SPORTS',
  MOVIES: 'MOVIES',
  CONCERTS: 'CONCERTS',
  OTHERS: 'OTHERS'
};

// Schema for analytics of a specific event
const EventAnalyticsSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  eventName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: Object.values(EventCategory),
    required: true
  },
  totalTicketsSold: {
    type: Number,
    default: 0
  },
  maxTickets: {
    type: Number,
    required: true
  },
  salesByAge: {
    type: Map,
    of: Number,
    default: new Map()
  },
  salesByGender: {
    type: Map,
    of: Number,
    default: new Map()
  },
  dailySales: {
    type: Map,
    of: Number,
    default: new Map()
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for organizer analytics (containing multiple events)
const OrganizerAnalyticsSchema = new Schema({
  organizerId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  organizerName: {
    type: String,
    required: true
  },
  events: [{
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'EventAnalytics'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
EventAnalyticsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

OrganizerAnalyticsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export the models
export const EventAnalytics = mongoose.model('EventAnalytics', EventAnalyticsSchema);
export const OrganizerAnalytics = mongoose.model('OrganizerAnalytics', OrganizerAnalyticsSchema);
