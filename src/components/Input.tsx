import { useEffect, useRef, useState } from "react";
import { Lifeline, WordLength } from "./settings";

function Input(props: {
    passTurn: () => void,
    setUseNmawashi: React.Dispatch<React.SetStateAction<boolean>>,
    setUseLengthDown: React.Dispatch<React.SetStateAction<boolean>>,
    useLengthDown: boolean
    useNmawashi: boolean
    wordLength: [WordLength, WordLength],
    turn: number
    lifeline: Lifeline
    requestLen: number
    addLength: number[]
    setRequestLen: React.Dispatch<React.SetStateAction<number>>
    setAddLength: React.Dispatch<React.SetStateAction<number[]>>
    getRandomLength(turn: number): number
    drawnLengthArray: [number[], number[]]
    setDrawnLengthArray: React.Dispatch<React.SetStateAction<[number[], number[]]>>
}) {
    // 使用済みの言葉
    const usedWords = useRef<Set<string>>(new Set());

    // 要求する文字列の頭文字
    const [requestHead, setRequestHead] = useState<string>("り");
    // 次の言葉の頭文字を決定
    function getNextHead(word:string) {
        let last_index = word.length - 1 - (props.useNmawashi ? 1 : 0);
        if (word[last_index] === 'ー') {
            last_index -= 1;
        }
        const last: string = word[last_index];
        const smallToLarge: Record<string,string> = {
            "ぁ": "あ",
            "ぃ": "い",
            "ぅ": "う",
            "ぇ": "え",
            "ぉ": "お",
            "ゃ": "や",
            "ゅ": "ゆ",
            "ょ": "よ",
            "っ": "つ",
            "ゎ": "わ",
        };
        return smallToLarge[last] ?? last;
    }

    const responseJsonCheck = (data: any): data is [string, string[], any, any] => {
        if (
            Array.isArray(data) 
            && data.length === 4 
            && typeof data[0] === "string" 
            && Array.isArray(data[1])
            && data[1].every((v) => typeof v === "string")
        ) {
            return true
        } else {
            return false
        }
    }
    // 存在する言葉かどうか判定
    async function checkWord(word: string) {
        const url: string = `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(word)}&limit=1&namespace=0&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        if (responseJsonCheck(data)) {
            return data[1].length > 0 && data[1][0] === word;
        } else {
            console.log("API TYPE ERROR");
            return false;
        }
    }
    // 入力が適切か判定
    const checkInput = async (input: string, hiraganaInput: string) => {
        // 文字列の長さチェック
        if (props.useLengthDown === true){
            if (hiraganaInput.length < 2){
                alert('2文字以上の言葉を入力して下さい')
                return;
            } else if (hiraganaInput.length >= props.requestLen) {
                alert('文字数を減らすことができません')
                return;
            }
        } else {
            if (props.requestLen === props.wordLength[props.turn].max + props.addLength[props.turn]) {
                if (hiraganaInput.length < props.requestLen) {
                    alert(`${props.requestLen}文字以上の言葉を入力してください`);
                    return;
                }
            } else {
                if (hiraganaInput.length !== props.requestLen) {
                    alert(`${props.requestLen}文字の言葉を入力してください`);
                    return;
                }
            }
        }
        // 頭文字チェック
        if (hiraganaInput[0] !== requestHead) {
            alert(`${requestHead}から始まる言葉を入力してください。`);
            return;
        }
        // 使用済みチェック
        if (usedWords.current.has(hiraganaInput)) {
            alert('その言葉は既に使われています')
            return;
        }
        // ん回し使用時に最後の文字が「ん」になっているか
        if (props.useNmawashi === true && hiraganaInput[hiraganaInput.length - 1] !== 'ん') {
            alert('最後の文字が「ん」ではないため、ん回しは使えません');
            return;
        }
        // 次の頭文字
        const nextHead = getNextHead(hiraganaInput);
        if (nextHead === 'ん'){
            alert('「ん」で終わっています')
            return;
        }
        // 存在チェック
        const exists = await checkWord(input);
        if (!exists) {
            const approved = window.confirm(
                `「${input}」は見つかりませんでした。\n両者合意の下で有効な単語として認めますか？`
            );
            if (!approved){
                return;
            }
        }
        // 使用済み単語を更新
        usedWords.current.add(hiraganaInput);
        // ん回し
        if (props.useNmawashi === true) {
            props.lifeline.nmawashi = false;
            props.setUseNmawashi(false);
        }
        if (props.useLengthDown === true) {
            props.lifeline.lengthDown = false;
            props.setUseLengthDown(false);
        }

        // 引いた数のリストを更新
        const card = props.getRandomLength(1 - props.turn) - props.addLength[1 - props.turn]
        props.setRequestLen(card + props.addLength[1 - props.turn])
        props.setDrawnLengthArray((pre) => {
            const newList: [number[], number[]] = [[...pre[0]], [...pre[1]]] ;
            newList[1 - props.turn].push(card);
            return newList
        });
        // 文字数減らしで次に追加する文字数を更新
        props.setAddLength((prev) => {
            const next = [...prev];
            next[props.turn] = Math.max(props.requestLen - hiraganaInput.length,0)
            return next;
        })
        setRequestHead(nextHead)
        clearInput();
        props.passTurn();
    };

    // 入力された文字列(確定済み)
    const [input, setInput] = useState<string>("");
    // 入力された文字列(変換中)
    const [inputConverting, setInputConverting] = useState<string>("");
    // 入力された文字列のひらがな(確定済み)
    const [inputHiragana, setInputHiragana] = useState<string>("");
    // 入力された文字列のひらがな(未確定)
    const [inputHiraganaConverting, setInputHiraganaConverting] = useState<string>("");
    // 入力された文字列をすべて取得
    const getAllInput = () => {
        return input + inputConverting;
    };
    // 入力された文字列のひらがなをすべて取得
    const getAllInputHiragana = () => {
        return inputHiragana + inputHiraganaConverting;
    };

    // 入力をクリア
    const clearInput = () => {
        setInput("");
        setInputConverting("");
        setInputHiragana("");
        setInputHiraganaConverting("");
    };
    // 変換終了時に実行
    // 変換完了時と、変換中に対象の文字列をすべて消したときにも実行
    const onCompositionEnd = () => {
        if (inputConverting.length > 0) {
            setInput((pre) => pre + inputConverting);
            setInputHiragana((pre) => pre + inputHiraganaConverting);
        }
        setInputConverting("");
        setInputHiraganaConverting("");
    };
    // ひらがなのみからなるか、検査する正規表現
    const hiraganaRegex = /^\p{scx=Hiragana}+$/u;
    // 変換中に実行され、ひらがな表示を更新
    const updateHiraganaWhileConvering = (e: React.CompositionEvent<HTMLInputElement>) => {
        if (hiraganaRegex.test(e.data)) {
            setInputHiraganaConverting(e.data);
        }
    };

    // 入力が変更されたとき
    const onChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        // 入力された文字列
        const eventValue: string = e.target.value;
        // 入力はじめのとき
        if (input.length === 0) {
            setInputConverting(eventValue);
            return;
        }
        // 今持っている文字列(確定済み)とどこまで一致するか判定
        let nowIndex: number = 0;
        while (nowIndex < input.length && input[nowIndex] === eventValue[nowIndex]) {
            nowIndex += 1;
        }
        // 入力された文字列が、今持っている文字列(確定済み)を含む文字列であったとき
        if (nowIndex === input.length) {
            // 持っている文字列(未確定)を更新
            setInputConverting(eventValue.slice(nowIndex));
            return;
        } else {
            // 入力された文字列が、今持っている文字列(確定済み)を含む文字列でなかったとき
            // 今持っている文字列(確定済み)を更新
            setInput(eventValue);
        }
    };

    // 入力欄が空になったとき、ひらがな欄も空にする
    useEffect(() => {
        if (input.length === 0) {
            setInputHiragana("");
        }
    }, [input]);
    useEffect(() => {
        if (inputConverting.length === 0) {
            setInputHiraganaConverting("");
        }
    }, [inputConverting]);
    return (
        <>
            <p>
                文字数:
                {
                    `${props.requestLen-props.addLength[props.turn]}${props.addLength[props.turn] ? `+${props.addLength[props.turn]}` : ""}`
                }
                文字
                {
                    props.requestLen === props.wordLength[props.turn].max + props.addLength[props.turn]
                    ?   "以上"
                    :   ""
                }
            </p>
            <p>最初の文字: {requestHead}</p>
            <div>
                <p>ひらがな表示です。</p>
                <input
                    type="text"
                    value={getAllInputHiragana()}
                    disabled={input.length === 0}
                    onChange={(e) => {
                        setInputHiragana(e.target.value);
                    }}
                />
                <input
                    type='text'
                    placeholder="回答してください"
                    value={getAllInput()}
                    onChange={onChange}
                    onCompositionUpdate={updateHiraganaWhileConvering}
                    onCompositionEnd={onCompositionEnd}
                />
                <button type="button" onClick={() => checkInput(getAllInput(), getAllInputHiragana())}>回答</button>
            </div>
        </>
    )
};

export default Input;