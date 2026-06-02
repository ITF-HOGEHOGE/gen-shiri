import { SettingValues } from "./components/settings";

export type Mode = {
    mode: "start" | "setting"
} | {
    mode: "game",
    // 設定値
    settings: [SettingValues, SettingValues]
} | {
    mode: "result",
    // 残り時間
    times: [number, number]
};

// setModeのラッパー関数の型を持つ
// この型を持つ関数は、下のいずれかの引数でしか呼び出されない
export type SetModeWrapper = {
    (modeName: "game", options: {settings: [SettingValues, SettingValues]}): void;
    (modeName: "result", options: {times: [number, number]}): void;
    (modeName: "start" | "setting"): void;
};