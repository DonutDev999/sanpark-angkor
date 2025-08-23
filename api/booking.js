import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const {
        name,
        email,
        phone,
        tourType,
        tourDate,
        numberOfPeople,
        specialRequests,
        preferredLanguage
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !tourType || !tourDate || !numberOfPeople) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['name', 'email', 'phone', 'tourType', 'tourDate', 'numberOfPeople']
        });
      }

      // Create booking ID
      const bookingId = `SP${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Email configuration
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      // Email to customer
      const customerEmailHtml = `
        <h2>Booking Confirmation - Sanpark Angkor Tours</h2>
        <p>Dear ${name},</p>
        <p>Thank you for booking with Sanpark Angkor Tours! Your booking has been received.</p>
        
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Tour Type:</strong> ${tourType}</li>
          <li><strong>Date:</strong> ${new Date(tourDate).toLocaleDateString()}</li>
          <li><strong>Number of People:</strong> ${numberOfPeople}</li>
          <li><strong>Language:</strong> ${preferredLanguage || 'English'}</li>
          ${specialRequests ? `<li><strong>Special Requests:</strong> ${specialRequests}</li>` : ''}
        </ul>
        
        <p>We will contact you within 24 hours to confirm your booking and provide payment details.</p>
        <p>For immediate assistance, contact us on WhatsApp: ${process.env.WHATSAPP_PHONE || '+855123456789'}</p>
        
        <p>Best regards,<br>Sanpark Angkor Tours Team</p>
      `;

      // Email to business
      const businessEmailHtml = `
        <h2>New Booking Received</h2>
        <h3>Customer Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>
        
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Tour Type:</strong> ${tourType}</li>
          <li><strong>Date:</strong> ${new Date(tourDate).toLocaleDateString()}</li>
          <li><strong>Number of People:</strong> ${numberOfPeople}</li>
          <li><strong>Language:</strong> ${preferredLanguage || 'English'}</li>
          ${specialRequests ? `<li><strong>Special Requests:</strong> ${specialRequests}</li>` : ''}
        </ul>
        
        <p>Please contact the customer within 24 hours to confirm the booking.</p>
      `;

      // Send emails
      await Promise.all([
        transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: `Booking Confirmation - ${bookingId}`,
          html: customerEmailHtml
        }),
        transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.BUSINESS_EMAIL || process.env.GMAIL_USER,
          subject: `New Booking - ${bookingId}`,
          html: businessEmailHtml
        })
      ]);

      res.status(200).json({
        success: true,
        message: 'Booking submitted successfully',
        bookingId,
        data: {
          name,
          email,
          tourType,
          tourDate,
          numberOfPeople
        }
      });

    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process booking',
        message: error.message
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}