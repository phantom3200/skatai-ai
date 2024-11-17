import { ChangeEvent, FC, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { chatMessages, currentMode, image, isMessageLoading } from '../app.atoms';
import TypingDots from './TypingDots';
import { ScanIcon } from '../icons';
import { Modes } from '../app.const';

const Chat: FC = () => {
    const [messages, setMessages] = useRecoilState(chatMessages);
    const [isLoading, setIsLoading] = useRecoilState(isMessageLoading);
    const [file, setFile] = useRecoilState(image);
    const [mode, setMode] = useRecoilState(currentMode);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isLoading) {
            scrollToBottom();
        }
    }, [isLoading]);

    const handleSetFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setMode(Modes.CropScreen);
        }
    };

    return (
        <div className={'chat-container'}>
            <div className={'messages'}>
                {messages.map(({ isUser, imageLink, text, id }) => {
                    const messageClassName = isUser ? 'message-item user' : 'message-item response';
                    return (
                        <div className={messageClassName} key={id}>
                            {imageLink && (
                                <img src={imageLink} className={'message-item--image'} alt="" />
                            )}
                            {text && <div className={'message-item--text'}>{text}</div>}
                        </div>
                    );
                })}
                {isLoading && (
                    <div className={'message-item response'}>
                        <TypingDots />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className={'chat-footer'}>
                <input
                    type="file"
                    accept="image/*"
                    id={'image-input'}
                    onChange={handleSetFile}
                    hidden
                />
                <label htmlFor="image-input">
                    <div className={'icon-button'}>
                        <ScanIcon />
                        <div>Решить следующий</div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Chat;
