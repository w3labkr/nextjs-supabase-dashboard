/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';

import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

import { useTranslation } from '@/app/i18n/client';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  margin: theme.spacing(0, 3),
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

function Header({ lng }: { lng: string }) {
  const { t } = useTranslation(lng);

  return (
    <AppBar position="relative">
      <Toolbar>
        <CameraIcon sx={{ mr: 2 }} />
        <Typography color="inherit" variant="h6" component="div" sx={{ flexGrow: 1 }} noWrap>
          Album layout
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <Button
          href={`/${lng}/signin`}
          LinkComponent={Link}
          color="inherit"
          style={{ marginRight: 4, whiteSpace: 'nowrap', minWidth: 'auto' }}
        >
          {t('SignIn')}
        </Button>
        <Button
          href={`/${lng}/signup`}
          LinkComponent={Link}
          color="inherit"
          style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
        >
          {t('SignUp')}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {' 2023-2024. '}
      </Typography>
    </Box>
  );
}

function Hero() {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          Album layout
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Something short and leading about the collection below—its contents, the creator, etc. Make it short and
          sweet, but not too short so folks don&apos;t simply skip over it entirely.
        </Typography>
      </Container>
    </Box>
  );
}

export default function RootPage({ params: { lng } }: { params: { lng: string } }) {
  return (
    <>
      <Header lng={lng} />
      <main>
        <Hero />
        <Container sx={{ py: 8 }} maxWidth="xl">
          <ImageList variant="masonry" cols={6} gap={8}>
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <Link href={`/${lng}/about`} style={{ display: 'block', overflow: 'hidden' }}>
                  <img
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar position="below" title={item.title} />
                </Link>
              </ImageListItem>
            ))}
          </ImageList>
        </Container>
      </main>
      <Footer />
    </>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    title: 'Bed',
  },
  {
    img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
    title: 'Books',
  },
  {
    img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    title: 'Sink',
  },
  {
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
  },
  {
    img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    title: 'Blinds',
  },
  {
    img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    title: 'Chairs',
  },
  {
    img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    title: 'Laptop',
  },
  {
    img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    title: 'Doors',
  },
  {
    img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
  },
  {
    img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    title: 'Candle',
  },
  {
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
  },
];
