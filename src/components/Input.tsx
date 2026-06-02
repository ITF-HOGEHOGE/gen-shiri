import { useEffect, useRef, useState } from "react";
import { WordLength } from "./settings";

function Input(props: {
    passTurn: () => void,
    wordLength: [WordLength, WordLength],
    turn: number
}) {
    // 使用済みの言葉
    const usedWords = useRef<Set<string>>(new Set());


    // 要求する文字列の長さ
    const [requestLen, setRequestLen] = useState<number>(getRandomLength(0));
    // 次の言葉の長さをランダムに決定
    function getRandomLength(turn: number) {
        const { min, max } = props.wordLength[turn];
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 要求する文字列の頭文字
    const [requestHead, setRequestHead] = useState<string>("り");
    // 次の言葉の頭文字を決定
    function getNextHead(word:string) {
        let last: string = word[word.length - 1];
        if (last === 'ー') {
            last = word[word.length - 2];
        }
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
            return data[1].length > 0;
        } else {
            console.log("API TYPE ERROR");
            return false;
        }
    }
    // 入力が適切か判定
    const checkInput = async (input: string, hiraganaInput: string) => {
        // 文字列の長さチェック
        if (requestLen === props.wordLength[props.turn].max) {
            if (hiraganaInput.length < requestLen) {
                alert(`${requestLen}文字以上の言葉を入力してください`);
                return;
            }
        }else{
            if (hiraganaInput.length !== requestLen) {
                alert(`${requestLen}文字の言葉を入力してください`);
                return;
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
        // 次の頭文字
        const nextHead = getNextHead(hiraganaInput);
        if (nextHead === 'ん'){
            alert('「ん」で終わっています')
            return;
        }
        // 使用済み単語を更新
        usedWords.current.add(hiraganaInput);
        setRequestHead(nextHead)
        setRequestLen(getRandomLength(1 - props.turn))
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
            <p>文字数: {requestLen === props.wordLength[props.turn].max ? `${requestLen}文字以上` : `${requestLen}文字`}</p>
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