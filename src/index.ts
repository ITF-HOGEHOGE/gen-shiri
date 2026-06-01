export type Mode = {
    mode: "start" | "setting" | "game"
} | {
    mode: "result",
    times: [number, number]
};