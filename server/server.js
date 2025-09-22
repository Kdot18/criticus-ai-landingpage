const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const Database = require('./database');

const app = express();
const port = process.env.PORT || 3001;

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Criticus AI Backend is running!' });
});

// Waitlist signup endpoint
app.post('/api/waitlist', async (req, res) => {
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
    const validRoles = ['student', 'professor', 'administrator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Must be student, professor, or administrator'
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
      success: true,
      message: 'Successfully added to waitlist!',
      data: { id: signupId }
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);

    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        error: 'This email is already on our waitlist!'
      });
    }

    res.status(500).json({
      error: 'Failed to add to waitlist',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Demo request endpoint
app.post('/api/demo', async (req, res) => {
  try {
    const { name, email, institutionType, institutionName, role } = req.body;

    // Validate input
    if (!name || !email || !institutionType || !institutionName || !role) {
      return res.status(400).json({
        error: 'All fields are required: name, email, institutionType, institutionName, role'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate institution type
    const validInstitutionTypes = ['high-school', 'community-college', 'university'];
    if (!validInstitutionTypes.includes(institutionType)) {
      return res.status(400).json({
        error: 'Invalid institution type. Must be high-school, community-college, or university'
      });
    }

    // Validate role based on institution type
    const validRoles = {
      'high-school': ['high-school-teacher', 'high-school-administrator'],
      'community-college': ['community-college-professor', 'community-college-administrator'],
      'university': ['university-professor', 'university-administrator']
    };

    if (!validRoles[institutionType].includes(role)) {
      return res.status(400).json({
        error: `Invalid role for ${institutionType}. Must be one of: ${validRoles[institutionType].join(', ')}`
      });
    }

    // Generate ID and create demo request
    const requestId = uuidv4();

    await db.createDemoRequest({
      id: requestId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      institutionType,
      institutionName: institutionName.trim(),
      role
    });

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully!',
      data: { id: requestId }
    });

  } catch (error) {
    console.error('Demo request error:', error);

    res.status(500).json({
      error: 'Failed to submit demo request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Newsletter signup endpoint
app.post('/api/newsletter', async (req, res) => {
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

    // Check for duplicate email
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'Email already subscribed to newsletter'
      });
    }

    res.status(500).json({
      error: 'Failed to subscribe to newsletter',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Collaborators signup endpoint
app.post('/api/collaborators', async (req, res) => {
  try {
    const { name, email, institutionType, institutionName, role, whyCollaborate } = req.body;

    // Validate input
    if (!name || !email || !institutionType || !institutionName || !role || !whyCollaborate) {
      return res.status(400).json({
        error: 'All fields are required: name, email, institutionType, institutionName, role, whyCollaborate'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate institution type
    const validInstitutionTypes = ['high-school', 'community-college', 'university'];
    if (!validInstitutionTypes.includes(institutionType)) {
      return res.status(400).json({
        error: 'Invalid institution type. Must be high-school, community-college, or university'
      });
    }

    const applicationId = uuidv4();
    const currentTime = new Date().toISOString();

    // Insert collaborator application into database
    await db.addCollaboratorApplication({
      id: applicationId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      institution_type: institutionType,
      institution_name: institutionName.trim(),
      role: role,
      why_collaborate: whyCollaborate.trim(),
      created_at: currentTime
    });

    res.status(201).json({
      success: true,
      message: 'Collaborator application submitted successfully!',
      data: { id: applicationId }
    });

  } catch (error) {
    console.error('Collaborator application error:', error);

    // Check for duplicate email
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'Email already has a pending collaborator application'
      });
    }

    res.status(500).json({
      error: 'Failed to submit collaborator application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin endpoints (for viewing data)
app.get('/api/admin/waitlist', async (req, res) => {
  try {
    const signups = await db.getWaitlistSignups();
    res.json({ signups });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ error: 'Failed to fetch waitlist data' });
  }
});

app.get('/api/admin/demos', async (req, res) => {
  try {
    const requests = await db.getDemoRequests();
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    res.status(500).json({ error: 'Failed to fetch demo requests' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`🚀 Criticus AI backend server running on http://localhost:${port}`);
});