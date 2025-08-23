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
      const { name, email, phone, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['name', 'email', 'message']
        });
      }

      // Email configuration
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      // Email to business
      const businessEmailHtml = `
        <h2>New Contact Form Submission</h2>
        <h3>Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
          ${subject ? `<li><strong>Subject:</strong> ${subject}</li>` : ''}
        </ul>
        
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <p>Received at: ${new Date().toLocaleString()}</p>
      `;

      // Auto-reply to customer
      const customerEmailHtml = `
        <h2>Thank you for contacting Sanpark Angkor Tours</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p>
        
        <h3>Your Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <p>For immediate assistance, you can also contact us on WhatsApp: ${process.env.WHATSAPP_PHONE || '+855123456789'}</p>
        
        <p>Best regards,<br>Sanpark Angkor Tours Team</p>
      `;

      // Send emails
      await Promise.all([
        transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.BUSINESS_EMAIL || process.env.GMAIL_USER,
          subject: `Contact Form: ${subject || 'New Message'}`,
          html: businessEmailHtml
        }),
        transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Thank you for contacting Sanpark Angkor Tours',
          html: customerEmailHtml
        })
      ]);

      res.status(200).json({
        success: true,
        message: 'Message sent successfully'
      });

    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message',
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