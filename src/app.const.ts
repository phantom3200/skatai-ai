import type { Crop } from 'react-image-crop';

export enum Modes {
    StartScreen = 'StartScreen',
    CropScreen = 'CropScreen',
    Chat = 'Chat',
}
export const initialCrop: Crop = {
    unit: '%',
    x: 0,
    y: 25,
    width: 100,
    height: 50,
};
