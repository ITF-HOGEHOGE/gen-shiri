import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { PlayerData } from ".";

const Player = forwardRef((props: {
    playerData: PlayerData
}, ref) =>  {
    const [time, setTime] = useState<number>(props.playerData.time);
    const intervalId = useRef<number | null>(null);
    const startTurn = () => {
        if (intervalId.current === null) {
            intervalId.current = setInterval(() => {
                setTime((pre) => pre - 1);
            }, 1000);
        }
    };
    const endTurn = () => {
        if (intervalId.current !== null) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
    };
    
    useImperativeHandle(ref, () => ({startTurn, endTurn}));

    return (
        <div>プレイヤー{props.playerData.id} 残り{time}秒</div>
    )
});

export default Player;