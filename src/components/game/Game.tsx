import { useEffect, useRef ,useState } from "react";
import { InputRef, PlayerData, PlayerRef, RequestLen } from "./index";
import { SetModeWrapper } from "../..";
import Player from "./Player";
import Input from "../Input";
import "./Game.css";
import { SettingValues } from "../settings";

function Game (props: {
    settings: [SettingValues, SettingValues]
    setModeWrapper: SetModeWrapper
}) {
    // 今のターンを{0, 1}で保持
    const [turn, setTurn] = useState<number>(0);
    // turnの値を切り替える
    const switchTurn = () => {
        setTurn((pre) => 1 - pre);
    };
    const startTurn = () => {
        const turnData = playerRefs[0].current!.startTurn();
        inputRef.current?.setTurnData(turnData);
    };
    // 次のターンに進む
    const endTurn = (addLength?: number) => {
        playerRefs[turn].current?.endTurn(addLength);
        switchTurn();
    };

    // indexからPlayerのpropsに渡すデータを生成
    const genPlayerData = (index: number): PlayerData => ({
        id: index + 1,
        time: props.settings[index].time,
        wordLength: props.settings[index].wordLength,
        lifeline: props.settings[index].lifeline
    });
    // Playerの関数管理
    const playerRefs = [
        useRef<PlayerRef | null>(null), 
        useRef<PlayerRef | null>(null)
    ];

    // Inputの関数管理
    const inputRef = useRef<InputRef | null>(null);

    // 一時中断の最中かどうか
    const [isPaused, setIsPaused] = useState(false);
    // ゲームを一時停止
    const pauseGame = () => {
        playerRefs[turn].current?.pauseTurn();
        setIsPaused(true);
    };
    // ゲームを再開
    const resumeGame = () => {
        playerRefs[turn].current?.resumeTurn();
        setIsPaused(false);
    };
    // 再開/一時停止を切り替え
    const switchPaused = () => {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    };
    
    // 結果画面に遷移
    const setModeResult = () => {
        props.setModeWrapper("result", { times: [playerRefs[0].current!.getTime(), playerRefs[1].current!.getTime()] });
    };

    // 最初のカウントダウン
    const [startCount, setStartCount] = useState<number>(4);
    // 最初のカウントダウンをする定期実行
    const countIntervalId = useRef<number | null>(null);

    // 初回レンダリング時にカウントダウン開始
    useEffect(() => {
        if (countIntervalId.current === null) {
            countIntervalId.current = setInterval(() => {
                setStartCount((pre) => pre - 1);
            }, 1000);
        }
    }, []);
    // カウントダウン終了時にターン開始
    useEffect(() => {
        if (startCount === -1 && countIntervalId.current !== null) {
            clearInterval(countIntervalId.current);
            countIntervalId.current = null;
            startTurn();
        }
    }, [startCount]);

    // ターンが変わった後に次のプレイヤーのターンを開始する
    useEffect(() => {
        if (startCount === -1) {
            startTurn();
        }
    }, [turn]);

    return(
        <div className="game-container">
            {
                startCount === -1
                ?   <></>
                :   <div className="game-count">
                        <div className="game-count-inner" key={startCount}>
                            {
                                startCount === 0
                                ?   "スタート！"
                                :   `${startCount}`
                            }
                        </div>
                    </div>
            }
            <div className="game-player-container">
                {
                    [0, 1].map((v) => (
                        <Player
                            playerData={genPlayerData(v)}
                            setModeResult={setModeResult}
                            ref={playerRefs[v]}
                            key={v}
                        />
                    ))
                }
            </div>
            <p>プレイヤー{turn + 1}の番です。</p>
            <Input
                passTurn={endTurn}
                ref={inputRef}
            />
            <button onClick={switchPaused}>
                {isPaused ? '再開' : '一時停止'}
            </button>
            <button type="button" onClick={() => props.setModeWrapper("start")}>ゲームをやめる</button>
        </div>
    )
};

export default Game;