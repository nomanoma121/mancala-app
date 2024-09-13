import { useEffect, useState } from "react";

function Pocket({ value, index, handleClick }) {
  return (
    <button
      className="pocket"
      onClick={() => handleClick(index, value)}
    >
      {value}
    </button>
  );
}

function SubPocket({ value }) {
  return <div className="subPocket">{value}</div>;
}

function Table({ pocketsArray, handleClick }) {
  // 表示する配列を管理
  const [firstPocketsArray, setFirstPocketsArray] = useState([]);
  const [secondPocketsArray, setSecondPocketsArray] = useState([]);
  
  useEffect(() => {
    console.log("effect run");

    const middleIndex = Math.floor(pocketsArray.length / 2) - 1;
    const firstPockets = pocketsArray.slice(0, middleIndex);
    const secondPockets = pocketsArray.slice(middleIndex + 1, pocketsArray.length - 1);
    secondPockets.reverse();
    setFirstPocketsArray(firstPockets);
    setSecondPocketsArray(secondPockets);
  }, [pocketsArray]);

  return (
    <div className="tables">
      <SubPocket value={pocketsArray[pocketsArray.length - 1]} />
      <div className="pockets">
        <div className="secondPockets">
          {secondPocketsArray.map((value, index) => (
            <Pocket value={value} key={index} handleClick={handleClick} index={pocketsArray.length - index - 2} />
          ))}
        </div>
        <div className="firstPockets">
          {firstPocketsArray.map((value, index) => (
            <Pocket value={value} key={index} handleClick={handleClick} index={index} />
          ))}
        </div>
      </div>
      <SubPocket value={pocketsArray[pocketsArray.length / 2 - 1]} />
    </div>
  );
}

function SelectPocekt({ handleNumberOfPocekt, handlePocketNumber }) {
  return (
    <div className="select-container">
      <div className="select-box">
        <label className="select-label">ポケット数</label>
        <select
          className="custom-select"
          onChange={(e) => handleNumberOfPocekt(Number(e.target.value))}
        >
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
      <div className="select-box">
        <label className="select-label">ポケットの初期値</label>
        <select
          className="custom-select"
          onChange={(e) => handlePocketNumber(Number(e.target.value))}
          defaultValue={3}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
    </div>
  );
}

export default function Game() {
  const [initialPocketNumber, setInitialPocketNumber] = useState(3);
  const [numberOfPocket, setNubmerOfPocket] = useState(3);
  const [pocketsArray, setPocektsArray] = useState([3, 3, 3, 0, 3, 3, 3, 0]);
  const [isFirst, setIsFirst] = useState(true);
  const [isAdditionalTurn, setIsAdditionalTurn] = useState(false);

  useEffect(() => {
    console.log("配列を再生成");
    const newArray = Array(numberOfPocket * 2 + 2).fill(initialPocketNumber);
    newArray[numberOfPocket] = 0;
    newArray[numberOfPocket * 2 + 1] = 0;
    setPocektsArray(newArray);
  }, [initialPocketNumber, numberOfPocket]);

  const handleNumberOfPocekt = (i) => {
    setNubmerOfPocket(i);
  }
  const handlePocketNumber = (i) => {
    setInitialPocketNumber(i);
  }

  const handleClick = (index, value) => {
    console.log(index);
    let updateArray = [...pocketsArray];
    updateArray[index] = 0;
    
    // 0.5秒ごとに更新
    let i = 1;
    const interval = setInterval(() => {
      if (i <= value) {
        let newIndex = index + i;
        if (newIndex > updateArray.length - 1) {
          newIndex -= updateArray.length;
        }
        updateArray[newIndex] = Number(updateArray[newIndex]) + 1;
        setPocektsArray([...updateArray]);
        if (i === value) {
          clearInterval(interval);
          const finalPosition = newIndex;
          if (finalPosition === (numberOfPocket - 1) || finalPosition === (updateArray.length - 1)) {
            console.log("追加ターン処理");
            setIsAdditionalTurn(true);
          }
        }
        i++;
      }
    }, 500);
  }

  useEffect(() => {
    if (isAdditionalTurn) {
      // 追加ターン処理をここに記述
      setIsAdditionalTurn(false); // 追加ターン処理が完了した後にフラグをリセット
    }
  }, [isAdditionalTurn]);

  const handleTurn = () => {
    if (!isAdditionalTurn) {
      setIsFirst(!isFirst);
    }
  }

  const player = isFirst ? "先手" : "後手";

  return (
    <>
      <h2>{player}のターン</h2>
      <Table pocketsArray={pocketsArray} handleClick={handleClick} />
      <SelectPocekt 
        handleNumberOfPocekt={handleNumberOfPocekt}
        handlePocketNumber={handlePocketNumber}
      />
    </>
  );
}
