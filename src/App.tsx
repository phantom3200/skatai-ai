import './App.scss';
import { useRecoilValue } from 'recoil';
import { currentMode } from './app.atoms';
import { Modes } from './app.const';
import { CropScreen, StartScreen, Chat } from './components';

function App() {
    const mode = useRecoilValue(currentMode);
    const isStartScreen = mode === Modes.StartScreen;
    const isCropScreen = mode === Modes.CropScreen;
    const isChatScreen = mode === Modes.Chat;

    return (
        <div className={'container'}>
            {isStartScreen && <StartScreen />}
            {isCropScreen && <CropScreen />}
            {isChatScreen && <Chat />}
        </div>
    );
}

export default App;
