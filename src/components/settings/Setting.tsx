import { useRef, useState } from "react"
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
    const startGame = () => {
        const inputs: SettingValues[] = useHandicap
            ?   [playerSettingsRefs[0].current!.getInput(), playerSettingsRefs[1].current!.getInput()]
            :   [playerSettingsRefs[0].current!.getInput()];
        // 入力を検査
        for (const input of inputs) {
            // ずべて入力されているか
            if (!input.time || !input.wordLength.min || !input.wordLength.max) {
                alert('項目に空欄があります');
                return;
            }
            // 持ち時間が正の値で入力されているか
            if (input.time <= 0) {
                alert('持ち時間は正の数で入力してください');
                return;
            }
            // 文字数が2以上で入力されているか
            if (input.wordLength.min <= 1 || input.wordLength.max <= 1) {
                alert('文字数は2以上で入力してください');
                return;
            }
            // 最大文字数のほうが大きいか
            if (input.wordLength.min > input.wordLength.max) {
                alert('最小文字数は最大文字数以下にしてください');
                return;
            }
        }
        // モード遷移
        const settings: [SettingValues, SettingValues] = useHandicap
            ? [inputs[0], inputs[1]]
            : [{
                time: inputs[0].time,
                wordLength: inputs[0].wordLength,
                lifeline: {...inputs[0].lifeline},
            }, {
                time: inputs[0].time,
                wordLength: inputs[0].wordLength,
                lifeline: {...inputs[0].lifeline},
            }];
        props.setModeWrapper(
            "game", 
            { settings }
        );
    };

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
            <button onClick={startGame}>スタート</button>
        </div>
    )
}

export default Settings;