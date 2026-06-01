import { useEffect, useRef, useState } from "react"
import { SetModeWrapper } from "../../index";
import PlayerSettings from "./PlayerSettings";
import { PlayerSettingRef, SettingValues } from ".";

function Settings(props: {
    setModeWrapper: SetModeWrapper
}) {
    // 入力された制限時間・文字列長制限
    const [useHandicap, setUseHandicap] = useState(false);
    const playerSettingsRefs = [
        useRef<PlayerSettingRef | null>(null),
        useRef<PlayerSettingRef | null>(null)
    ];

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
            {
                useHandicap 
                ?   <>
                        <PlayerSettings playerId={1} ref={playerSettingsRefs[0]} />
                        <PlayerSettings playerId={2} ref={playerSettingsRefs[1]} />
                    </> 
                :   <PlayerSettings ref={playerSettingsRefs[0]} />
            }
            <p>スタートを押すとゲームが始まります</p>
            <button
                onClick={() => {
                    const inputs: [SettingValues, SettingValues] = useHandicap
                        ?   [playerSettingsRefs[0].current!.getInput(), playerSettingsRefs[0].current!.getInput()]
                        :   [playerSettingsRefs[0].current!.getInput(), playerSettingsRefs[1].current!.getInput()];
                    for (const input of inputs) {
                        if (!input.time || !input.wordLength.min || !input.wordLength.max) {
                            alert('項目に空欄があります');
                            return;
                        }
                        if (input.time <= 0) {
                            alert('持ち時間は正の数で入力してください');
                            return;
                        }
                        if (input.wordLength.min <= 1 || input.wordLength.max <= 1) {
                            alert('文字数は2以上で入力してください');
                            return;
                        }
                        if (input.wordLength.min > input.wordLength.max) {
                            alert('最小文字数は最大文字数以下にしてください');
                            return;
                        }
                    }
                    props.setModeWrapper(
                        "game", 
                        { settings: inputs }
                    );
                }}
            >スタート</button>
        </div>
    )
}

export default Settings;