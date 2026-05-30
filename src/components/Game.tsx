import { useRef } from "react";
import Player from "./Player";

function Game() {
    const passTurn = () => {
        endTurnArray.current[turn.current]();
        turn.current = 1 - turn.current;
        startTurnArray.current[turn.current]();
    };
    const turn = useRef<number>(0);
    const startTurnArray = useRef<(() => void | null)[]>([() => {}, () => {}]);
    const endTurnArray = useRef<(() => void | null)[]>([() => {}, () => {}]);

    return(
        <>
            <Player 
                playerNumber={1}
                setStartTurn={(startTurn: () => void) => startTurnArray.current[0] = startTurn}
                setEndTurn={(endTurn: () => void) => endTurnArray.current[0] = endTurn}
            ></Player>
            <Player 
                playerNumber={2}
                setStartTurn={(startTurn: () => void) => startTurnArray.current[1] = startTurn}
                setEndTurn={(endTurn: () => void) => endTurnArray.current[1] = endTurn}
            ></Player>
            <button onClick={passTurn}>Pass</button>
        </>
    )
}

export default Game;