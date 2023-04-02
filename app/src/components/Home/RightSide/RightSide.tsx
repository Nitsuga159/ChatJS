import { BsSearch } from 'react-icons/bs'
import s from './RightSide.module.css';
import { ChangeEvent, KeyboardEvent, useCallback, useRef, useState } from 'react';

export default function RightSide() {
  const inputRef = useRef(null);
  const [input, setInput] = useState<string>("");

  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value), []
  );

  const handleClickSearch = () =>
    inputRef.current && (inputRef.current as HTMLInputElement).focus();

  const handleSubmitSearch = () => {
    console.log(input)
    setInput("");
  };

  return (
    <div className={s.container}>
      <h5 className={s.searchTitle}>Search a user</h5>
      <div onClick={handleClickSearch} className={s.search}>
        <input
          value={input}
          ref={inputRef}
          className={s.input}
          onChange={handleChangeInput}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && input.length && handleSubmitSearch()
          }
          maxLength={30}
          placeholder='Search'
        />
        <BsSearch
          className={s.searchIcon}
          onClick={() =>
            input.length && handleSubmitSearch()
          }
        />
      </div>
    </div>
  );
}