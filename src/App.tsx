import {useState} from 'react';

function App() {
    const [started,setStarted] = useState(false)

    const [isRule,setIsRule] = useState(false)


    return (
        <div>
            <h1>限界しりとり</h1>
            {!started ? (
                <div>
                    {!isRule ? (
                        <div>
                            <button onClick={() => setIsRule(!isRule)}>ゲームを始める</button>
                        </div>
                        ):(
                        <div>
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
                                    setIsRule(!isRule);
                                    setStarted(!started);
                                }}
                                >スタート</button>
                        </div>
                    )}
                </div>    
                ):(
                <div>
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
                    <button onClick={() => setStarted(!started)}>中断する</button>
                </div>
            )}
        </div>
    );
}

export default App;