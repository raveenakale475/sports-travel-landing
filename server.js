// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (replace with database in production)
const leads = [];

// Email transporter configuration (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your app password
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// POST: Submit lead form
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone format' 
      });
    }

    // Create lead object
    const lead = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString()
    };

    // Store lead (in-memory for now)
    leads.push(lead);

    console.log('✅ New lead received:', lead);

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✈️ Thank You for Your Interest - SportTravel',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 SportTravel</h1>
              <p>Premium Sports Travel Experiences</p>
            </div>
            <div class="content">
              <h2>Hi ${name}! 👋</h2>
              <p>Thank you for your interest in our premium sports travel packages!</p>
              <p>We've received your inquiry and our team will get back to you within 24 hours with personalized recommendations.</p>
              
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Your Submission Details:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
              </div>

              <p>In the meantime, feel free to explore our website or reach out to us directly:</p>
              <ul>
                <li>📞 Phone: +1 (555) 123-4567</li>
                <li>📧 Email: info@sporttravel.com</li>
                <li>💬 WhatsApp: Available 24/7</li>
              </ul>

              <a href="http://localhost:3000" class="button">Visit Our Website</a>
            </div>
            <div class="footer">
              <p>© 2025 SportTravel. All rights reserved.</p>
              <p>New York, USA</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send notification email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: '🔔 New Lead Submission - SportTravel',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .lead-info { background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎯 New Lead Notification</h2>
            </div>
            <div class="content">
              <div class="lead-info">
                <h3>Lead Details:</h3>
                <p><strong>👤 Name:</strong> ${name}</p>
                <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>📞 Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p><strong>💬 Message:</strong></p>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 5px;">${message}</p>
                <p><strong>🕐 Received:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>🆔 Lead ID:</strong> #${lead.id}</p>
              </div>
              <p style="margin-top: 20px;">⚡ <strong>Action Required:</strong> Please follow up within 24 hours.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send emails (optional - comment out if not configured)
    try {
      await transporter.sendMail(userMailOptions);
      await transporter.sendMail(adminMailOptions);
      console.log('📧 Emails sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Continue even if email fails
    }

    // Send success response
    res.status(200).json({ 
      success: true, 
      message: 'Thank you! We\'ll contact you within 24 hours.',
      leadId: lead.id
    });

  } catch (error) {
    console.error('❌ Error processing lead:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong. Please try again.' 
    });
  }
});

// GET: Retrieve all leads (Admin only - add authentication in production)
app.get('/api/leads', (req, res) => {
  res.status(200).json({ 
    success: true, 
    count: leads.length,
    leads: leads 
  });
});

// GET: Retrieve single lead by ID
app.get('/api/leads/:id', (req, res) => {
  const leadId = parseInt(req.params.id);
  const lead = leads.find(l => l.id === leadId);
  
  if (!lead) {
    return res.status(404).json({ 
      success: false, 
      message: 'Lead not found' 
    });
  }
  
  res.status(200).json({ 
    success: true, 
    lead 
  });
});

// DELETE: Delete a lead by ID (Admin only)
app.delete('/api/leads/:id', (req, res) => {
  const leadId = parseInt(req.params.id);
  const index = leads.findIndex(l => l.id === leadId);
  
  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Lead not found' 
    });
  }
  
  leads.splice(index, 1);
  res.status(200).json({ 
    success: true, 
    message: 'Lead deleted successfully' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║   🚀 Server Running Successfully!    ║
    ║                                       ║
    ║   📍 URL: http://localhost:${PORT}     ║
    ║   🕐 Time: ${new Date().toLocaleTimeString()}              ║
    ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}       ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
  `);
});

module.exports = app;