import { atom, selector } from 'recoil';
import { Modes } from './app.const';
import { Message } from './app.types';

export const image = atom<File | null>({
    key: 'image',
    default: null,
});

export const imageUrl = selector<string>({
    key: 'imageUrl',
    get: ({ get }) => {
        const img = get(image);
        return img ? URL.createObjectURL(img) : '';
    },
});

export const currentMode = atom<Modes>({
    key: 'currentMode',
    default: Modes.StartScreen,
});

export const croppedImage = atom<Blob | null>({
    key: 'croppedImage',
    default: null,
});

export const croppedImageUrl = atom<string>({
    key: 'croppedImageUrl',
    default: '',
});

export const chatMessages = atom<Message[]>({
    key: 'chatMessages',
    default: [],
});

export const isMessageLoading = atom<boolean>({
    key: 'isMessageLoading',
    default: false,
});
