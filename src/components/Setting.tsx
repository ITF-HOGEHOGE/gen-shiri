import { useState } from "react"
import { SetModeWrapper } from "../index";

function Settings(props: {
    setModeWrapper: SetModeWrapper
}) {
    // 入力された制限時間・文字列長制限
    const [inputTime1, setInputTime1] = useState(300);
    const [inputTime2, setInputTime2] = useState(300);
    const [inputMinWordLength1, setInputMinWordLength1] = useState(2);
    const [inputMaxWordLength1, setInputMaxWordLength1] = useState(8);
    const [inputMinWordLength2, setInputMinWordLength2] = useState(2);
    const [inputMaxWordLength2, setInputMaxWordLength2] = useState(8);
    const [useHandicap,setUseHandicap] = useState(false)

    return (
        <div>
            <p>ルールを決めてください。</p>
            <label>
                <input
                    type='checkbox'
                    checked={useHandicap}
                    onChange={(e) => setUseHandicap(e.target.checked)}
                />
                ハンデを使用する
            </label>
            {!useHandicap ? (
                <div>
                    <div>
                        プレイヤーの持ち時間(秒)
                        <input
                        type='number'
                        value={inputTime1}
                        onChange={(e) => {
                            setInputTime1(Number(e.target.value))
                            setInputTime2(Number(e.target.value))
                        }}
                    />
                    </div>
                    <div>
                        最小の文字数(2以上)
                        <input
                        type='number'
                        value={inputMinWordLength1}
                        onChange={(e) => {
                            setInputMinWordLength1(Number(e.target.value))
                            setInputMinWordLength2(Number(e.target.value))
                        }}
                    />
                    </div>
                    <div>
                        最大の文字数(2以上)
                        <input
                        type='number'
                        value={inputMaxWordLength1}
                        onChange={(e) => {
                            setInputMaxWordLength1(Number(e.target.value))
                            setInputMaxWordLength2(Number(e.target.value))
                        }}
                    />
                    </div>
                </div>
            ) : (
                <div>
                    <div>
                        プレイヤー1の持ち時間(秒)
                        <input
                        type='number'
                        value={inputTime1}
                        onChange={(e) => {
                            setInputTime1(Number(e.target.value))
                        }}
                    />
                    </div>
                    <div>
                        プレイヤー1の最小の文字数(2以上)
                        <input
                        type='number'
                        value={inputMinWordLength1}
                        onChange={(e) => {
                            setInputMinWordLength1(Number(e.target.value))
                        }}
                    />
                    </div>
                    <div>
                        プレイヤー1の最大の文字数(2以上)
                        <input
                        type='number'
                        value={inputMaxWordLength1}
                        onChange={(e) => {
                            setInputMaxWordLength1(Number(e.target.value))
                        }}
                    />
                    </div>
                    <div>
                        プレイヤー2の持ち時間(秒)
                        <input
                        type='number'
                        value={inputTime2}
                        onChange={(e) => {
                            setInputTime2(Number(e.target.value))
                        }}
                    />
                    </div>
                    <div>
                        プレイヤー2の最小の文字数(2以上)
                        <input
                        type='number'
                        value={inputMinWordLength2}
                        onChange={(e) => {
                            setInputMinWordLength2(Number(e.target.value))
                        }}
                    />
                    </div>
                    <div>
                        プレイヤー2の最大の文字数(2以上)
                        <input
                        type='number'
                        value={inputMaxWordLength2}
                        onChange={(e) => {
                            setInputMaxWordLength2(Number(e.target.value))
                        }}
                    />
                    </div>
                </div>
            )
            }
            <p>スタートを押すとゲームが始まります</p>
            <button
                onClick={() => {
                    if (!inputMinWordLength1 || !inputMaxWordLength1 || !inputMaxWordLength2 || !inputMinWordLength2 || !inputTime1 || !inputTime2){
                        alert('項目に空欄があります');
                        return;
                    }
                    if (Number(inputTime1) <= 0 || Number(inputTime2) <= 0){
                        alert('持ち時間は正の数で入力してください');
                        return;
                    }
                    if (Number(inputMaxWordLength1) <= 1 || Number(inputMinWordLength1) <= 1 || Number(inputMaxWordLength2) <= 1 || Number(inputMinWordLength2) <= 1){
                        alert('文字数は2以上で入力してください');
                        return;
                    }
                    if (Number(inputMinWordLength1) > Number(inputMaxWordLength1) || Number(inputMinWordLength2) > Number(inputMaxWordLength2) ){
                        alert('最小文字数は最大文字数以下にしてください');
                        return;
                    }
                    props.setModeWrapper(
                        "game", 
                        [Number(inputTime1), Number(inputTime2)], 
                        [Number(inputMinWordLength1), Number(inputMaxWordLength1)],
                        [Number(inputMinWordLength2), Number(inputMaxWordLength2)]
                    );
                }}
            >スタート</button>
        </div>
    )
}

export default Settings;