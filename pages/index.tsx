import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

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
import { items } from '@/items';

const exo = Exo({ subsets: ['latin'] });

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus('');
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!inputValue.trim()) {
        setStatus('Please enter a message');
        return;
      }

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputValue }),
        });

        if (response.ok) {
          setStatus('Link sent successfully');
        } else {
          const data = await response.json();
          setStatus(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus('Error sending link');
      }

      setInputValue('');
    },
    [inputValue]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const reversedItems = [...items].reverse();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = reversedItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(items.length / itemsPerPage);

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
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <Input
          placeholder="https://example.com"
          className="mx-auto w-96"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
      {status && <p className={`pt-3 ${status === 'Link sent successfully' ? 'text-green-500' : 'text-red-500'}`}>{status}</p>}
      <div className="flex-1 my-5 mt-7 relative">
        {paginatedItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col mb-5"
          >
            <Link
              href={item.link}
              className="text-blue-500 underline"
            >
              {item.title}
            </Link>
            <p>{item.description}</p>
            <div className="text-xs font-semibold">{item.date}</div>
          </div>
        ))}
      </div>
      <Pagination>
        <PaginationContent className="items-end pb-10">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
