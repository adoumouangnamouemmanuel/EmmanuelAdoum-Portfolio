import type { ImageProps } from 'next/image';
import Image from 'next/image';

const ResponsiveImage = (props: ImageProps) => {
  return (
    <Image
      {...props}
      onLoad={(e) => {
        if (props.onLoadingComplete) {
          props.onLoadingComplete(e);
        }
      }}
    />
  );
};

export default ResponsiveImage; 