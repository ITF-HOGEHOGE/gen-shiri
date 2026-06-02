import { useState } from 'react';
import { Mode, SetModeWrapper } from '.';
import Game from "./components/Game"
import Setting from "./components/settings/Setting"
import { defaultSettingValues, SettingValues } from './components/settings';

function App() {
    // アプリがどの状態にあるかを保持
    const [mode, setMode] = useState<Mode>({mode: "start"});

    // modeを更新する関数
    // オーバーロードされており、引数のパターンを３つ持つ
    const setModeWrapper: SetModeWrapper = (modeName, options?: {times?: [number, number], settings?: [SettingValues, SettingValues]}) => {
        if (modeName === "result") {
            setMode({
                mode: "result",
                times: options?.times ?? [0, 0]
            });
        } else if (modeName === "game") {
            setMode({
                mode: "game",
                settings: options?.settings ?? [{...defaultSettingValues}, {...defaultSettingValues}]
            })
        } else {
            setMode({
                mode: modeName
            });
        }
    };

    return (
        <div className='app'>
            <h1>限界しりとり</h1>
            {
                mode.mode === "start" 
                ?   <div>
                        <button onClick={() => setModeWrapper("setting")}>ゲームを始める</button>
                    </div>
                :   mode.mode === "setting"
                ?   <Setting setModeWrapper={setModeWrapper} />
                :   mode.mode === "result"
                ?   <div className='result-card'>
                        <h2>時間切れ・・・</h2>
                        <p className='winner'>結果プレイヤー{mode.times[1] === 0 ? '1' : '2'}の勝ち!</p>
                        <p className='time'>プレイヤー1の残り時間:{mode.times[0]}</p>
                        <p className='time'>プレイヤー2の残り時間:{mode.times[1]}</p>
                        <button onClick={() => setModeWrapper("start")}>タイトルに戻る</button>
                    </div>
                :   mode.mode === "game"
                ?   <Game 
                        settings={mode.settings} 
                        setModeWrapper={setModeWrapper}
                    />
                :   <></>
            }
        </div>
    );
}

export default App;