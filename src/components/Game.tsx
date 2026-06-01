import { useEffect, useRef ,useState } from "react";
import { PlayerRef } from "./index";
import { SetModeWrapper } from "..";
import Player from "./Player";
import Input from "./Input";
import "./Game.css";

function Game (props: {
    times: [number, number],
    wordLength: [number, number],
    setModeWrapper: SetModeWrapper
}) {
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
    const [isPaused, setIsPaused] = useState(false);
    // 次のターンに進む
    const passTurn = () => {
        playerRefs[turn.current].current?.endTurn();
        switchTurn();
        playerRefs[turn.current].current?.startTurn();
    };
    // 今のターンを{0, 1}で保持
    const turn = useRef<number>(0);
    // turnを切り替える
    const switchTurn = () => {
        turn.current = 1 - turn.current;
    };
    // Playerの関数管理
    const playerRefs = [
        useRef<PlayerRef | null>(null), 
        useRef<PlayerRef | null>(null)
    ];
    // indexからPlayerのpropsに渡すデータを生成
    const genPlayerData = (index: number) => ({
        id: index + 1,
        time: props.times[index]
    });
    // 結果画面に遷移
    const setModeResult = () => {
        props.setModeWrapper("result", [playerRefs[0].current!.getTime(), playerRefs[1].current!.getTime()]);
    };
    // ゲームを一時停止
    const pauseGame = () => {
        playerRefs[turn.current].current?.endTurn();
        setIsPaused(true);
    }
    // ゲームを再開
    const resumeGame = () => {
        playerRefs[turn.current].current?.startTurn();
        setIsPaused(false);
    }

    // 初回レンダリング時にターン開始
    useEffect(() => {
        playerRefs[0].current?.startTurn();
    }, []);

    return(
        <div>
            <div className="game-player-container">
                <Player 
                    playerData={genPlayerData(0)}
                    setModeResult={setModeResult}
                    ref={playerRefs[0]}
                />
                <div className="game-empty" />
                <Player
                    playerData={genPlayerData(1)}
                    setModeResult={setModeResult}
                    ref={playerRefs[1]}
                />
            </div>
            <p>プレイヤー{turn.current + 1}の番です。</p>
            <Input 
                passTurn={passTurn} 
                wordLength={props.wordLength}
                usedWords={usedWords}
                setUsedWords={setUsedWords}
            />
            <button
                onClick = {() => {
                    if (isPaused) {
                        resumeGame();
                    }else{
                        pauseGame();
                    }
                }}
            >
                {isPaused ? '再開' : '一時停止'}
            </button>
            <button type="button" onClick={() => props.setModeWrapper("start")}>ゲームをやめる</button>
        </div>
    )
};

export default Game;