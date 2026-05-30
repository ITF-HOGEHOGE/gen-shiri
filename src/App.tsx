import { useRef, useState } from 'react';
import { Mode } from '.';
import Game from "./components/Game"

function App() {
    const [mode, setMode] = useState<Mode>("start");

    return (
        <div>
            <h1>限界しりとり</h1>
            {
                mode == "start" 
                ?   (<div>
                        <button onClick={() => setMode("setting")}>ゲームを始める</button>
                    </div>)
                :   mode == "setting"
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
                :   <Game times={[0, 0]} setModeStart={() => setMode("start")}></Game>
            }
        </div>
    );
}

export default App;