export type WordLength = {
    min: number,
    max: number
};

export type SettingValues = {
    time: number,
    wordLength: WordLength
};

export type PlayerSettingRef = {
    getInput: () => SettingValues
};