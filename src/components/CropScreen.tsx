import { CSSProperties, FC, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
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
import * as Sentry from '@sentry/react';
import { canvasToBlob, getCropImgMaxHeight } from '../app.utils';

const CropScreen: FC = () => {
    const [croppedImg, setCroppedImg] = useRecoilState(croppedImage);
    const [croppedImgUrl, setCroppedImgUrl] = useRecoilState(croppedImageUrl);
    const [messages, setMessages] = useRecoilState(chatMessages);
    const [isLoading, setIsLoading] = useRecoilState(isMessageLoading);
    const [mode, setMode] = useRecoilState(currentMode);
    const url = useRecoilValue(imageUrl);
    const [crop, setCrop] = useState<Crop>(initialCrop);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [cropImgStyles, setCropImgStyles] = useState<CSSProperties>();
    const imgRef = useRef<HTMLImageElement>(null);
    const blobUrlRef = useRef('');
    const cropWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cropWrapperRef && cropWrapperRef.current) {
            const maxHeight = getCropImgMaxHeight(cropWrapperRef.current);
            setCropImgStyles({ maxHeight });
        }
    }, []);

    const getFormattedImage = useCallback(async (): Promise<FormattedImg | null> => {
        const image = imgRef.current;
        if (image && completedCrop) {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const canvas = document.createElement('canvas');
            const devicePixelRatio = window.devicePixelRatio || 1;
            canvas.width = completedCrop.width * devicePixelRatio;
            canvas.height = completedCrop.height * devicePixelRatio;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('No 2d context');
            }

            ctx.scale(devicePixelRatio, devicePixelRatio);

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

            const blob = await canvasToBlob(canvas);

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
            .catch((e) => {
                Sentry.captureException(e);
                console.log(e);
            });
    };

    return (
        <div className={'crop-screen-container'}>
            <div className={'crop-wrapper'} ref={cropWrapperRef}>
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
                        style={cropImgStyles}
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
