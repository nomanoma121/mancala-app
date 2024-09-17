import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      alert("ゲーム中の変更はできません");
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

function GameLog({history, turnHistory, changeTurn}) {
  let valueArray = turnHistory.map((e, index) => {
    if(e === 0){
      return `${index - 1}ターン目  先手のターン: ${history[index - 2]}`;
    } else if (e === 1){
      return `${index - 1}ターン目  先手の追加ターン: ${history[index - 2]}`;
    } else if (e === 2) {
      return `${index - 1}ターン目  後手のターン: ${history[index - 2]}`;
    } else {
      return `${index - 1}ターン目  後手の追加ターン: ${history[index - 2]}`;
    }
});

  valueArray = valueArray.slice(2, history.length + 2);
  return (
    <ol className="log-list">
      {valueArray.map((e, index) => (
        <li key={index} onClick={() => changeTurn(index)}>{e}</li>
      ))}
    </ol>
  );
}
  
function Game() {
  const [initialPocketNumber, setInitialPocketNumber] = useState(3);
  const [numberOfPocket, setNubmerOfPocket] = useState(3);
  const [pocketsArray, setPocektsArray] = useState([3, 3, 3, 0, 3, 3, 3, 0]);
  const [isFirst, setIsFirst] = useState(true);
  const [isAdditionalTurn, setIsAdditionalTurn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState([[...pocketsArray]]);
  useEffect(() => {
    if(!isPlaying){
    setHistory([[...pocketsArray]]);
    }
  },[initialPocketNumber, numberOfPocket, pocketsArray]);
  
  const [nowTurn, setNowTurn] = useState(0);
  // 0: first 1: adFirst: 2: seocnd: 3: adSecondとする
  const [turnHistory, setTurnHistory] = useState([0]);
  const [isLogVisible, setIsLogVisible] = useState(false);
  const [winner, setWinner] = useState();

  useEffect(() => {
    const newArray = Array(numberOfPocket * 2 + 2).fill(initialPocketNumber);
    newArray[numberOfPocket] = 0;
    newArray[numberOfPocket * 2 + 1] = 0;
    setPocektsArray(newArray);
  }, [initialPocketNumber, numberOfPocket]);

  useEffect(() => {
    const turnNum = (isFirst && !isAdditionalTurn) ? 0 :
                    (isFirst && isAdditionalTurn) ? 1 :
                    (!isFirst && !isAdditionalTurn) ? 2 : 3;                   
  setTurnHistory(prevTurnHistory => [...prevTurnHistory, turnNum]);
  },[isFirst, isAdditionalTurn])
  

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
      alert("現在は" + disPlayer + "のターンではありません");
      return;
    } 
    
    let updateArray = [...pocketsArray];
    updateArray[index] = 0;

    // useStateの更新が非同期なためゲーム終了を確認する用のコピー配列を作成（ほかにいい方法ありそう）
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

    // historyを更新。ただし更新する際ターン数より配列が大きいときは過剰分を削除する（ログを上書きする）
    let newHistory = [];
    if(history.length > nowTurn + 1) {
      newHistory = [...history].slice(0, nowTurn + 1);
      setHistory([...newHistory, copyArray]);
      let newTurnHistory = [...turnHistory].slice(0, nowTurn + 3);
      setTurnHistory(newTurnHistory);
    } else {
      setHistory([...history, copyArray]);
    }

    // 表示する配列操作
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
    setNowTurn(nowTurn + 1);
    if (!additionalTurn) {
      setIsFirst(!isFirst);    
      return;
    }
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
      const copyWinner = isFirstSideEmpty ? "先手" : "後手";
      setWinner(copyWinner);
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

  const preSituation = () => {
    if(!isPlaying) {
      alert("ゲームを開始してください");
      return;
    }
    if(isFinished){
      alert("ゲームは終了しました。新しくゲームを始めてください");
    }
    if(nowTurn >= 1) {
      const preArray = [...history[nowTurn - 1]];
      setPocektsArray(preArray);
      setNowTurn(nowTurn - 1);

      if(turnHistory[nowTurn + 1] === 0){
        setIsFirst(true);
        setIsAdditionalTurn(false);
      } else if (turnHistory[nowTurn + 1] === 1) {
        setIsFirst(true);
        setIsAdditionalTurn(true);
      } else if (turnHistory[nowTurn + 1] === 2) {
        setIsFirst(false);
        setIsAdditionalTurn(false);
      } else {
        setIsFirst(false);
        setIsAdditionalTurn(true);
      }

    } else {
      alert("これ以上戻せません");
    }
  }

  const nextSituation = () => {
    if(!isPlaying) {
      alert("ゲームを開始してください");
      return;
    }
    if(history[nowTurn + 1] !== undefined){
      setPocektsArray([...history[nowTurn + 1]]);
      setNowTurn(nowTurn + 1);

      if(turnHistory[nowTurn + 3] === 0){
        setIsFirst(true);
        setIsAdditionalTurn(false);
      } else if (turnHistory[nowTurn + 3] === 1) {
        setIsFirst(true);
        setIsAdditionalTurn(true);
      } else if (turnHistory[nowTurn + 3] === 2) {
        setIsFirst(false);
        setIsAdditionalTurn(false);
      } else {
        setIsFirst(false);
        setIsAdditionalTurn(true);
      }
    } else {
      alert("これ以上進めません");
    }  
  }

  const changeTurn = (turn) => {
    setPocektsArray(history[turn]);
    setNowTurn(turn);

    if(turnHistory[turn] === 0){
      setIsFirst(true);
      setIsAdditionalTurn(false);
    } else if (turnHistory[turn] === 1) {
      setIsFirst(true);
      setIsAdditionalTurn(true);
    } else if (turnHistory[turn] === 2) {
      setIsFirst(false);
      setIsAdditionalTurn(false);
    } else {
      setIsFirst(false);
      setIsAdditionalTurn(true);
    }
  }

  const toggleLog = () => setIsLogVisible(!isLogVisible);
  
  // 表示する変数たち
  const player = isFirst ? "先手" : "後手";
  const disPlayer = isFirst ? "後手" : "先手";
  const additional = isAdditionalTurn ? "追加" : "";
  const finishMessage = isFinished ? winner + "の勝利です" : null;
  const playingMessage = player + "の" + additional + "ターン";
  const message = isFinished ? finishMessage : isPlaying ? playingMessage : "さあ、ゲームを始めよう！";

  return (
    <>
      <div className="main-container">
        <h3 className="turn" style={{opacity: isPlaying ? 1 : 0}}>{nowTurn + 1}ターン目</h3>
        <div className="message-container">
          <h2 className="message">{message}</h2>
        </div>
        <p style={{marginTop: "30px"}}><span style={{color: "blue"}}>青</span>: 先手  <span style={{color: "red"}}>赤</span>: 後手</p>
        <Table pocketsArray={pocketsArray} handleClick={handleClick} />
        <div className="container">
          <UseSelectPocekt 
            handleNumberOfPocekt={handleNumberOfPocekt}
            handlePocketNumber={handlePocketNumber}
            isPlaying={isPlaying}
          />
          <GameButton isPlaying={isPlaying} handleGame={handleGame}/>
          <button className="btn" onClick={() => preSituation()}>一つ戻る</button>
          <button className="btn" onClick={() => nextSituation()}>一つ進む</button>
        </div>
        {isPlaying &&
        <>
          <div className="btn-container">
            <button className="log-button" onClick={toggleLog}>{isLogVisible ? "ログを非表示" : "ログを表示"}</button>
          </div>
          <AnimatePresence>
            {isLogVisible && (
              <motion.div
                className="log-container"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.3 }}
              >
                <GameLog history={history} turnHistory={turnHistory} changeTurn={changeTurn} />
              </motion.div>
            )}
          </AnimatePresence>
          </>
       } 
      </div>     
    </>
  );
}

export default function main () {
  return (
    <>
      <div className="header">
        <h1>マンカラ</h1>
      </div>
      <Game />
      <div className="about-game">
        <h3>マンカラのルール</h3>
        <ol>
          <li>先攻は自分の陣地のいずれかのポケット一か所を選び、そのポケットに入っている石をすべて取ります。</li>
          <li>取った石は右隣のポケットから反時計回りに1個ずつ置いていきます。</li>
          <li>最後の石が緑のポケットで止まったら再度自分の番となり、続けてできます。</li>
          <li>最後の石がそれ以外のポケットに入ったら、後攻の番になります。</li>
          <li>これらを先攻、後攻が交互に繰り返し、相手より先に自分の陣地にある石を無くした方が勝ちとなります。</li>
          <a href="https://recreation.or.jp/activities/genki_up/mancala/" target="_blank" rel="noopener noreferrer">※引用元https://recreation.or.jp/activities/genki_up/mancala/</a>
        </ol>
        <p>ポケット数、初期値などカスタマイズできます。</p>
        <a href="https://youtu.be/OL3m2ZbKb1o?si=orJHShWmcIA8yD6W" target="_blank" rel="noopener noreferrer">わかりやすいプレイ動画があったのでこちらも参考にしてください</a>
      </div>
    </>
  );
}