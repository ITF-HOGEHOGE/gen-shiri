import { useState } from "react";

function Input(props: {
    passTurn: () => void,
    wordLength:[number,number],
    usedWords:Set<string>,
    setUsedWords: React.Dispatch<
        React.SetStateAction<Set<string>>
    >
}) {
    function getRandomLength() {
        const [min,max] = props.wordLength;
        return Math.floor(Math.random()*(max-min+1))+min
    }

    function getNextHead(word:string) {
        let last = word[word.length-1];
        if (last === 'ー') {
            last = word[word.length-2];
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
        }
        return smallToLarge[last] ?? last;
    }

    async function checkWord(word: string) {
        const url =
            `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(word)}&limit=1&namespace=0&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        return data[1].length > 0;
    }

    const [requestLen, setRequestLen] = useState<number>(getRandomLength());
    const [requestHead, setRequestHead] = useState<string>("り");
    const checkInput = async (input: string) => {
        if (input.length !== requestLen) {
            alert(`${requestLen}文字の言葉を入力してください。`);
            return;
        }
        if (input[0] !== requestHead) {
            alert(`${requestHead}から始まる言葉を入力してください。`);
            return;
        }
        if (props.usedWords.has(input)) {
            alert('その言葉は既に使われています')
            return;
        }
        const convertedWord = inputText+inputTextTmp;
        const exists = await checkWord(convertedWord);
        if (!exists) {
            alert('その単語は見つかりません')
            return;
        }
        const nextHead = getNextHead(input);
        if (nextHead === 'ん'){
            alert('「ん」で終わっています')
            return;
        }
        props.setUsedWords((prev) => {
            const next = new Set(prev);
            next.add(input);
            return next;
        })
        setRequestHead(nextHead)
        setRequestLen(getRandomLength())
        clearInput();
        props.passTurn();
    };
    const [inputText, setInputText] = useState<string>("");
    const [inputTextTmp, setInputTextTmp] = useState<string>("");
    const [inputTextHiragana, setInputTextHiragana] = useState<string>("");
    const [inputTextHiraganaTmp, setInputTextHiraganaTmp] = useState<string>("");
    const clearInput = () => {
        setInputText("");
        setInputTextHiragana("");
    };
    const hiraganaRegex = /^\p{scx=Hiragana}+$/u;

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
                    onChange={(e) => {
                        const eventValue = e.target.value;
                        if (inputText.length === 0) {
                            setInputTextTmp(eventValue);
                            return;
                        }
                        let nowIndex = 0;
                        while (inputText[nowIndex] === eventValue[nowIndex]) {
                            nowIndex += 1;
                            if (nowIndex === inputText.length) {
                                setInputTextTmp(eventValue.slice(nowIndex));
                                return;
                            }
                        }
                        setInputText((pre) => pre.slice(0, nowIndex));
                    }}
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