export type FormattedImg = {
    image: Blob;
    link: string;
};

export type Message = {
    id: string;
    text?: string;
    imageLink?: string;
    isUser?: boolean;
};

export type RequestDataByImageProps = {
    file: Blob;
    setIsLoading: (value: boolean) => void;
    setMessages: (messages: Message[]) => void;
    messages: Message[];
};
