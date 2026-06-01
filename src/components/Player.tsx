import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PlayerData } from ".";
import "./Player.css"

const Player = forwardRef((props: {
    playerData: PlayerData,
    setModeResult: () => void
}, ref) => {
    // 残り時間
    const [time, setTime] = useState<number>(props.playerData.time);
    // 時間を減らす定期実行のid
    const intervalId = useRef<number | null>(null);
    // このプレイヤーのターンを始める
    const startTurn = () => {
        if (intervalId.current === null) {
            intervalId.current = setInterval(() => {
                setTime((pre) => pre - 1);
            }, 1000);
        }
    };
    // このプレイヤーのターンを終わる
    const endTurn = () => {
        if (intervalId.current !== null) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
    };
    // 残り時間を取得
    const getTime = () => {
        return time;
    };
    
    // 親でこれらの関数を使えるように
    useImperativeHandle(ref, () => ({startTurn, endTurn, getTime}));
    // 残り時間が0なら結果画面へ
    useEffect(() => {
        if (time === 0) {
            endTurn();
            props.setModeResult();
        }
    }, [time]);

    return (
        <div className={"player-player" + (intervalId.current === null ? "" : " player-turn-player")}>
            <p className="player-player-name">プレイヤー{props.playerData.id}</p>
            <div className="player-timer-container">
                残り<div className="player-timer">{time}</div>秒
            </div>
        </div>
    )
});

export default Player;