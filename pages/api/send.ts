import { Resend } from 'resend';

import type { NextApiRequest, NextApiResponse } from 'next';

import { EmailTemplate } from '@/emails/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { subject } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'ReactBlog <user@example.com>',
      to: ['ozergokalpsezer@gmail.com'],
      subject: subject || 'Default Subject',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ error });
  }
};
