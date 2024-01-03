// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// The React Framework.
import NextImage from 'next/image';

function Image({ src, alt, quality = 75, width = 0, height = 0, sizes = '100vw', priority = true, ...rest }) {
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

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  quality: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  sizes: PropTypes.string,
  priority: PropTypes.bool,
};

export default Image;
