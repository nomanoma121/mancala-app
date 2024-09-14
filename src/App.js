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

function UseSelectPocekt({ handleNumberOfPocekt, handlePocketNumber, isPlaying }) {
  const [selectedNumberOption, setSelectedNumberOption] = useState(3);
  const [selectedInitialOption, setSelectedInitialOption] = useState(3);

  const handleInitialOption = (e) => {
    if(isPlaying){
      e.target.value = selectedInitialOption;
      alert("ゲーム中の変更はできません");
    } else {
      setSelectedInitialOption(e.target.value);
      handlePocketNumber(Number(e.target.value))
    }
  }

  const handleSelectedNumberOption = (e) => {
    if(isPlaying) {
      e.target.value = selectedNumberOption;
      alert("ゲーム中のポケットの変更はできません");
    } else {
      setSelectedNumberOption(e.target.value);
      handleNumberOfPocekt(Number(e.target.value));
    }
  }
  return (
    <div className="select-container">
      <div className="select-box">
        <label className="select-label">ポケット数</label>
        <select
          className="custom-select"
          onChange={(e) => handleSelectedNumberOption(e)}
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
          onChange={(e) => handleInitialOption(e)}
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

function GameButton ({isPlaying, handleGame}) {
  const value = isPlaying ? "ゲームを終了" : "ゲームを開始";
  return (
    <button className="game-button" onClick={() => handleGame()}>{value}</button>
  );
}

export default function Game() {
  const [initialPocketNumber, setInitialPocketNumber] = useState(3);
  const [numberOfPocket, setNubmerOfPocket] = useState(3);
  const [pocketsArray, setPocektsArray] = useState([3, 3, 3, 0, 3, 3, 3, 0]);
  const [isFirst, setIsFirst] = useState(true);
  const [isAdditionalTurn, setIsAdditionalTurn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

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
    if (!isPlaying) {
      // プレイ中以外のクリックを無視
      alert("ゲーム開始ボタンを押してください");
      return;
    }
    // 手番以外のクリックを無視
    if (!((isFirst && index <= numberOfPocket - 1) || (!isFirst && index > numberOfPocket - 1))) {
      alert("現在は" + winner + "のターンではありません");
      return;
    } 
    
    console.log(index);
    let updateArray = [...pocketsArray];
    updateArray[index] = 0;

    // useStateの更新が非同期なためゲーム終了を確認するようのコピー配列を作成（ほかにいい方法ありそう）
    let copyArray = [...pocketsArray];
    (() => {
      let copyIndex = index;
      copyArray[copyIndex] = 0;
      for(let i = 1; i < value + 1; i++){
        if(copyIndex + i > copyArray.length  - 1){
          copyIndex = copyIndex - copyArray.length;
        }
        copyArray[copyIndex + i] = Number(copyArray[copyIndex + i]) + 1; 
      }
    })();
    
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
          // 追加ターンフラグを初期化
          setIsAdditionalTurn(false);
          // ゲームが終了したかどうかを確認
          checkGame(copyArray);
          const finalPosition = newIndex;
          if (finalPosition === (numberOfPocket) || finalPosition === (updateArray.length - 1)) {
            console.log("追加ターン処理");
            setIsAdditionalTurn(true);
            handleTurn(true);
          } else {
            handleTurn(false);
          }
        }
        i++;
      }
    }, 500);
  }

  const handleTurn = (additionalTurn) => {
    console.log("handleTurn Run");
    if (!additionalTurn) {
      console.log("通常処理");
      setIsFirst(!isFirst);
      return;
    }
    console.log("追加ターン処理(In handleTurn)");
  }

  const handleGame = () => {
    if(isPlaying){
      initializeGame();
    }
    setIsPlaying(!isPlaying);
  }

  const checkGame = (array) => {
    const isFirstSideEmpty = array.slice(0, numberOfPocket).every(value => value === 0);
    const isSecondSideEmpty = array.slice(numberOfPocket + 1, -1).every(value => value === 0);

    if(isFirstSideEmpty || isSecondSideEmpty){
      setIsFinished(true);     
    }
  }

  // ゲームを初期化する関数
  const initializeGame = () => {
    const initialArray = Array(numberOfPocket * 2 + 2).fill(initialPocketNumber);
    initialArray[numberOfPocket] = 0;
    initialArray[initialArray.length - 1] = 0;
    setPocektsArray(initialArray);
    setIsFinished(false);
    setIsAdditionalTurn(false);
    setIsFirst(true);
    setIsPlaying(false);
  }
  
  const player = isFirst ? "先手" : "後手";
  const winner = isFirst ? "後手" : "先手";
  const additional = isAdditionalTurn ? "追加" : "";
  const finishMessage = isFinished ? winner + "の勝利です" : null;
  const playingMessage = player + "の" + additional + "ターン";
  const message = isFinished ? finishMessage : isPlaying ? playingMessage : "さあ、ゲームを始めよう！";

  return (
    <>
      <h2>{message}</h2>
      <Table pocketsArray={pocketsArray} handleClick={handleClick} />
      <div className="container">
        <UseSelectPocekt 
          handleNumberOfPocekt={handleNumberOfPocekt}
          handlePocketNumber={handlePocketNumber}
          isPlaying={isPlaying}
        />
        <GameButton isPlaying={isPlaying} handleGame={handleGame}/>
      </div>
    </>
  );
}
