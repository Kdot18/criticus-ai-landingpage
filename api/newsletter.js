const supabase = require('./supabase.js');

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

    // Insert into Supabase
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);

      // Handle duplicate email error
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'This email is already subscribed to our newsletter!'
        });
      }

      return res.status(500).json({
        error: 'Failed to subscribe to newsletter',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(201).json({
      success: true,
      message: 'Newsletter subscription successful!',
      data: { id: data[0].id }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      error: 'Failed to subscribe to newsletter',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}