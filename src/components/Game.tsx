import { useEffect, useRef, useState } from "react";
import { PlayerRef } from "./index";
import Player from "./Player";
import Input from "./Input";

function Game(props: {
    times: number[],
    wordLength:[number,number],
    setModeStart: () => void,
    setModeResult: () => void,
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
    const playerRefs = [useRef<PlayerRef | null>(null), useRef<PlayerRef | null>(null)];
    const genPlayerData = (index: number) => ({
        id: index + 1,
        time: props.times[index]
    });

    useEffect(() => {
        playerRefs[0].current?.startTurn();
    }, []);

    return(
        <div>
            <div>
                <Player 
                    playerData={genPlayerData(0)}
                    ref={playerRefs[0]}
                />
                <Player 
                    playerData={genPlayerData(1)}
                    ref={playerRefs[1]}
                />
            </div>
            <p>プレイヤー{turn.current + 1}の番です。</p>
            <Input passTurn={passTurn} wordLength={props.wordLength}/>
            <button type="button" onClick={props.setModeStart}>中断する</button>
        </div>
    )
}

export default Game;