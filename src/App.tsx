import { useState } from 'react';
import { Mode, SetModeWrapper } from '.';
import Game from "./components/Game"
import Setting from "./components/Setting"

function App() {
    // アプリがどの状態にあるかを保持
    const [mode, setMode] = useState<Mode>({mode: "start"});

    // modeを更新する関数
    // オーバーロードされており、引数のパターンを３つ持つ
    const setModeWrapper: SetModeWrapper = (modeName, times?: [number, number], wordLength1?: [number, number], wordLength2?: [number, number]) => {
        if (modeName === "result") {
            setMode({
                mode: "result",
                times: times === undefined ? [0, 0] : times
            });
        } else if (modeName === "game") {
            setMode({
                mode: "game",
                times: times === undefined ? [0, 0] : times,
                wordLength1: wordLength1 ?? [2, 11] ,
                wordLength2: wordLength2 ?? [2, 11]
            })
        } else {
            setMode({
                mode: modeName
            });
        }
    };

    // const [answer, setAnswer] = useState('');

    
    // async function checkWord(word: string) {
    //     // wikipediaの存在を判定する
    //     const url: string = `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(word)}&limit=1&namespace=0&format=json&origin=*`;
    //     const res = await fetch(url);
    //     const data = await res.json();

    //     return data[1].length > 0;
    // }
    // async function judgeWord(){
    //     const exists = await checkWord(answer);

    //     if (exists) {
    //         alert('有効な単語です');
    //     }else{
    //         alert('その単語は見つかりません');
    //     }
    // }

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
                        <p className='winner'>結果{mode.times[1]===0 ? 'プレイヤー1' : 'プレイヤー2'}の勝ち!</p>
                        <p className='time'>プレイヤー1の残り時間:{mode.times[0]}</p>
                        <p className='time'>プレイヤー2の残り時間:{mode.times[1]}</p>
                        <button onClick={() => setModeWrapper("start")}>タイトルに戻る</button>
                    </div>
                :   mode.mode === "game"
                ?   <Game 
                        times={mode.times} 
                        wordLength1={mode.wordLength1}
                        wordLength2={mode.wordLength2} 
                        setModeWrapper={setModeWrapper}
                    />
                :   <></>
            }
        </div>
    );
}

export default App;