import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

const gridArray = [
  [1,1], [2,1], [3,1],
  [1,2], [2,2], [3,2],
  [1,3], [2,3], [3,3]
];

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  state = {
    message: initialState.message,
    email: initialState.email,
    index: initialState.index,
    steps: initialState.steps,
  }


  setMessage = (str) => {
    this.setState({...this.state, message: str})
  }

  reset = () => {
    this.setState({
      ...this.state,
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    })
  }

  getNextIndex = (dir) => {
    if(dir === 'left'){
      gridArray[this.state.index][0] === 1 ? this.setMessage("You can't go left") : this.move(-1);
    }
    else if(dir === 'up'){
      gridArray[this.state.index][1] === 1 ? this.setMessage("You can't go up") : this.move(-3);
    }
    else if(dir === 'right'){
      gridArray[this.state.index][0] === 3 ? this.setMessage("You can't go right") : this.move(1);
    }
    else if(dir === 'down'){
      gridArray[this.state.index][1] === 3 ? this.setMessage("You can't go down") : this.move(3);
    }
  }

  move = (amt) => {
    this.setState({
      ...this.state, 
      steps: this.state.steps + 1, 
      index: this.state.index + amt,
      message: initialMessage
    });
  }

  handleChange = (evt) => {
    const {value} = evt.target;
    this.setState({...this.state, email: value});
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    axios.post('http://localhost:9000/api/result', 
      {'x': gridArray[this.state.index][0], 
      'y': gridArray[this.state.index][1], 
      'steps': this.state.steps, 
      'email': this.state.email})
      .then(res => {
        this.setMessage(res.data.message);
      })
      .catch(err => {
        this.setMessage(err.response.data.message);
      })
    this.setState({...this.state, email: initialEmail})
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({gridArray[this.state.index].toString()})</h3>
          <h3 id="steps">You moved {this.state.steps} time{this.state.steps === 1 ? '': 's'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.getNextIndex('left')}>LEFT</button>
          <button id="up" onClick={() => this.getNextIndex('up')}>UP</button>
          <button id="right" onClick={() => this.getNextIndex('right')}>RIGHT</button>
          <button id="down" onClick={() => this.getNextIndex('down')}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input 
            id="email" 
            type="email" 
            placeholder="type email" 
            value={this.state.email}
            onChange={this.handleChange}
          />
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
