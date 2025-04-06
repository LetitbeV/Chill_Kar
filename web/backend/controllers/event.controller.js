import { EventAnalytics, OrganizerAnalytics } from '../models/AllEventAnalytics.js';

// Process ticket purchase and update analytics
export const processTicketPurchase = async (req, res) => {
  try {
    const { 
      eventId, 
      ticketCount, 
      totalAmount, 
      customerData 
    } = req.body;

    // Find the event analytics
    const eventAnalytics = await EventAnalytics.findOne({ eventId });
    
    if (!eventAnalytics) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if tickets are available
    if (eventAnalytics.totalTicketsSold + ticketCount > eventAnalytics.maxTickets) {
      return res.status(400).json({ success: false, message: 'Not enough tickets available' });
    }

    // Extract customer data
    const { age, gender, location } = customerData;
    
    // Update total tickets sold
    eventAnalytics.totalTicketsSold += ticketCount;
    
    // Update total revenue
    eventAnalytics.totalRevenue += totalAmount;
    
    // Update age distribution
    const ageGroup = determineAgeGroup(age);
    const currentAgeSales = eventAnalytics.salesByAge.get(ageGroup) || 0;
    eventAnalytics.salesByAge.set(ageGroup, currentAgeSales + ticketCount);
    
    // Update gender distribution
    const currentGenderSales = eventAnalytics.salesByGender.get(gender) || 0;
    eventAnalytics.salesByGender.set(gender, currentGenderSales + ticketCount);
    
    // Update daily sales - group by date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    const currentDailySales = eventAnalytics.dailySales.get(today) || 0;
    eventAnalytics.dailySales.set(today, currentDailySales + ticketCount);
    
    // Save the updated analytics
    await eventAnalytics.save();
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Ticket purchase processed successfully',
      ticketsRemaining: eventAnalytics.maxTickets - eventAnalytics.totalTicketsSold
    });
    
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to determine age group
function determineAgeGroup(age) {
  if (age < 18) return 'under18';
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  return '55+';
}

// Get analytics for all events (with pagination and filters)
export const getAllEventsAnalytics = async (req, res) => {
  try {
    const { organizerId, category, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (organizerId) {
      const organizerAnalytics = await OrganizerAnalytics.findOne({ organizerId });
      if (organizerAnalytics) {
        const eventIds = organizerAnalytics.events.map(event => event.eventId);
        query._id = { $in: eventIds };
      }
    }
    
    if (category) {
      query.category = category;
    }
    
    // Get data
    const events = await EventAnalytics.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await EventAnalytics.countDocuments(query);
    
    // Format data for dashboard
    const formattedEvents = events.map(event => {
      // Process age distribution
      const ageDistribution = Array.from(event.salesByAge).map(([group, count]) => ({
        group,
        value: count
      }));
      
      // Process gender distribution
      const genderDistribution = Array.from(event.salesByGender).map(([gender, count]) => ({
        gender,
        value: count
      }));
      
      // Process daily sales
      const dailySales = Array.from(event.dailySales).map(([date, count]) => ({
        date,
        tickets: count
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Calculate percentage sold
      const percentageSold = (event.totalTicketsSold / event.maxTickets) * 100;
      
      return {
        id: event._id,
        eventId: event.eventId,
        name: event.eventName,
        category: event.category,
        totalTicketsSold: event.totalTicketsSold,
        maxTickets: event.maxTickets,
        percentageSold,
        totalRevenue: event.totalRevenue,
        ageDistribution,
        genderDistribution,
        dailySales,
        createdAt: event.createdAt
      };
    });
    
    // Return formatted data
    res.status(200).json({
      success: true,
      data: formattedEvents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error getting events analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get analytics for a specific organizer
export const getOrganizerAnalytics = async (req, res) => {
  try {
    const { organizerId } = req.params;
    
    // Get organizer data
    const organizerAnalytics = await OrganizerAnalytics.findOne({ organizerId });
    
    if (!organizerAnalytics) {
      return res.status(404).json({ success: false, message: 'Organizer not found' });
    }
    
    // Get all events for this organizer
    const eventIds = organizerAnalytics.events.map(event => event.eventId);
    const events = await EventAnalytics.find({ _id: { $in: eventIds } });
    
    // Calculate aggregated metrics
    const totalEvents = events.length;
    const totalTicketsSold = events.reduce((sum, event) => sum + event.totalTicketsSold, 0);
    const totalMaxTickets = events.reduce((sum, event) => sum + event.maxTickets, 0);
    const totalRevenue = events.reduce((sum, event) => sum + event.totalRevenue, 0);
    
    // Process top performing events
    const topPerformingEvents = events
      .map(event => ({
        id: event._id,
        eventId: event.eventId,
        name: event.eventName,
        category: event.category,
        totalTicketsSold: event.totalTicketsSold,
        maxTickets: event.maxTickets,
        percentageSold: (event.totalTicketsSold / event.maxTickets) * 100,
        totalRevenue: event.totalRevenue
      }))
      .sort((a, b) => b.percentageSold - a.percentageSold)
      .slice(0, 5);
    
    // Compile monthly ticket sales (combine all events)
    const monthlySalesMap = new Map();
    
    events.forEach(event => {
      event.dailySales.forEach((count, dateStr) => {
        const monthYear = dateStr.substring(0, 7); // Extract YYYY-MM
        const currentCount = monthlySalesMap.get(monthYear) || 0;
        monthlySalesMap.set(monthYear, currentCount + count);
      });
    });
    
    const monthlyTicketSales = Array.from(monthlySalesMap)
      .map(([month, tickets]) => ({ month, tickets }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    // Compile age distribution (combine all events)
    const ageMap = new Map();
    
    events.forEach(event => {
      event.salesByAge.forEach((count, ageGroup) => {
        const currentCount = ageMap.get(ageGroup) || 0;
        ageMap.set(ageGroup, currentCount + count);
      });
    });
    
    const ageDistribution = Array.from(ageMap)
      .map(([group, value]) => ({ group, value }));
    
    // Compile gender distribution (combine all events)
    const genderMap = new Map();
    
    events.forEach(event => {
      event.salesByGender.forEach((count, gender) => {
        const currentCount = genderMap.get(gender) || 0;
        genderMap.set(gender, currentCount + count);
      });
    });
    
    const genderDistribution = Array.from(genderMap)
      .map(([gender, value]) => ({ gender, value }));
    
    // Compile event categories
    const categoryMap = new Map();
    
    events.forEach(event => {
      const category = event.category;
      const currentCount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentCount + 1);
    });
    
    const eventCategoryData = Array.from(categoryMap)
      .map(([category, value]) => ({ category, value }));
    
    // Return formatted data
    res.status(200).json({
      success: true,
      organizerId: organizerAnalytics.organizerId,
      organizerName: organizerAnalytics.organizerName,
      totalEvents,
      totalTicketsSold,
      totalMaxTickets,
      totalRevenue,
      topPerformingEvents,
      monthlyTicketSales,
      ageDistribution,
      genderDistribution,
      eventCategoryData,
      // Mock location data (as it wasn't in original schema)
      locationData: [
        { location: "Online", value: Math.floor(totalTicketsSold * 0.4) },
        { location: "In-person", value: Math.floor(totalTicketsSold * 0.6) }
      ]
    });
    
  } catch (error) {
    console.error('Error getting organizer analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
