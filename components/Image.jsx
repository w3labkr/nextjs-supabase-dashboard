import NextImage from 'next/image';

export default function Image({
  src,
  alt,
  quality = 75,
  width = 0,
  height = 0,
  sizes = '100vw',
  priority = true,
  ...rest
}) {
  return (
    <NextImage
      src={src}
      alt={alt}
      quality={quality}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      {...rest}
    />
  );
}
