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
    const { name, email, university, role, howHeardAboutUs } = req.body;

    // Validate input
    if (!name || !email || !university || !role || !howHeardAboutUs) {
      return res.status(400).json({
        error: 'All fields are required: name, email, university, role, howHeardAboutUs'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate role
    const validRoles = ['student', 'professor', 'administrator', 'other'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Must be student, professor, administrator, or other'
      });
    }

    // Validate how heard about us
    const validSources = ['social media', 'word of mouth', 'academic conference', 'other'];
    if (!validSources.includes(howHeardAboutUs)) {
      return res.status(400).json({
        error: 'Invalid source. Must be social media, word of mouth, academic conference, or other'
      });
    }

    // Generate ID and create signup
    const signupId = uuidv4();

    await db.createWaitlistSignup({
      id: signupId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      university: university.trim(),
      role,
      howHeardAboutUs
    });

    res.status(201).json({
      message: 'Successfully added to waitlist!',
      id: signupId
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);

    // Handle duplicate email error
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'This email is already on our waitlist!'
      });
    }

    res.status(500).json({
      error: 'Failed to add to waitlist',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}