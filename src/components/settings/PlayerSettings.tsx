import { forwardRef, useImperativeHandle, useState } from "react";
import { SettingValues, WordLength } from "./index";

const PlayerSetting = forwardRef((props: {
    playerId?: number
}, ref) => {
    const [inputTime, setInputTime] = useState(300);
    const [inputMinWordLength, setInputMinWordLength] = useState(2);
    const [inputMaxWordLength, setInputMaxWordLength] = useState(8);
    const getInput = (): SettingValues => {
        return {
            time: inputTime,
            wordLength: {
                min: inputMinWordLength,
                max: inputMaxWordLength
            }
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
        </div>
    )
});

export default PlayerSetting;