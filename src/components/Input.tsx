import { forwardRef, useImperativeHandle, useState } from "react";

function Input(props: {
    passTurn: () => void,
    wordLength:[number,number]
}) {
    function getRandomLength() {
        const [min,max] = props.wordLength;
        return Math.floor(Math.random()*(max-min+1))+min
    }

    const [requestLen, setRequestLen] = useState<number>(getRandomLength());
    const [requestHead, setRequestHead] = useState<string>("り");
    const checkInput = (input: string) => {
        if (input.length !== requestLen) {
            alert(`${requestLen}文字の言葉を入力してください。`);
            return;
        }
        if (input[0] !== requestHead) {
            alert(`${requestHead}から始まる言葉を入力してください。`);
            return;
        }
        setRequestHead(input[input.length - 1]);
        setRequestLen(getRandomLength())
        clearInput();
        props.passTurn();
    };
    const [inputText, setInputText] = useState<string>("");
    const [inputHiraganaText, setInputInraganaText] = useState<string>("");
    const clearInput = () => {
        setInputText("");
        setInputInraganaText("");
    };
    const hiraganaRegex = /^\p{scx=Hiragana}+$/u;

    return (
        <>
            <p>文字数: {requestLen}</p>
            <p>最初の文字: {requestHead}</p>
            <div>
                <p>{inputHiraganaText}</p>
                <input
                    type='text'
                    placeholder="回答してください"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)} 
                    onCompositionUpdate={(e) => {
                        if (hiraganaRegex.test(e.data)) {
                            setInputInraganaText(e.data);
                        }
                    }}
                >
                </input>
                <button type="button" onClick={() => checkInput(inputHiraganaText)}>回答</button>
            </div>
        </>
    )
};

export default Input;