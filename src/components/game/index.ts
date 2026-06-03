import { Lifeline, WordLength } from "../settings";

export type PlayerData = {
    id: number,
    time: number,
    wordLength: WordLength,
    lifeline: Lifeline
};

export type RequestLen = {
    len: number,
    addLength: number,
    more: boolean
};
export const genRequestLen = (card: number, addLength: number, moreLine: number): RequestLen => {
    const len = card + addLength;
    return {
        len,
        addLength,
        more: len >= moreLine
    }
};

export type TurnData = {
    requestLen: RequestLen,
    lifeline: Lifeline
};

export type PlayerRef = {
    startTurn: () => TurnData,
    resumeTurn: () => void,
    endTurn: (addLength?: number) => void,
    pauseTurn: () => void,
    getTime: () => number,
};

export type InputRef = {
    setTurnData: (value: TurnData) => void
};