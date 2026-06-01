import { SettingValues } from "./components/settings";

export type Mode = {
    mode: "start" | "setting"
} | {
    mode: "game",
    settings: [SettingValues, SettingValues]
} | {
    mode: "result",
    times: [number, number]
};

export type SetModeWrapper = {
    (modeName: "game", options: {settings: [SettingValues, SettingValues]}): void;
    (modeName: "result", options: {times: [number, number]}): void;
    (modeName: "start" | "setting"): void;
};