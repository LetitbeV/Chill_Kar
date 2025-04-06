import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import analyticsRoutes from './routes/EventAnalytics.js'; // Make sure the path is correct

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// === MongoDB Connection ===
mongoose.connect('mongodb://localhost:27017/event-ticketing', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Failed to connect to MongoDB:', err));

// === API Routes ===
app.use('/api/analytics', analyticsRoutes);

// === Global Error Handler ===
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
