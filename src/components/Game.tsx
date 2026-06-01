import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { PlayerRef } from "./index";
import Player from "./Player";
import Input from "./Input";
import { Mode } from "..";

function Game (props: {
    times: [number, number],
    wordLength:[number, number],
    setMode: (mode: Mode) => void
}) {
    const passTurn = () => {
        playerRefs[turn.current].current?.endTurn();
        switchTurn();
        playerRefs[turn.current].current?.startTurn();
    };
    const turn = useRef<number>(0);
    const switchTurn = () => {
        turn.current = 1 - turn.current;
    };
    const playerRefs = [
        useRef<PlayerRef | null>(null), 
        useRef<PlayerRef | null>(null)
    ];
    const genPlayerData = (index: number) => ({
        id: index + 1,
        time: props.times[index]
    });
    const getTime = (id: number): number => {
        return playerRefs[id - 1].current!.getTime();
    };
    const setModeResult = () => {
        props.setMode({
            mode: "result",
            times: [getTime(1), getTime(2)]
        })
    }

    useEffect(() => {
        playerRefs[0].current?.startTurn();
    }, []);

    return(
        <div>
            <div>
                <Player 
                    playerData={genPlayerData(0)}
                    setModeResult={setModeResult}
                    ref={playerRefs[0]}
                />
                <Player
                    playerData={genPlayerData(1)}
                    setModeResult={setModeResult}
                    ref={playerRefs[1]}
                />
            </div>
            <p>プレイヤー{turn.current + 1}の番です。</p>
            <Input passTurn={passTurn} wordLength={props.wordLength}/>
            <button type="button" onClick={() => props.setMode({mode: "start"})}>中断する</button>
        </div>
    )
};

export default Game;