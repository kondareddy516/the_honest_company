import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

const ImageCropper = ({ imageSrc, onCropComplete, aspectRatio = 1 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const onCropChange = (crop) => {
        setCrop(crop);
    }

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    }

    const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
       onCropComplete(croppedAreaPixels);
    }, [onCropComplete]);

    return (
        <div className="relative h-64 w-full bg-gray-200 mt-4">
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={onCropChange}
                onCropComplete={onCropCompleteHandler}
                onZoomChange={onZoomChange}
            />
        </div>
    );
};

export { ImageCropper, getCroppedImg };
