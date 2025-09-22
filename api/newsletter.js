const { v4: uuidv4 } = require('uuid');
const Database = require('./database.js');

// Initialize database
const db = new Database();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        error: 'All fields are required: name, email'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const subscriptionId = uuidv4();
    const currentTime = new Date().toISOString();

    // Insert newsletter subscription into database
    await db.addNewsletterSubscription({
      id: subscriptionId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      created_at: currentTime
    });

    res.status(201).json({
      success: true,
      message: 'Newsletter subscription successful!',
      data: { id: subscriptionId }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle duplicate email error
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'This email is already subscribed to our newsletter!'
      });
    }

    res.status(500).json({
      error: 'Failed to subscribe to newsletter',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}