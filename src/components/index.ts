export type PlayerData = {
    id: number,
    time: number
};

export type PlayerRef = {
    startTurn: () => void,
    endTurn: () => void,
    getTime: () => number
};