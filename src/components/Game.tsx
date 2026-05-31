import { useEffect, useRef, useState } from "react";
import Player from "./Player";
import { PlayerRef } from "./index"

function Game(props: {
    times: number[],
    setModeStart: () => void
}) {
    const [requestLen, setRequestLen] = useState<number>(5);
    const [requestHead, setRequestHead] = useState<string>("り");
    const [inputText, setInputText] = useState<string>("");
    const [inputHiraganaText, setInputInraganaText] = useState<string>("");
    const checkInput = (input: string) => {
        if (input.length !== requestLen) {
            alert(`${requestLen}文字の言葉を入力してください。`);
            return;
        }
        if (input[0] !== requestHead) {
            alert(`${requestHead}から始まる言葉を入力してください。`);
            return;
        }
        setRequestHead(input[input.length - 1]);
        setInputText("");
        passTurn();
    };
    const passTurn = () => {
        playerRefs[turn.current].current?.endTurn();
        switchTurn();
        playerRefs[turn.current].current?.startTurn();
    };
    const turn = useRef<number>(0);
    const switchTurn = () => {
        turn.current = 1 - turn.current;
    };
    const playerRefs = [useRef<PlayerRef | null>(null), useRef<PlayerRef | null>(null)];
    const genPlayerData = (index: number) => ({
        id: index + 1,
        time: props.times[index]
    });
    const regex = /^\p{scx=Hiragana}+$/u;

    useEffect(() => {
        playerRefs[0].current?.startTurn();
    }, []);

    return(
        <div>
            <div>
                <Player 
                    playerData={genPlayerData(0)}
                    ref={playerRefs[0]}
                ></Player>
                <Player 
                    playerData={genPlayerData(1)}
                    ref={playerRefs[1]}
                ></Player>
            </div>
            <p>プレイヤー{turn.current + 1}の番です。</p>
            <p>文字数: {requestLen}</p>
            <p>最初の文字: {requestHead}</p>
            <div>
                <input
                    type='text'
                    placeholder="回答してください"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)} 
                    onCompositionUpdate={(e) => {
                        if (regex.test(e.data)) {
                            setInputInraganaText(e.data);
                        }
                    }}
                >
                </input>
                <p><br/><br/><br/><br/>{inputHiraganaText}</p>
                <button type="button" onClick={() => checkInput(inputText)}>回答</button>
            </div>
            <button type="button" onClick={props.setModeStart}>中断する</button>
        </div>
    )
}

export default Game;