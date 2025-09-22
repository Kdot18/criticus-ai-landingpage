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

    // Validate why collaborate text (word count check)
    const wordCount = whyCollaborate.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 100) {
      return res.status(400).json({
        error: 'Why collaborate section must be 100 words or less'
      });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('collaborator_applications')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          institution_type: institutionType,
          institution_name: institutionName.trim(),
          role: role,
          why_collaborate: whyCollaborate.trim()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);

      // Check for duplicate email
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Email already has a pending collaborator application'
        });
      }

      return res.status(500).json({
        error: 'Failed to submit collaborator application',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(201).json({
      success: true,
      message: 'Collaborator application submitted successfully!',
      data: { id: data[0].id }
    });

  } catch (error) {
    console.error('Collaborator application error:', error);
    res.status(500).json({
      error: 'Failed to submit collaborator application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}