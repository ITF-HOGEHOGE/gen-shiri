import { forwardRef, useImperativeHandle, useState } from "react";
import { SettingValues } from "./index";

const PlayerSetting = forwardRef((props: {
    playerId?: number
}, ref) => {
    const [inputTime, setInputTime] = useState(300);
    const [inputMinWordLength, setInputMinWordLength] = useState(2);
    const [inputMaxWordLength, setInputMaxWordLength] = useState(8);
    const [lifeline,setLifeline] = useState({
        nmawashi: true,
        pass: true,
        lengthDown: true
    })

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
        <div>
            <div>
                プレイヤー{
                    props.playerId === undefined
                    ? ""
                    : props.playerId === 1
                    ? "1"
                    : "2"
                }の持ち時間(秒)
                <input
                    type='number'
                    value={inputTime}
                    onChange={(e) => {
                        setInputTime(Number(e.target.value))
                    }}
                />
            </div>
            <div>
                {
                    props.playerId === undefined
                    ? ""
                    : props.playerId === 1
                    ? "プレイヤー1"
                    : "プレイヤー2"
                }の最小の文字数(2以上)
                <input
                    type='number'
                    value={inputMinWordLength}
                    onChange={(e) => {
                        setInputMinWordLength(Number(e.target.value))
                    }}
                />
            </div>
            <div>
                {
                    props.playerId === undefined
                    ? ""
                    : props.playerId === 1
                    ? "プレイヤー1"
                    : "プレイヤー2"
                }の最大の文字数(2以上)
                <input
                    type='number'
                    value={inputMaxWordLength}
                    onChange={(e) => {
                        setInputMaxWordLength(Number(e.target.value))
                    }}
                />
            </div>
            <div>
                ライフライン
                <label>
                    <input
                        type="checkbox"
                        checked={lifeline.nmawashi}
                        onChange={(e) =>
                            setLifeline(prev => ({
                                ...prev,
                                nmawashi: e.target.checked
                            }))
                        }
                    />
                    {
                        props.playerId === undefined
                        ? ""
                        : props.playerId === 1
                        ? "プレイヤー1"
                        : "プレイヤー2"
                    }ん回し
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={lifeline.pass}
                        onChange={(e) =>
                            setLifeline(prev => ({
                                ...prev,
                                pass: e.target.checked
                            }))
                        }
                    />
                    {
                        props.playerId === undefined
                        ? ""
                        : props.playerId === 1
                        ? "プレイヤー1"
                        : "プレイヤー2"
                    }パス
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={lifeline.lengthDown}
                        onChange={(e) =>
                            setLifeline(prev => ({
                                ...prev,
                                lengthDown: e.target.checked
                            }))
                        }
                    />
                    {
                        props.playerId === undefined
                        ? ""
                        : props.playerId === 1
                        ? "プレイヤー1"
                        : "プレイヤー2"
                    }文字数減らし
                </label>
            </div>
        </div>
    )
});

export default PlayerSetting;