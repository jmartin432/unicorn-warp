import React from 'react';
import './App.css';
import ControlBoard from './ControlBoard';

class App extends React.Component{

    constructor(props){
        super(props)
        this.updateBoardDimensions = this.updateBoardDimensions.bind(this);
        this.state = {
            windowDims: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
    }

    componentDidMount () {
        window.addEventListener('resize', this.updateBoardDimensions);
        this.updateBoardDimensions();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    updateBoardDimensions = (event) => {
        console.log(window.innerWidth, window.innerHeight)
        this.setState({ windowDims: {width: window.innerWidth, height: window.innerHeight }});
    }

    render() {
        return (
            <div>
                <ControlBoard
                    width={this.state.windowDims.width}
                    height={this.state.windowDims.height}
                />
            </div>
        )
    }
}

export default App;