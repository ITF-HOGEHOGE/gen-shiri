export type Mode = {
    mode: "start" | "setting"
} | {
    mode: "game",
    times: [number, number],
    wordLength1: [number, number]
    wordLength2: [number, number]
} | {
    mode: "result",
    times: [number, number]
};

export type SetModeWrapper = {
    (modeName: "game", times: [number, number], wordLength1: [number, number], wordLength2: [number, number]): void;
    (modeName: "result", times: [number, number]): void;
    (modeName: "start" | "setting"): void;
};