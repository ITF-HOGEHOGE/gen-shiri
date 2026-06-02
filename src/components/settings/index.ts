export type WordLength = {
    min: number,
    max: number
};

export type SettingValues = {
    time: number,
    wordLength: WordLength,
    lifeline: {
        nmawashi: boolean;
        pass: boolean;
        lengthDown: boolean;
    }
};
export const defaultSettingValues: SettingValues = {
    time: 300,
    wordLength: {
        min: 2,
        max: 8
    },
    lifeline: {
        nmawashi: true,
        pass: true,
        lengthDown: true,
    }
};

export type PlayerSettingRef = {
    getInput: () => SettingValues
};