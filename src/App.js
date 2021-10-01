// https://www.notion.so/Frontend-e12411d8ddab4184b47efb6158a839d1

import { useEffect, useRef, useState } from "react";
import "./styles.css";

function moveElement(originalArr, fromIndex, toIndex) {
  const arr = originalArr.slice();
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
  return arr;
}

const CURSOR_CHAR = "CURSOR_CHAR";

const Cursor = () => <span className="blinking-cursor">|</span>;

const Input = () => {
  const inputRef = useRef();
  const [value, setValue] = useState([CURSOR_CHAR]);
  const [isCursorShown, setIsCursorShown] = useState(false);

  useEffect(() => {
    const handleKeyPress = (ev) => {
      if (document.activeElement !== inputRef.current) {
        return;
      }

      const nextValue = value.slice();
      const cursorIdx = nextValue.findIndex((v) => v === CURSOR_CHAR);

      switch (ev.key) {
        case "Backspace":
          if (nextValue.length !== 1) {
            nextValue.splice(cursorIdx - 1, 1);
            setValue(nextValue);
          }
          break;
        case "Delete":
          if (nextValue.length !== 1) {
            nextValue.splice(cursorIdx + 1, 1);
            setValue(nextValue);
          }
          break;
        case "ArrowRight":
          if (cursorIdx === value.length - 1) {
            return;
          }
          setValue(moveElement(nextValue, cursorIdx, cursorIdx + 1));
          break;
        case "ArrowLeft":
          if (cursorIdx === 0) {
            return;
          }
          setValue(moveElement(nextValue, cursorIdx, cursorIdx - 1));
          break;
        case "Enter":
          break;
        default:
          nextValue.splice(cursorIdx, 0, ev.key);
          setValue(nextValue);
      }
    };

    const handleClick = (ev) => {
      setIsCursorShown(document.activeElement === inputRef.current);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.addEventListener("click", handleClick);
    };
  }, [value, setValue]);

  return (
    <div className="Input" ref={inputRef} tabIndex="0">
      {value.map((char, idx) => {
        if (char === CURSOR_CHAR) {
          return isCursorShown ? <Cursor key={char + idx} /> : null;
        }
        return (
          <span key={char + idx} data-key={char}>
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Input />
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
