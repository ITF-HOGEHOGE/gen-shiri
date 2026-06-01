import { useEffect, useRef ,useState } from "react";
import { PlayerRef } from "./index";
import { SetModeWrapper } from "..";
import Player from "./Player";
import Input from "./Input";
import "./Game.css";
import { SettingValues } from "./settings";

function Game (props: {
    settings: [SettingValues, SettingValues]
    setModeWrapper: SetModeWrapper
}) {
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
    const [isPaused, setIsPaused] = useState(false);
    // 次のターンに進む
    const passTurn = () => {
        playerRefs[turn].current?.endTurn();
        playerRefs[1 - turn].current?.startTurn();
        switchTurn();
    };
    // 今のターンを{0, 1}で保持
    const [turn, setTurn] = useState<number>(0);
    // turnを切り替える
    const switchTurn = () => {
        setTurn((pre) => 1 - pre);
    };
    // Playerの関数管理
    const playerRefs = [
        useRef<PlayerRef | null>(null), 
        useRef<PlayerRef | null>(null)
    ];
    // indexからPlayerのpropsに渡すデータを生成
    const genPlayerData = (index: number) => ({
        id: index + 1,
        time: props.settings[index].time
    });
    // 結果画面に遷移
    const setModeResult = () => {
        props.setModeWrapper("result", { times: [playerRefs[0].current!.getTime(), playerRefs[1].current!.getTime()] });
    };
    // ゲームを一時停止
    const pauseGame = () => {
        playerRefs[turn].current?.endTurn();
        setIsPaused(true);
    }
    // ゲームを再開
    const resumeGame = () => {
        playerRefs[turn].current?.startTurn();
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
            <p>プレイヤー{turn + 1}の番です。</p>
            <Input 
                passTurn={passTurn} 
                wordLength={[props.settings[0].wordLength, props.settings[1].wordLength]}
                usedWords={usedWords}
                setUsedWords={setUsedWords}
                turn={turn}
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