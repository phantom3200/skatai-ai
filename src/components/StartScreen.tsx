import { ChangeEvent, FC } from 'react';
import { useRecoilState } from 'recoil';
import { currentMode, image } from '../app.atoms';
import { PlusIcon } from '../icons';
import { Modes } from '../app.const';

const StartScreen: FC = () => {
    const [file, setFile] = useRecoilState(image);
    const [mode, setMode] = useRecoilState(currentMode);
    const handleSetFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setMode(Modes.CropScreen);
        }
    };

    return (
        <div className={'start-screen-container'}>
            <label htmlFor="image-input">
                <PlusIcon />
                <div className={'start-screen-text'}>
                    Сфотографируйте или выберете из медиатеки задачу
                </div>
            </label>
            <input
                type="file"
                accept="image/*"
                id={'image-input'}
                onChange={handleSetFile}
                hidden
            />
        </div>
    );
};

export default StartScreen;
