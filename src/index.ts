export type Mode = {
    mode: "start" | "setting"
} | {
    mode: "game",
    times: [number, number],
    wordLength: [number, number]
} | {
    mode: "result",
    times: [number, number]
};

export type SetModeWrapper = {
    (modeName: "game", times: [number, number], wordLength: [number, number]): void;
    (modeName: "result", times: [number, number]): void;
    (modeName: "start" | "setting"): void;
};