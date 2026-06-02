export type WordLength = {
    min: number,
    max: number
};

export type SettingValues = {
    time: number,
    wordLength: WordLength
};
export const defaultSettingValues = {
    time: 300,
    wordLength: {
        min: 2,
        max: 8
    }
};

export type PlayerSettingRef = {
    getInput: () => SettingValues
};