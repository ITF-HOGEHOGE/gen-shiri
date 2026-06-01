import { useEffect, useState } from "react";

function Input(props: {
    passTurn: () => void,
    wordLength:[number, number]
    usedWords:Set<string>,
    setUsedWords: React.Dispatch<
        React.SetStateAction<Set<string>>
    >
}) {
    function getRandomLength() {
        const [min, max] = props.wordLength;
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    async function checkWord(word: string) {
        const url: string = `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(word)}&limit=1&namespace=0&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        return data[1].length > 0;
    }

    // 要求する文字列の長さ
    const [requestLen, setRequestLen] = useState<number>(getRandomLength());
    // 要求する文字列の頭文字
    const [requestHead, setRequestHead] = useState<string>("り");
    // 入力が適切か判定
    const checkInput = async (input: string) => {
        // 文字列の長さチェック
        if (input.length !== requestLen) {
            alert(`${requestLen}文字の言葉を入力してください。`);
            return;
        }
        // 頭文字チェック
        if (input[0] !== requestHead) {
            alert(`${requestHead}から始まる言葉を入力してください。`);
            return;
        }
        if (props.usedWords.has(input)) {
            alert('その言葉は既に使われています')
            return;
        }
        // 存在チェック
        const convertedWord = inputText + inputTextTmp;
        const exists = await checkWord(convertedWord);
        if (!exists) {
            alert('その単語は見つかりません')
            return;
        }
        props.setUsedWords((prev) => {
            const next = new Set(prev);
            next.add(input);
            return next;
        })
        // 次のターンへ
        setRequestHead(input[input.length - 1]);
        setRequestLen(getRandomLength())
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

    useEffect(() => {
        if (inputText.length === 0) {
            setInputTextHiragana("");
        }
    }, [inputText])

    return (
        <>
            <p>文字数: {requestLen}</p>
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