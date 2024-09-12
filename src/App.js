import {useState} from "react";

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
  // 配列を半分にし、後手の配列を反転(反時計回りに動くため)
  const middleIndex = pocketsArray.length / 2 - 1;
  const firstPocketsArray = pocketsArray.slice(0, (middleIndex));
  const secondPocketsArray = pocketsArray.slice((middleIndex), middleIndex * 2);
  secondPocketsArray.reverse();

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
  return (
    <>
      <div>
        <label>ポケット数</label>
        <select onChange={(e) => handleNumberOfPocekt(Number(e.target.value))}>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
      <div>
        <label>ポケットの初期値</label>
        <select 
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
    </>
  );
}

export default function Game() {
  const [initialPocketNumber, setInitialPocketNumber] = useState(3);
  const [nubmerOfPocket, setNubmerOfPocket] = useState(3);
  // 初期配列を作成
  let defaultArray = Array()
  const handleNumberOfPocekt = (i) => {
    setNubmerOfPocket(i);
  }
  const handlePocketNumber = (i) => {
    setInitialPocketNumber(i);
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