import { useEffect, useState } from "react";

function Input(props: {
    passTurn: () => void,
    wordLength1:[number, number]
    wordLength2:[number,number]
    usedWords:Set<string>,
    setUsedWords: React.Dispatch<
        React.SetStateAction<Set<string>>
    >
    turn:number
}) {
    function getRandomLength(turn: number) {
        if (turn === 0){
            const [min, max] = props.wordLength1;
            return Math.floor(Math.random() * (max - min + 1)) + min
        }else{
            const [min, max] = props.wordLength2;
            return Math.floor(Math.random() * (max - min + 1)) + min
        }
    }

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

    async function checkWord(word: string) {
        const url: string = `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(word)}&limit=1&namespace=0&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        // any型許すまじ
        return data[1].length > 0;
    }

    // 要求する文字列の長さ
    const [requestLen, setRequestLen] = useState<number>(getRandomLength(0));
    // 要求する文字列の頭文字
    const [requestHead, setRequestHead] = useState<string>("り");
    // 入力が適切か判定
    const checkInput = async (input: string) => {
        // 文字列の長さチェック
        if (props.turn === 0){
            if (requestLen === props.wordLength1[1]) {
                if (input.length < requestLen) {
                    alert(`${requestLen}文字以上の言葉を入力してください`);
                    return;
                }
            }else{
                if (input.length !== requestLen) {
                    alert(`${requestLen}文字の言葉を入力してください`);
                    return;
                }
            }
        }else{
            if (requestLen === props.wordLength2[1]) {
                if (input.length < requestLen) {
                    alert(`${requestLen}文字以上の言葉を入力してください`);
                    return;
                }
            }else{
                if (input.length !== requestLen) {
                    alert(`${requestLen}文字の言葉を入力してください`);
                    return;
                }
            }
        }
        // 頭文字チェック
        if (input[0] !== requestHead) {
            alert(`${requestHead}から始まる言葉を入力してください。`);
            return;
        }
        // 使用済みチェック
        if (props.usedWords.has(input)) {
            alert('その言葉は既に使われています')
            return;
        }
        // 存在チェック
        const convertedWord = inputText + inputTextTmp;
        const exists = await checkWord(convertedWord);
        if (!exists) {
            const approved = window.confirm(
                `「${convertedWord}」は見つかりませんでした。\n両者合意の下で有効な単語として認めますか？`
            );
            if (!approved){
                return;
            }
        }
        // 次の頭文字
        const nextHead = getNextHead(input);
        if (nextHead === 'ん'){
            alert('「ん」で終わっています')
            return;
        }
        // 使用済み単語を更新
        props.setUsedWords((prev) => {
            const next = new Set(prev);
            next.add(input);
            return next;
        })
        setRequestHead(nextHead)
        setRequestLen(getRandomLength(1 - props.turn))
        clearInput();
        props.passTurn();
    };
    // 入力された文字列(確定済み)
    const [inputText, setInputText] = useState<string>("");
    // 入力された文字列(変換中)
    const [inputTextTmp, setInputTextTmp] = useState<string>("");
    // 入力された文字列のひらがな(確定済み)
    const [inputTextHiragana, setInputTextHiragana] = useState<string>("");
    // 入力された文字列のひらがな(未確定)
    const [inputTextHiraganaTmp, setInputTextHiraganaTmp] = useState<string>("");
    // 入力をクリア
    const clearInput = () => {
        setInputText("");
        setInputTextTmp("");
        setInputTextHiragana("");
        setInputTextHiraganaTmp("");
    };
    // 入力が変更されたとき
    const onChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        // 入力された文字列
        const eventValue: string = e.target.value;
        // 入力はじめのとき
        if (inputText.length === 0) {
            setInputTextTmp(eventValue);
            return;
        }
        // 今持っている文字列(確定済み)とどこまで一致するか判定
        let nowIndex: number = 0;
        while (inputText[nowIndex] === eventValue[nowIndex]) {
            nowIndex += 1;
            // 入力された文字列が、今持っている文字列(確定済み)を含む文字列であったとき
            if (nowIndex === inputText.length) {
                // 持っている文字列(未確定)を更新
                setInputTextTmp(eventValue.slice(nowIndex));
                return;
            }
        }
        // 入力された文字列が、今持っている文字列(確定済み)を含む文字列でなかったとき
        // 今持っている文字列(確定済み)を更新
        setInputText(eventValue);
    };
    // ひらがなのみからなるか、検査する正規表現
    const hiraganaRegex = /^\p{scx=Hiragana}+$/u;

    // 入力欄が空になったとき、ひらがな欄も空にする
    useEffect(() => {
        if (inputText.length === 0) {
            setInputTextHiragana("");
        }
    }, [inputText]);

    return (
        <>
            <p>文字数: {props.turn === 0 ? (
                requestLen === props.wordLength1[1] ? `${requestLen}文字以上` : `${requestLen}文字`
            ):(
                requestLen === props.wordLength2[1] ? `${requestLen}文字以上` : `${requestLen}文字`
            )}</p>
            <p>最初の文字: {requestHead}</p>
            <div>
                <p>ひらがな表示です。</p>
                <input
                    type="text"
                    value={inputTextHiragana + inputTextHiraganaTmp}
                    disabled={inputText.length === 0}
                    onChange={(e) => {
                        setInputTextHiragana(e.target.value);
                    }}
                />
                <input
                    type='text'
                    placeholder="回答してください"
                    value={inputText + inputTextTmp}
                    onChange={onChange}
                    onCompositionUpdate={(e) => {
                        if (hiraganaRegex.test(e.data)) {
                            setInputTextHiraganaTmp(e.data);
                        }
                    }}
                    onCompositionEnd={() => {
                        setInputText((pre) => pre + inputTextTmp);
                        setInputTextTmp("");
                        setInputTextHiragana((pre) => pre + inputTextHiraganaTmp);
                        setInputTextHiraganaTmp("");
                    }}
                />
                <button type="button" onClick={() => checkInput(inputTextHiragana + inputTextHiraganaTmp)}>回答</button>
            </div>
        </>
    )
};

export default Input;