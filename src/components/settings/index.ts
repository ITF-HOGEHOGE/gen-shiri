export type WordLength = {
    min: number,
    max: number
};
export type Lifeline = {
    nmawashi: boolean;
    pass: boolean;
    lengthDown: boolean;
};

export type SettingValues = {
    time: number,
    wordLength: WordLength,
    lifeline: Lifeline
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
export const copySettingValues = (value: SettingValues): SettingValues => {
    const { wordLength, lifeline, ...remain } = value;
    return {
        wordLength: {...wordLength},
        lifeline: {...lifeline},
        ...remain
    };
};

export type PlayerSettingRef = {
    getInput: () => SettingValues
};