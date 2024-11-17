import { FC, SyntheticEvent, useCallback, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    chatMessages,
    croppedImage,
    croppedImageUrl,
    currentMode,
    imageUrl,
    isMessageLoading,
} from '../app.atoms';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import { FormattedImg } from '../app.types';
import { initialCrop, Modes } from '../app.const';
import { requestDataByImage } from '../app.services';
import { nanoid } from 'nanoid';

const CropScreen: FC = () => {
    const [croppedImg, setCroppedImg] = useRecoilState(croppedImage);
    const [croppedImgUrl, setCroppedImgUrl] = useRecoilState(croppedImageUrl);
    const [messages, setMessages] = useRecoilState(chatMessages);
    const [isLoading, setIsLoading] = useRecoilState(isMessageLoading);
    const [mode, setMode] = useRecoilState(currentMode);
    const url = useRecoilValue(imageUrl);
    const [crop, setCrop] = useState<Crop>(initialCrop);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);
    const blobUrlRef = useRef('');

    const getFormattedImage = useCallback(async (): Promise<FormattedImg | null> => {
        const image = imgRef.current;
        if (image && completedCrop) {
            // This will size relative to the uploaded image
            // size. If you want to size according to what they
            // are looking at on screen, remove scaleX + scaleY
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const offscreen = new OffscreenCanvas(completedCrop.width, completedCrop.height);
            const ctx = offscreen.getContext('2d');
            if (!ctx) {
                throw new Error('No 2d context');
            }
            // TODO: страдает качество изображения. Возможно переделать с канвасом как в примере
            if ('drawImage' in ctx) {
                ctx.drawImage(
                    image,
                    completedCrop.x * scaleX,
                    completedCrop.y * scaleY,
                    completedCrop.width * scaleX,
                    completedCrop.height * scaleY,
                    0,
                    0,
                    completedCrop.width,
                    completedCrop.height,
                );
            }
            // @ts-ignore
            const blob = await offscreen.convertToBlob({
                type: 'image/png',
            });

            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
            blobUrlRef.current = URL.createObjectURL(blob);

            const formattedImg = {
                image: blob,
                link: blobUrlRef.current,
            };
            return formattedImg;
        }
        return null;
    }, [completedCrop]);

    const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const { width, height, y, x } = e.currentTarget;
        const isDefaultCropInPercents = initialCrop.unit === '%';

        if (isDefaultCropInPercents) {
            const cropInPixels: PixelCrop = {
                unit: 'px',
                x: (initialCrop.x / 100) * width,
                y: (initialCrop.y / 100) * height,
                width: (initialCrop.width / 100) * width,
                height: (initialCrop.height / 100) * height,
            };
            setCompletedCrop(cropInPixels);
            setCrop(cropInPixels);
            return;
        }
        setCompletedCrop(initialCrop as PixelCrop);
    };

    const handleSolve = () => {
        getFormattedImage()
            .then((response) => {
                if (response) {
                    const { image, link } = response;
                    setCroppedImg(image);
                    setCroppedImgUrl(link);
                    const newMessages = [
                        ...messages,
                        { id: nanoid(), imageLink: link, isUser: true },
                    ];
                    setMessages(newMessages);
                    requestDataByImage({
                        setIsLoading,
                        file: image,
                        setMessages,
                        messages: newMessages,
                    });
                    setMode(Modes.Chat);
                }
            })
            .catch((e) => console.log(e));
    };

    return (
        <div className={'crop-screen-container'}>
            <div className={'crop-wrapper'}>
                <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    keepSelection
                >
                    <img
                        src={url}
                        ref={imgRef}
                        alt=""
                        className={'crop-img'}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            </div>
            <div className={'crop-screen-footer'}>
                <button onClick={handleSolve}>Решить</button>
            </div>
        </div>
    );
};

export default CropScreen;
