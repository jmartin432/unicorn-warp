import React from 'react';
import './ControlBoard.css';
import Animation from "./Animation";
import SpatialGrid from './SpatialGrid'
// import crabNebula from "./static/crabNebula.jpg";
// import helixNebula from "./static/helixNebula.jpg";
// import lagoonNebula from "./static/lagoonNebula.jpg";
// import pacmanNebula from "./static/pacmanNebula.jpg";

class ControlBoard extends React.Component {

    constructor(props) {
        super(props);
        this.onMenu = null
        this.updateFlockParams = this.updateFlockParams.bind(this)
        this.handleStartStop = this.handleStartStop.bind(this)
        this.handlePlayPause = this.handlePlayPause.bind(this)
        this.dropMenu = this.dropMenu.bind(this)
        this.state = {
            //spatialGrid: new SpatialGrid(10, 10, this.props.width, this.props.height),
            spatialGrid: new SpatialGrid(10, 10),
            flockParams: {
                alignmentRadius: 50,
                alignmentWeight: .5,
                avoidanceRadius: 50,
                avoidanceWeight: .5,
                cohesionRadius: 50,
                cohesionWeight: .5,
                wiggle: .5
            },
            started: false,
            playing: false,

            // not being used currently
            imageArray: ['crabNebula', 'helixNebula', 'lagoonNebula', 'pacmanNebula'],
            backgroundImageIndex: Math.floor(Math.random() * 4)
        }
    }

    componentDidMount() {
        console.log('rendering control board')
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
    }

    componentWillUnmount () {}

    updateFlockParams = (event) => {
        let id = event.currentTarget.id
        let flockParams = this.state.flockParams
        switch(id) {
            case 'alignment-radius-slider':
                flockParams.alignmentRadius = parseFloat(event.target.value)
                this.setState({flockParams});
                break;
            case 'alignment-weight-slider':
                flockParams.alignmentWeight = parseFloat(event.target.value)
                this.setState({flockParams});
                break;
            case 'avoidance-radius-slider':
                flockParams.avoidanceRadius = parseFloat(event.target.value)
                this.setState({flockParams});
                break;
            case 'avoidance-weight-slider':
                flockParams.avoidanceWeight = parseFloat(event.target.value)
                this.setState({flockParams});
                break;
            case 'cohesion-radius-slider':
                flockParams.cohesionRadius = parseFloat(event.target.value)
                this.setState({flockParams});
                break;
            case 'cohesion-weight-slider':
                flockParams.cohesionWeight = parseFloat(event.target.value)
                this.setState({flockParams});
                break;
            case 'wiggle-slider':
                flockParams.wiggle = parseFloat(event.target.value)
                this.setState({flockParams});
                break;
            default:
                this.setState({flockParams});
        }
    }

    handleMouseMove = (event) => {
        if (this.onMenu) return;
    }

    handleMouseDown = (event) => {
        if (this.onMenu) return;
    }

    handleMouseUp = (event) => {
    }

    activateMenu (event) {
        // this.onMenu = (event.type === "mouseover")
    }

    menuDragStart(event) {
        let target = event.currentTarget
        let style = window.getComputedStyle(event.target, null);
        let id = target.id
        let mouseX = event.pageX
        let mouseY = event.pageY
        let offsetX = event.clientX - parseInt(style.getPropertyValue("left").replace('px', ''))
        let offsetY = event.clientY - parseInt(style.getPropertyValue("top").replace('px', ''))
        let data = (id + ',' + mouseX + ',' + mouseY + ',' + offsetX + ',' + offsetY)
        event.dataTransfer.setData("text/plain", data)
    }

    menuDragEnd (event) {
    }
    //
    allowDropMenu(event) {
        event.preventDefault()
    }

    clampValue = (val, min, max) => {
        return val > max ? max : val < min ? min : val;
    }

    dropMenu(event) {
        let data = event.dataTransfer.getData("text/plain").split(',');
        let menu = document.getElementById(data[0])
        menu.style.left = this.clampValue(event.pageX - parseInt(data[3]), 0, this.props.width - 200) + 'px'
        menu.style.top = this.clampValue(event.pageY - parseInt(data[4]), 0, this.props.height - 50) + 'px'
        event.preventDefault()
    }

    updateDraggability(event, id, status) {
        let menu = document.getElementById(id)
        menu.setAttribute('draggable', status)
    }

    handleStartStop(event) {
        let started = this.state.started
        if(!started){
            this.setState({started: true, playing: true})
        } else {
            this.setState({started: false})
        }
    }

    handlePlayPause(event) {
        this.setState({playing: !this.state.playing})
    }

    render() {
        return (
            <div id={"control-board"} draggable={false} onDragOver={this.allowDropMenu}
                 onDrop={this.dropMenu} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}
                 onMouseMove={this.handleMouseMove}>
                 <div className={"menu"} id={"flock-menu"} draggable={true} onDragStart={this.menuDragStart}
                    onDragEnd={this.menuDragEnd} onMouseOver={this.activateMenu} onMouseOut={this.activateMenu}>
                    <h1 className={"menu-header"} id={"flock-menu-header"}>Controls</h1>
                    <div className={"menu-content"} id={"flock-menu-content"}>
                        <div className={"menu-buttons"} id={"flock-menu-buttons"}>
                            <button className={"menu-button"} id={"start-stop-button"}
                                    onClick={this.handleStartStop}>{ (this.state.started ? "Stop" : "Start") }</button>
                            <button className={"menu-button"} id={"play-pause-button"}
                                    onClick={this.handlePlayPause} disabled={!this.state.started}>{ (this.state.playing ? "Pause" : "Play") }</button>
                        </div>
                        <div className={"menu-sliders"} id={"flock-menu-sliders"}>
                            <p>Alignment Radius: {this.state.flockParams.alignmentRadius}</p>
                            <input type="range" min="1" max="100" step="1" defaultValue={this.state.flockParams.alignmentRadius}
                                   className="menu-slider" id="alignment-radius-slider"
                                   onMouseEnter={(event) => this.updateDraggability(event, "flock-menu", false)}
                                   onMouseLeave={(event) => this.updateDraggability(event, "flock-menu", true)}
                                   onChange={this.updateFlockParams} />
                            <p>Alignment Weight: {this.state.flockParams.alignmentWeight}</p>
                            <input type="range" min="0" max="1" step=".01" defaultValue={this.state.flockParams.alignmentWeight}
                                   className="menu-slider" id="alignment-weight-slider"
                                   onMouseEnter={(event) => this.updateDraggability(event, "flock-menu", false)}
                                   onMouseLeave={(event) => this.updateDraggability(event, "flock-menu", true)}
                                   onChange={this.updateFlockParams} />
                            <p>Avoidance Radius: {this.state.flockParams.avoidanceRadius}</p>
                            <input type="range" min="1" max="100" step="1" defaultValue={this.state.flockParams.avoidanceRadius}
                                   className="menu-slider" id="avoidance-radius-slider"
                                   onMouseEnter={(event) => this.updateDraggability(event, "flock-menu", false)}
                                   onMouseLeave={(event) => this.updateDraggability(event, "flock-menu", true)}
                                   onChange={this.updateFlockParams} />
                            <p>Avoidance Weight: {this.state.flockParams.avoidanceWeight}</p>
                            <input type="range" min="0" max="1" step=".01" defaultValue={this.state.flockParams.avoidanceWeight}
                                   className="menu-slider" id="avoidance-weight-slider"
                                   onMouseEnter={(event) => this.updateDraggability(event, "flock-menu", false)}
                                   onMouseLeave={(event) => this.updateDraggability(event, "flock-menu", true)}
                                   onChange={this.updateFlockParams} />
                            <p>Cohesion Radius: {this.state.flockParams.cohesionRadius}</p>
                            <input type="range" min="1" max="100" step="1" defaultValue={this.state.flockParams.cohesionRadius}
                                   className="menu-slider" id="cohesion-radius-slider"
                                   onMouseEnter={(event) => this.updateDraggability(event, "flock-menu", false)}
                                   onMouseLeave={(event) => this.updateDraggability(event, "flock-menu", true)}
                                   onChange={this.updateFlockParams} />
                            <p>Cohesion Weight: {this.state.flockParams.cohesionWeight}</p>
                            <input type="range" min="0" max="1" step=".01" defaultValue={this.state.flockParams.cohesionWeight}
                                   className="menu-slider" id="cohesion-weight-slider"
                                   onMouseEnter={(event) => this.updateDraggability(event, "flock-menu", false)}
                                   onMouseLeave={(event) => this.updateDraggability(event, "flock-menu", true)}
                                   onChange={this.updateFlockParams} />
                           <p>Wiggle: {this.state.flockParams.wiggle}</p>
                           <input type="range" min="0" max="1" step=".01" defaultValue={this.state.flockParams.wiggle}
                                   className="menu-slider" id="wiggle-slider"
                                   onMouseEnter={(event) => this.updateDraggability(event, "flock-menu", false)}
                                   onMouseLeave={(event) => this.updateDraggability(event, "flock-menu", true)}
                                   onChange={this.updateFlockParams} />
                        </div>
                    </div>
                </div>
                <Animation
                    width={this.props.width}
                    height={this.props.height}
                    binWidth={this.props.width / 10.0}
                    binHeight={this.props.height / 10.0}
                    spatialGrid={this.state.spatialGrid}
                    alignmentRadius={this.state.flockParams.alignmentRadius}
                    alignmentWeight={this.state.flockParams.alignmentWeight}
                    avoidanceRadius={this.state.flockParams.avoidanceRadius}
                    avoidanceWeight={this.state.flockParams.avoidanceWeight}
                    cohesionRadius={this.state.flockParams.cohesionRadius}
                    cohesionWeight={this.state.flockParams.cohesionWeight}
                    wiggle={this.state.flockParams.wiggle}
                    started={this.state.started}
                    playing={this.state.playing}
                />
            </div>
        )
    }
}

export default ControlBoard;
