import nodemailer from 'nodemailer';

import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailRequest {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message }: EmailRequest = req.body;

    const recipientEmail = 'ozergkalp@gmail.com';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'New Submission',
      text: `A new link has been submitted: ${message}`, // Use the input text here
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Link sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'sending link' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
