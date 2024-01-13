'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import Container from '@mui/material/Container';

const blurDataURL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==';

function GridItem({ item }) {
  return (
    <div className="p-1 xs:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
      <Image
        srcSet={`${item.url}?w=320&fit=crop&auto=format&dpr=2 2x`}
        src={`${item.url}?w=320&fit=crop&auto=format`}
        alt={item.title}
        width={0}
        height={0}
        sizes="100vw"
        className="block w-full h-auto rounded"
        loading="lazy"
        placeholder="blur"
        blurDataURL={blurDataURL}
      />
    </div>
  );
}

export default function Gallery() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/photos?page=${page}&per_page=${per_page}`)
      .then((res) => res.json())
      .then((data) => {
        return !!data && setPosts([...posts, ...data]);
      });
  }, [page, per_page, posts, setPosts]);

  return (
    <div>
      <Container maxWidth="xl">
        <MasonryInfiniteGrid align="justify" gap={0}>
          {posts.map((item) => (
            <GridItem key={item.id} item={item} />
          ))}
        </MasonryInfiniteGrid>
        <button onClick={() => setPage((prev) => prev + 1)}>Load More</button>
      </Container>
    </div>
  );
}
