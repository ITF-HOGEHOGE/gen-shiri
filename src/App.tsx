import { useRef, useState } from 'react';
import { Mode } from '.';
import Game from "./components/Game"

function App() {
    const [mode, setMode] = useState<Mode>("start");

    const [answer,setAnswer] = useState('');

    const [inputTime1,setInputTime1] = useState('');
    const [inputTime2,setInputTime2] = useState('');
    

    async function checkWord(word: string) {
        const url = `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(word)}&limit=1&namespace=0&format=json&origin=*`;

        const res = await fetch(url);
        const data = await res.json();

        return data[1].length > 0;
    }

    async function judgeWord(){
        const exists = await checkWord(answer);

        if (exists) {
            alert('有効な単語です')
        }else{
            alert('その単語は見つかりません')
        }
    }

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
                            value={inputTime1}
                            onChange={(e) => setInputTime1(e.target.value)}
                        >
                        </input>
                        <input
                            type='number'
                            placeholder='プレイヤー2の持ち時間'
                            value={inputTime2}
                            onChange={(e) => setInputTime2(e.target.value)}
                        >
                        </input>
                        <button
                            onClick={() => {
                                setMode("game");
                            }}
                        >スタート</button>
                    </div>)
                :   <Game times={[Number(inputTime1), Number(inputTime2)]} setModeStart={() => setMode("start")}></Game>
            }
        </div>
    );
}

export default App;