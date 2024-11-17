import { FC } from 'react';

const TypingDots: FC = () => (
    <div className={'typing-dots-container'}>
        <svg width="30" height="14" viewBox="0 0 30 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="typing-dots loadingFadeInline" cx="5" cy="7" r="3" fill="#fff"/>
            <circle className="typing-dots loadingFadeInline" cx="15" cy="7" r="3" fill="#fff"/>
            <circle className="typing-dots loadingFadeInline" cx="25" cy="7" r="3" fill="#fff"/>
        </svg>
    </div>
);

export default TypingDots;
