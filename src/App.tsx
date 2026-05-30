import { useState } from 'react';
import { Mode } from '.';

function App() {
    const [mode, setMode] = useState<Mode>("start")


    return (
        <div className='app'>
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
                :   (<div>          
                        <div className="timer-area">
                            <div className="timer">
                                プレイヤー1<br />
                                5:00
                            </div>

                            <div className="timer">
                                プレイヤー2<br />
                                5:00
                            </div>
                        </div>
                        <p className='turn'>プレイヤー1の番です。</p>
                        <div className='answer-area'>
                            <input
                            type='text'
                            placeholder="回答してください"
                            >
                            </input>
                            <button>回答</button>
                        </div>
                        <button className='stop-btn' onClick={() => setMode("start")}>中断する</button>
                    </div>)
            }
        </div>
    );
}

export default App;