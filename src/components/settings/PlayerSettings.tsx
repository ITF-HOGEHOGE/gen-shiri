import { forwardRef, useImperativeHandle, useState } from "react";
import { SettingValues } from "./index";

const PlayerSetting = forwardRef((props: {
    playerId?: number
}, ref) => {
    const [inputTime, setInputTime] = useState(300);
    const [inputMinWordLength, setInputMinWordLength] = useState(2);
    const [inputMaxWordLength, setInputMaxWordLength] = useState(8);
    const [lifeline, setLifeline] = useState({
        nmawashi: true,
        pass: true,
        lengthDown: true
    });

    const getInput = (): SettingValues => {
        return {
            time: inputTime,
            wordLength: {
                min: inputMinWordLength,
                max: inputMaxWordLength
            },
            lifeline
        }
    };

    useImperativeHandle(ref, () => ({getInput}));

    return (
        <div className="player-settings-container">
            {
                props.playerId === undefined
                ?   <></>
                :   <div className="player-settings-title">
                        {
                            props.playerId === 1
                            ? "プレイヤー1"
                            : "プレイヤー2"
                        }
                    </div>
            }
            <div className="player-settings-input-wrapper">
                <div className="player-settings-input-label">
                    持ち時間(秒)
                </div>
                <input
                    className="player-settings-input"
                    type='number'
                    value={inputTime}
                    onChange={(e) => {
                        setInputTime(Number(e.target.value))
                    }}
                />
            </div>
            <div className="player-settings-input-wrapper">
                <div className="player-settings-input-label">
                    最小の文字数(2以上)
                </div>
                <input
                    className="player-settings-input"
                    type='number'
                    value={inputMinWordLength}
                    onChange={(e) => {
                        setInputMinWordLength(Number(e.target.value))
                    }}
                />
            </div>
            <div className="player-settings-input-wrapper">
                <div className="player-settings-input-label">
                    最大の文字数(2以上)
                </div>
                <input
                    className="player-settings-input"
                    type='number'
                    value={inputMaxWordLength}
                    onChange={(e) => {
                        setInputMaxWordLength(Number(e.target.value))
                    }}
                />
            </div>
            <div>

            ライフライン
            <div className="player-settings-lifeline-container">
                <button 
                    className={"player-settings-lifeline" + (lifeline.nmawashi ? "" : " player-settings-lifeline-off")}
                    onClick={() =>
                        setLifeline(prev => ({
                            ...prev,
                            nmawashi: !prev.nmawashi
                        }))
                    }
                >
                    <div>
                        ん回し
                    </div>
                </button>
                <button 
                    className={"player-settings-lifeline" + (lifeline.pass ? "" : " player-settings-lifeline-off")}
                    onClick={() =>
                        setLifeline(prev => ({
                            ...prev,
                            pass: !prev.pass
                        }))
                    }
                >
                    <div>
                        パス
                    </div>
                </button>
                <button 
                    className={"player-settings-lifeline" + (lifeline.lengthDown ? "" : " player-settings-lifeline-off")}
                    onClick={() =>
                        setLifeline(prev => ({
                            ...prev,
                            lengthDown: !prev.lengthDown
                        }))
                    }
                >
                    <div>
                        文字数減らし
                    </div>
                </button>
            </div>
            </div>
        </div>
    )
});

export default PlayerSetting;