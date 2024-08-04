import { useCallback, useState } from 'react';

import Link from 'next/link';

import DOMPurify from 'dompurify';
import { Exo } from 'next/font/google';
import { FaReact } from 'react-icons/fa';
import { toast } from 'sonner';

import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const itemsPerPage = 4;

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!inputValue.trim()) {
        toast('Link status', {
          description: 'Please enter a message',
        });
        return;
      }

      const sanitizedMessage = DOMPurify.sanitize(inputValue);

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: sanitizedMessage }),
        });

        if (response.ok) {
          toast('Link status', {
            description: 'Message sent successfully',
          });
        } else {
          const data = await response.json();
          toast('Link status error', {
            description: `${data.message}`,
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast('Link status error', {
          description: 'Error sending link',
        });
      }

      setInputValue('');
    },
    [inputValue]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const reversedItems = [...items].reverse();

  const filteredItems = reversedItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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
          placeholder="Search..."
          className="mx-auto w-96"
          value={searchQuery}
          onChange={e => setSearchQuery(DOMPurify.sanitize(e.target.value))}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button>Submit a link</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4 py-4">
              <div className="">
                <Label
                  htmlFor="name"
                  className="text-right mb-2"
                >
                  Link
                </Label>
                <Input
                  id="name"
                  defaultValue="https://example.com"
                  value={inputValue}
                  onChange={e => setInputValue(DOMPurify.sanitize(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
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
