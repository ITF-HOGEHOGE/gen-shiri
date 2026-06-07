import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { genRequestLen, PlayerData, PlayerRef, RequestLen, TurnData } from ".";
import { Lifeline } from "../settings";
import "./Player.css"

const Player = forwardRef((props: {
    playerData: PlayerData,
    setModeResult: () => void,
}, ref: React.ForwardedRef<PlayerRef>) => {
    // 残り時間
    const [time, setTime] = useState<number>(props.playerData.time);
    // 残り時間を取得
    const getTime = () => {
        return time;
    };
    // 時間を減らす定期実行のid
    const intervalId = useRef<number | null>(null);

    // 残りのライフライン
    const lifeLine = useRef<Lifeline>({...props.playerData.lifeline});

    // ターンを始める
    const startTurn = (): TurnData => {
        if (intervalId.current === null) {
            intervalId.current = setInterval(() => {
                setTime((pre) => pre - 1);
            }, 1000);
        }
        const card = getRandomLength();
        addDrawnLengthArray(card);
        return {
            requestLen: genRequestLen(card, addLength, props.playerData.wordLength.max),
            lifeline: lifeLine.current
        };
    };
    // ターンを再開
    const resumeTurn = () => {
        if (intervalId.current === null) {
            intervalId.current = setInterval(() => {
                setTime((pre) => pre - 1);
            }, 1000);
        }
    };
    // ターンを終わる
    const endTurn = (addLength?: number) => {
        if (intervalId.current !== null) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
        if (addLength !== undefined) {
            setAddLength(addLength);
        }
    };
    // ターンを一時停止する
    const pauseTurn = () => {
        if (intervalId.current !== null) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
    };

    // 次の言葉の長さをランダムに決定
    function getRandomLength() {
        const { min, max } = props.playerData.wordLength;
        return Math.floor(Math.random() * (max - min + 1)) + min + addLength;
    }

    // 引いた数字
    const [drawnLengthArray, setDrawnLengthArray] = useState<number[]>([]);
    const addDrawnLengthArray = (value: number) => {
        setDrawnLengthArray((pre) => {
            const newArray = [...pre];
            newArray.push(value);
            return newArray;
        });
    };

    // 文字数減らしで増える文字数
    const [addLength, setAddLength] = useState<number>(0);
    
    // 親でこれらの関数を使えるように
    useImperativeHandle(ref, () => ({startTurn, endTurn, resumeTurn, pauseTurn, getTime}));

    // 残り時間が0なら結果画面へ
    useEffect(() => {
        if (time === 0) {
            endTurn(0);
            props.setModeResult();
        }
    }, [time]);

    return (
        <div className={"player-player" + (intervalId.current === null ? "" : " player-turn-player")}>
            <p className="player-player-name">プレイヤー{props.playerData.id}</p>
            <div className="player-timer-container">
                残り<div className="player-timer">{time}</div>秒
            </div>
            <div className="player-card-container">
                <div className="player-card-dummy"></div>
                {
                    drawnLengthArray.map((v, i) => (
                        <div className="player-card" style={{left: -10 * i}} key={i}>
                            {v}
                        </div>
                    ))
                }
            </div>
        </div>
    )
});

export default Player;