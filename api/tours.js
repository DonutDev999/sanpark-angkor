import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
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

  if (req.method === 'GET') {
    try {
      // Read tours data from public/data/tours.json
      const toursPath = join(process.cwd(), 'public', 'data', 'tours.json');
      const toursData = readFileSync(toursPath, 'utf8');
      const tours = JSON.parse(toursData);
      
      res.status(200).json({
        success: true,
        data: tours,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error reading tours data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load tours data',
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