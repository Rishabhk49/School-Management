const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use Routes
app.use('/api/schools', schoolRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
