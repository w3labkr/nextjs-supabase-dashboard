'use client';

import Image from 'next/image';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import { useTranslations } from 'next-intl';

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

function skeletonData(fetchInitialSize = 1, fetchSize = 10) {
  return Array.from(Array(fetchInitialSize * fetchSize).keys());
}

function SkeletonGridItem({ index }) {
  const height = index % 2 === 0 ? 160 : index % 3 === 0 ? 240 : 320;
  return (
    <div className="p-1 xs:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
      <Skeleton animation="wave" width="100%" height={height} className="transform-none" />
    </div>
  );
}

function FetchError({ message = '' }) {
  return <div className="text-center">{message}</div>;
}

function NoMore({ message = '' }) {
  return <div className="pt-12 text-center">{message}</div>;
}

export default function Gallery() {
  const fetchSize = 10;
  const fetchInitialSize = 2;
  const { data, error, isLoading, isReachingEnd, ref } = useInfiniteScroll({
    fetchUrl: 'http://localhost:3000/api/v1/gallery',
    fetchSize,
    fetchInitialSize,
    debounceWait: 300,
    intersectionObserveThresholds: 0,
  });
  const t = useTranslations('Gallery');

  if (error) return <FetchError message={t('fetch-error')} />;

  return (
    <div>
      <Container maxWidth="xl">
        <MasonryInfiniteGrid align="justify" gap={0}>
          {isLoading
            ? skeletonData(fetchInitialSize, fetchSize).map((i) => <SkeletonGridItem key={i} index={i} />)
            : data.map((item) => <GridItem key={item.id} item={item} />)}
        </MasonryInfiniteGrid>
        {isReachingEnd && <NoMore message={t('no-more')} />}
        <div ref={ref}></div>
      </Container>
    </div>
  );
}
