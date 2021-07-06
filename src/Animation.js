import React from 'react';
import Unicorn from "./Unicorn";
import Vector from './Vector'
import _ from 'lodash'

class Animation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flockSize: 100,
            flock: this.createUnicorns(100),
            tick: 0,
            playing: true
        }
        this.updateAnimationState = this.updateAnimationState.bind(this);
        this.handleMouse = this.handleMouse.bind(this);
        this.checkBounds = this.checkBounds.bind(this);
        this.cloneObject = this.cloneObject.bind(this);
        this.createUnicorns = this.createUnicorns.bind(this);
    }

    componentDidMount() {
        this.rAF = requestAnimationFrame(this.updateAnimationState);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getRandomVelocity(angle) {
        return new Vector(Math.cos(angle), Math.sin(angle))
    }

    createUnicorns(size) {
        let flock = []
        for (let i = 0; i < size; i++) {
            flock.push(new Unicorn(i,
                "m20,0l-20,10l-10,-10l10,-10l20,10",
                2, new Vector(this.getRandomInt(this.props.width), this.getRandomInt(this.props.height)),
                this.getRandomVelocity(this.getRandomInt(360)),
                (Math.random() * .3 + .7),
                1,
                '#00ff00'))
        }
        return flock
    }

    async checkBounds(position, velocity) {
        if (position.x + velocity.x < 0 && velocity.x < 0) velocity.x *= -1
        if (position.x + velocity.x > this.props.width && velocity.x > 0) velocity.x *= -1
        if (position.y + velocity.y < 0 && velocity.y < 0) velocity.y *= -1
        if (position.y + velocity.y > this.props.height && velocity.y > 0) velocity.y *= -1
        return new Vector(velocity.x, velocity.y)
    }

    async updateAcceleration(agent, flock) {
        //first get new target velocity based on neighbors.
        // then check bounds, change target velocity if needed
        // then find difference between current and target and divide between 10 this is iacceleration
        return await this.cloneObject(agent.velocity)
            // .then get new targetVelocity from neighbors
            .then(tv => {
                return this.checkBounds(agent.position, tv)
            })
            .then(tv => {
                let acceleration = new Vector(0, 0)
                if (tv !== agent.velocity) {
                    acceleration = Vector.difference(tv, agent.velocity).scaleBy(.1)
                }
                agent.acceleration = acceleration
                return acceleration
            })
    }

    async updateVelocity(agent, acceleration) {
        let velocity = Vector.add(agent.velocity, acceleration)
        agent.velocity = new Vector(velocity.x, velocity.y)
        return velocity
    }

    async updatePosition(agent, velocity) {
        let position = Vector.add(agent.position, velocity)
        agent.position = position
    }

    async updateFlock(flock) {
        for (let i = 0; i < flock.length; i++) {
            if (flock[i].id % 10 === this.state.tick % 10) {
                await this.updateAcceleration(flock[i], flock)
                    .then(acceleration => {
                        return this.updateVelocity(flock[i], acceleration)
                    })
                    .then((velocity) => {
                        this.updatePosition(flock[i], velocity)
                    })
            } else {
                await this.updateVelocity(flock[i], flock[i].acceleration)
                .then((velocity) => {
                    this.updatePosition(flock[i], velocity)})
            }
        }
        return flock
    }

    async cloneObject(object) {
        return _.cloneDeep(object);
    }

    async updateAnimationState() {
        let flock = await this.cloneObject(this.state.flock)
        let tick = this.state.tick
        flock = await this.updateFlock(flock)
        tick += 1
        this.setState({flock: flock, tick: tick})
        if (this.state.playing)
            this.rAF = requestAnimationFrame(this.updateAnimationState)
        else
            cancelAnimationFrame(this.rAF)
    }

    handleMouse(event) {
        let playing = this.state.playing
        if (playing)
            this.setState({ playing: false })
        else
            this.setState({ playing: true })
            requestAnimationFrame(this.updateAnimationState)
    }

    render() {
        return (
            <div id="canvas-container" onMouseDown={this.handleMouse}>
                <svg id="flock-canvas" width={this.props.width} height={this.props.height} ref={this.canvasRef}>
                    {this.state.flock.map((agent) => <path d={agent.pathString} transform={agent.transformString}
                                                           stroke="black" strokeWidth={"1"}
                                                           fill={agent.color} fillOpacity={"1"}/>)}
                </svg>
            </div>
        )
    }
}

export default Animation;
