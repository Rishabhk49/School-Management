const db = require('../db/connection');
const { calculateDistance } = require('../utils/geolocation');

// Add School Controller
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    console.log('Received data to add school:', { name, address, latitude, longitude });

    try {
        
        const [result] = await db.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, parseFloat(latitude), parseFloat(longitude)]
        );

        console.log('School added successfully with ID:', result.insertId);

        res.status(201).json({
            message: 'School added successfully!',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error('Error adding school:', error.message);
        res.status(500).json({
            message: 'Error adding school.',
            error: error.message
        });
    }
};

// List Schools Controller
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validate if latitude and longitude are provided
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and Longitude are required.' });
    }

    console.log('Received user location to list schools:', { latitude, longitude });

    try {
        // Fetch all schools from the database
        const [schools] = await db.query('SELECT * FROM schools');

        console.log('Fetched schools:', schools);

        // Convert latitude and longitude to floats
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        // Sort schools by distance to the user
        const sortedSchools = schools
            .map(school => ({
                ...school,
                distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
            }))
            .sort((a, b) => a.distance - b.distance);

        console.log('Sorted schools by distance:', sortedSchools);

        // Return sorted schools
        res.status(200).json(sortedSchools);
    } catch (error) {
        console.error('Error fetching schools:', error.message);
        res.status(500).json({
            message: 'Error fetching schools.',
            error: error.message
        });
    }
};
