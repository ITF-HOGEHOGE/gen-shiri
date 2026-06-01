import { useState } from "react";
import { SetModeWrapper } from "../index";

function Settings(props: {
    setModeWrapper: SetModeWrapper
}) {
    // 入力された制限時間・文字列長制限
    const [inputTime1, setInputTime1] = useState(300);
    const [inputTime2, setInputTime2] = useState(300);
    const [inputMinWordLength, setInputMinWordLength] = useState(2);
    const [inputMaxWordLength, setInputMaxWordLength] = useState(8);

    return (
        <div>
            <p>ルールを決めてください。</p>
            <div>
                プレイヤー1の持ち時間(秒)
                <input
                    type='number'
                    value={inputTime1}
                    onChange={(e) => setInputTime1(e.target.value)}
                />
            </div>
            <div>
                プレイヤー2の持ち時間(秒)
                <input
                    type='number'
                    value={inputTime2}
                    onChange={(e) => setInputTime2(e.target.value)}
                />
            </div>
            <div>
                最小の文字数(2以上)
                <input
                    type='number'
                    value={inputMinWordLength}
                    onChange={(e) => setInputMinWordLength(e.target.value)}
                />
            </div>
            <div>
                最大の文字数(2以上)
                <input
                    type='number'
                    value={inputMaxWordLength}
                    onChange={(e) => setInputMaxWordLength(e.target.value)}
                />
            </div>
            <p>プレイヤー1とプレイヤー2を決めたら、スタートを押してください</p>
            <button
                onClick={() => {
                    if (!inputMinWordLength || !inputMaxWordLength || !inputTime1 || !inputTime2){
                        alert('項目に空欄があります');
                        return;
                    }
                    if (Number(inputTime1) <= 0 || Number(inputTime2) <= 0){
                        alert('持ち時間は正の数で入力してください');
                        return;
                    }
                    if (Number(inputMaxWordLength) <= 1 || Number(inputMinWordLength) <= 1){
                        alert('文字数は2以上で入力してください');
                        return;
                    }
                    if (Number(inputMinWordLength) > Number(inputMaxWordLength)){
                        alert('最小文字数は最大文字数以下にしてください');
                        return;
                    }
                    props.setModeWrapper("game", [Number(inputTime1), Number(inputTime2)], [Number(inputMinWordLength), Number(inputMaxWordLength)]);
                }}
            >スタート</button>
        </div>
    )
}

export default Settings;