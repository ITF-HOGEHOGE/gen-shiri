import { useRef, useState } from 'react';
import { Mode } from '.';
import Game from "./components/Game"

function App() {
    const [mode, setMode] = useState<Mode>("start");

    const [answer,setAnswer] = useState('');

    const [inputTime1,setInputTime1] = useState('');
    const [inputTime2,setInputTime2] = useState('');
    const [minWordLength,setMinWordLength] = useState('');
    const [maxWordLength,setMaxWordLength] = useState('');
    

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
                        <input
                            type='number'
                            placeholder='最小の文字数(2以上)'
                            value={minWordLength}
                            onChange={(e) => setMinWordLength(e.target.value)}
                        >
                        </input>
                        <input
                            type='number'
                            placeholder='最大の文字数(2以上)'
                            value={maxWordLength}
                            onChange={(e) => setMaxWordLength(e.target.value)}
                        >
                        </input>
                        <p>プレイヤー1とプレイヤー2を決めたら、スタートを押してください</p>
                        <button
                            onClick={() => {
                                if (!minWordLength||!maxWordLength||!inputTime1||!inputTime2){
                                    alert('項目に空欄があります');
                                    return;
                                }
                                if (Number(inputTime1)<=0||Number(inputTime2)<=0){
                                    alert('持ち時間は正の数で入力してください');
                                    return;
                                }
                                if (Number(maxWordLength)<=1||Number(minWordLength)<=1){
                                    alert('文字数は2以上で入力してください');
                                    return;
                                }
                                if (Number(minWordLength)>Number(maxWordLength)){
                                    alert('最小文字数は最大文字数以下にしてください');
                                    return;
                                }
                                setMode("game");
                            }}
                        >スタート</button>
                    </div>)
                :   mode == "result"
                ?   (<div className='result-card'>
                        <h2>時間切れ・・・</h2>
                        <p className='winner'>結果 プレイヤー1の勝ち!</p>
                        <p className='time'>プレイヤー1の残り時間:</p>
                        <p className='time'>プレイヤー2の残り時間:</p>
                        <button onClick={() => setMode("start")}>タイトルに戻る</button>
                    </div>)
                :   <Game 
                        times={[Number(inputTime1), Number(inputTime2)]} 
                        wordLength={[Number(minWordLength),Number(maxWordLength)]} 
                        setModeStart={() => setMode("start")} 
                    />
            }
        </div>
    );
}

export default App;