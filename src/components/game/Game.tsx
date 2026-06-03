import { useEffect, useRef ,useState } from "react";
import { PlayerRef } from "../index";
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
    // 次のターンに進む
    const passTurn = () => {
        playerRefs[turn].current?.endTurn();
        playerRefs[1 - turn].current?.startTurn();
        switchTurn();
    };

    // indexからPlayerのpropsに渡すデータを生成
    const genPlayerData = (index: number) => ({
        id: index + 1,
        time: props.settings[index].time
    });
    // Playerの関数管理
    const playerRefs = [
        useRef<PlayerRef | null>(null), 
        useRef<PlayerRef | null>(null)
    ];

    // 一時中断の最中かどうか
    const [isPaused, setIsPaused] = useState(false);
    // ゲームを一時停止
    const pauseGame = () => {
        playerRefs[turn].current?.endTurn();
        setIsPaused(true);
    };
    // ゲームを再開
    const resumeGame = () => {
        playerRefs[turn].current?.startTurn();
        setIsPaused(false);
    };
    const switchPaused = () => {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    };

    //ライフラインをこのターンで使用中か
    const [useNmawashi, setUseNmawashi] = useState(false);
    const [useLengthDown, setUseLengthDown] = useState(false);

    //文字数減らしで増える文字数
    const [addLength, setAddLength] = useState([0, 0]);

    // 次の言葉の長さをランダムに決定
    function getRandomLength(turn: number) {
        const { min, max } = props.settings[turn].wordLength;
        return Math.floor(Math.random() * (max - min + 1)) + min + addLength[turn];
    }
    // 要求する文字列の長さ
    const [requestLen, setRequestLen] = useState<number>(getRandomLength(0));

    // 引いた数字の一覧
    const [drawnLengthArray, setDrawnLengthArray] = useState<[number[], number[]]>([[requestLen],[]]);
    
    // 結果画面に遷移
    const setModeResult = () => {
        props.setModeWrapper("result", { times: [playerRefs[0].current!.getTime(), playerRefs[1].current!.getTime()] });
    };

    const [startCount, setStartCount] = useState<number>(4);
    const countIntervalId = useRef<number | null>(null);

    useEffect(() => {
        if (countIntervalId.current === null) {
            countIntervalId.current = setInterval(() => {
                setStartCount((pre) => pre - 1);
            }, 1000);
        }
    }, []);

    // 初回レンダリング時にターン開始
    useEffect(() => {
        if (startCount === -1 && countIntervalId.current !== null) {
            playerRefs[0].current?.startTurn();
            clearInterval(countIntervalId.current);
            countIntervalId.current = null;
        }
    }, [startCount]);

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
                <Player 
                    playerData={genPlayerData(0)}
                    setModeResult={setModeResult}
                    ref={playerRefs[0]}
                    numList={drawnLengthArray}
                />
                <div className="game-empty" />
                <Player
                    playerData={genPlayerData(1)}
                    setModeResult={setModeResult}
                    ref={playerRefs[1]}
                    numList={drawnLengthArray}
                />
            </div>
            <p>プレイヤー{turn + 1}の番です。</p>
            <div>
                使えるライフライン
                {
                    props.settings[turn].lifeline.pass 
                    ?   <button onClick={() => {
                            props.settings[turn].lifeline.pass = false;
                            // 引いた数のリストを更新
                            const card = getRandomLength(1 - turn) - addLength[1 - turn];
                            setRequestLen(card + addLength[1 - turn]);
                            setDrawnLengthArray((pre) => {
                                const newList: [number[], number[]] = [[...pre[0]], [...pre[1]]] ;
                                newList[1 - turn].push(card);
                                return newList
                            });
                            // 文字数減らしで次に追加する文字数を更新
                            setAddLength((prev) => {
                                const next = [...prev];
                                next[turn] = 0
                                return next;
                            });
                            passTurn();
                        }
                        }>パス</button>
                    :   <></>
                }
                {
                    props.settings[turn].lifeline.nmawashi 
                    ?   <label>
                            <input
                                type='checkbox'
                                checked={useNmawashi}
                                onChange={(e) => setUseNmawashi(e.target.checked)}
                            />
                            ん回し
                        </label>
                    :   <></>
                }
                {
                    props.settings[turn].lifeline.lengthDown
                    ?   <label>
                            <input
                                type='checkbox'
                                checked={useLengthDown}
                                onChange={(e) => setUseLengthDown(e.target.checked)}
                            />
                            文字数減らし
                        </label>
                    :   <></>
                }
            </div>
            <Input 
                turn={turn}
                passTurn={passTurn}
                requestLen={requestLen}
                setRequestLen={setRequestLen}
                getRandomLength={getRandomLength}
                lifeline={props.settings[turn].lifeline}
                useLengthDown={useLengthDown} 
                setUseLengthDown={setUseLengthDown}
                useNmawashi={useNmawashi}
                setUseNmawashi={setUseNmawashi}
                wordLength={[props.settings[0].wordLength, props.settings[1].wordLength]}
                addLength={addLength}
                setAddLength={setAddLength}
                drawnLengthArray={drawnLengthArray}
                setDrawnLengthArray={setDrawnLengthArray}
            />
            <button onClick={switchPaused}>
                {isPaused ? '再開' : '一時停止'}
            </button>
            {}
            <button type="button" onClick={() => props.setModeWrapper("start")}>ゲームをやめる</button>
        </div>
    )
};

export default Game;