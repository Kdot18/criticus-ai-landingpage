import supabase from './supabase.js';

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

    // Insert into Supabase
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          institution_type: institutionType,
          institution_name: institutionName.trim(),
          role
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: 'Failed to submit demo request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(201).json({
      message: 'Demo request submitted successfully!',
      id: data[0].id
    });

  } catch (error) {
    console.error('Demo request error:', error);
    res.status(500).json({
      error: 'Failed to submit demo request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}