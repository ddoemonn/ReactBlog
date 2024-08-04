import { useState } from 'react';

import { Exo } from 'next/font/google';
import { FaReact } from 'react-icons/fa';

import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const exo = Exo({ subsets: ['latin'] });

export default function Home() {
  const [subject, setSubject] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Email sent successfully:', result);
      } else {
        console.error('Error sending email:', result);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <main className={`flex h-screen flex-col items-center p-24 pt-10 pb-2 ${exo.className}`}>
      <div className="absolute right-5">
        <ModeToggle />
      </div>
      <div className="text-4xl mb-2 font-bold flex items-center justify-center gap-2">
        <h2>ReactBlog</h2>
        <FaReact className="text-blue-500 w-10 h-10 animate-spin-slow" />
      </div>
      <p className="text-center text-lg mb-5">Submit links to articles, repositories, or anything related to React!</p>
      <div className="flex gap-2">
        <Input
          placeholder="Enter email subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="mx-auto w-96"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <div />
      <Pagination className="flex-1">
        <PaginationContent className="items-end pb-10">
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
