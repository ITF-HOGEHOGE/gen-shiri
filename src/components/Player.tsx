import { useEffect, useRef, useState } from "react";

function Player(props: {
  setStartTurn: (startTurn: () => void) => void,
  setEndTurn: (endTurn: () => void) => void,
}) {
  const [time, setTime] = useState<number>(500);
  const intervalId = useRef<number | null>(null);
  const startTurn = () => {
    intervalId.current = setInterval(() => {
      setTime((pre) => pre - 1);
    }, 1000);
  };
  const endTurn = () => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  useEffect(() => {
    props.setStartTurn(startTurn);
    props.setEndTurn(endTurn);
  }, [])

  return (
    <div>{time}秒</div>
  )
}

export default Player;