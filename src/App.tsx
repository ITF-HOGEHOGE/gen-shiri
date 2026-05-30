import { useState } from 'react';
import { Mode } from './app';

function App() {
    const [mode, setMode] = useState<Mode>("start")


    return (
        <div>
            <h1>限界しりとり</h1>
            {
                mode == "start" 
                ?   (<div>
                        <button onClick={() => setMode("setting")}>ゲームを始める</button>
                    </div>)
                : mode == "setting"
                ?   (<div>
                        <p>ルールを決めてください。</p>
                        <input
                            type='number'
                            placeholder='プレイヤー1の持ち時間'
                        >
                        </input>
                        <input
                            type='number'
                            placeholder='プレイヤー2の持ち時間'
                        >
                        </input>
                        <button
                            onClick={() => {
                                setMode("game");
                            }}
                        >スタート</button>
                    </div>)
                :   (<div>
                        <div>
                            <div>プレイヤー1 残り時間 5:00</div>
                            <div>プレイヤー2 残り時間 5:00</div>
                        </div>
                        <p>プレイヤー1の番です。</p>
                        <div>
                            <input
                            type='text'
                            placeholder="回答してください"
                            >
                            </input>
                            <button>回答</button>
                        </div>
                        <button onClick={() => setMode("start")}>中断する</button>
                    </div>)
            }
        </div>
    );
}

export default App;