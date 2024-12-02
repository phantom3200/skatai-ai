import { blobToBase64 } from './app.utils';
import { Message, RequestDataByImageProps } from './app.types';
import { nanoid } from 'nanoid';

// TODO: добавить русский язык
export const requestDataByImage = async ({
    file,
    setMessages,
    messages,
    setIsLoading,
}: RequestDataByImageProps) => {
    const base64 = await blobToBase64(file);

    setIsLoading(true);
    await fetch('https://generate-koowrwpr4a-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            authentication: {
                checksum: 'b6c9367b2ae5f0642b9404d1caad399bee8f6ec3',
            },
            payload: {
                image: {
                    mimeType: 'image/png',
                    base64,
                },
                prompt: 'Реши все примеры в файле',
            },
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            const newMessage: Message = {
                id: nanoid(),
                text: data.data.text,
            };
            setMessages([...messages, newMessage]);
        })
        .catch((e) => console.log(e))
        .finally(() => setIsLoading(false));
};
