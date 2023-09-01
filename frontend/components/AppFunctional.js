import React, {useState} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const gridArray = 
    [[1,1], [2,1], [3,1],
     [1,2], [2,2], [3,2],
     [3,1], [3,2], [3,3]];

  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const [currentSteps, setCurrentSteps] = useState(initialSteps);
  const [currentMessage, setCurrentMessage] = useState(initialMessage);
  const [emailInputValue, setEmailInputValue] = useState(initialEmail);

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCurrentIdx(initialIndex);
    setCurrentSteps(initialSteps);
    setCurrentMessage(initialMessage);
  }

  function getNextIndex(dir) {
    if(dir === 'left'){
      gridArray[currentIdx][0] === 1 ? setCurrentMessage("You can't go left") : move(-1);
    }
    else if(dir === 'up'){
      gridArray[currentIdx][1] === 1 ? setCurrentMessage("You can't go up") : move(-3);
    }
    else if(dir === 'right'){
      gridArray[currentIdx][0] === 3 ? setCurrentMessage("You can't go right") : move(1);
    }
    else if(dir === 'down'){
      gridArray[currentIdx][1] === 3 ? setCurrentMessage("You can't go down") : move(3);
    }
  }

  function move(amt) {
    setCurrentSteps(currentSteps + 1);
    setCurrentIdx(currentIdx + amt);
    setCurrentMessage(initialMessage);
  }

  function handleChange(evt) {
    // You will need this to update the value of the input.
    const {value} = evt.target;
    setEmailInputValue(value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    axios.post('http://localhost:9000/api/result', 
    {'x': gridArray[currentIdx][0], 
    'y': gridArray[currentIdx][1], 
    'steps': currentSteps, 
    'email': emailInputValue})
      .then(res => {
        setCurrentMessage(res.data.message);
        setEmailInputValue(initialEmail);
      })
      .catch(err => {
        setCurrentMessage(err.response.data.message);
        setEmailInputValue(initialEmail);
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({gridArray[currentIdx].toString()})</h3>
        <h3 id="steps">You moved {currentSteps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currentIdx ? ' active' : ''}`}>
              {idx === currentIdx ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{currentMessage}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex('left')}>LEFT</button>
        <button id="up" onClick={() => getNextIndex('up')}>UP</button>
        <button id="right" onClick={() => getNextIndex('right')}>RIGHT</button>
        <button id="down" onClick={() => getNextIndex('down')}>DOWN</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={handleChange} value={emailInputValue}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
