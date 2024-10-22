import nodemailer from 'nodemailer';

import type { NextApiRequest, NextApiResponse } from 'next';

import { getSubmission, updateSubmission } from '@/submissionStore';

interface EmailRequest {
  message: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, email }: EmailRequest = req.body;

    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!userIp) {
      res.status(400).json({ message: 'IP address is required' });
      return;
    }

    const submission = getSubmission(userIp as string);

    if (submission && submission.count >= 5) {
      res.status(429).json({ message: 'You can only submit 5 links per day' });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(email);

    try {
      await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Submission',
        text: `A new link has been submitted: ${message}`,
      });
      updateSubmission(userIp as string);
      res.status(200).json({ message: 'Link sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending link' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
