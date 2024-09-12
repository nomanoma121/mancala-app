import {useEffect, useState} from "react";

function Pocket({value}) {
  return (
    <button className="pocket">{value}</button>
  );
}

function SubPocket() {
  return (
    <div className="subPocket">0</div>
  );
}

function Table({pocketsArray}) {
  // 表示する配列を管理
  const [firstPocketsArray, setFirstPocketsArray] = useState([]);
  const [secondPocketsArray, setSecondPocketsArray] = useState([]);
  useEffect(() => {
    console.log("effect run");

    const middleIndex = Math.floor(pocketsArray.length / 2) - 1;
    const firstPockets = pocketsArray.slice(0, middleIndex);
    const secondPockets = pocketsArray.slice(middleIndex + 2, pocketsArray.length - 1);

    console.log("setする前" + firstPockets);
    console.log("setする前" + secondPockets);
    setFirstPocketsArray(firstPockets);
    setSecondPocketsArray(secondPockets);

    console.log(firstPockets);
    console.log(secondPockets);
  },[pocketsArray]);

  return (
    <div className="tables">
      <SubPocket/>
        <div className="pockets">
        <div className="secondPockets">
          {secondPocketsArray.map((value, index) => (
            <Pocket value={value} key={index}/>
          ))}
        </div>
        <div className="firstPockets">
          {firstPocketsArray.map((value, index) => (
            <Pocket value={value} key={index}/>
          ))}
        </div>
      </div>
      <SubPocket/>
    </div>
  )
}

function SelectPocekt ({handleNumberOfPocekt, handlePocketNumber}) {
  console.log("SelectPocekt Run");
  return (
    <>
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
    </>
  );
}

export default function Game() {
  const [initialPocketNumber, setInitialPocketNumber] = useState(3);
  const [numberOfPocket, setNubmerOfPocket] = useState(3);
  const [pocketsArray, setPocektsArray] = useState([3, 3, 3, 0, 3, 3, 3, 0]);

  // 初期配列を値が変更されるたび再生成
  useEffect(() => {
    console.log("配列を再生成");
    const newArray = Array(numberOfPocket * 2 + 2).fill(initialPocketNumber);
    newArray[numberOfPocket] = 0;
    newArray[numberOfPocket * 2 + 2] = 0;
    setPocektsArray(newArray);
  }, [initialPocketNumber, numberOfPocket]);

  const handleNumberOfPocekt = (i) => {
    setNubmerOfPocket(i);
    console.log("handleNumberOfPocekt Run");
  }
  const handlePocketNumber = (i) => {
    setInitialPocketNumber(i);
    console.log("handleNumberOfPocekt Run");
  }
  return (
    <>
      <Table pocketsArray={pocketsArray}/>
      <SelectPocekt 
        handleNumberOfPocekt={handleNumberOfPocekt}
        handlePocketNumber={handlePocketNumber}
      />
    </>
  )
}