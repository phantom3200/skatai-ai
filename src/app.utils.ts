export const blobToDataUrl = (blob: Blob): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

export const blobToBase64 = (blob: Blob) =>
    blobToDataUrl(blob).then((text) => {
        if (typeof text === 'string') {
            const typeSeparator = text.indexOf(',') + 1;
            return text.slice(typeSeparator);
        }
        return null;
    });
