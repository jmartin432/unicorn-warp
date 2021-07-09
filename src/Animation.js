import React from 'react';
import Unicorn from "./Unicorn";
import Vector from './Vector'
import _ from 'lodash'

class Animation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flockSize: 100,
            flock: [],
            tick: 0,
        }
        this.updateAnimationState = this.updateAnimationState.bind(this);
        this.handleMouse = this.handleMouse.bind(this);
        this.checkBounds = this.checkBounds.bind(this);
        this.cloneObject = this.cloneObject.bind(this);
        this.createUnicorns = this.createUnicorns.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.started === false && this.props.started === true){
            console.log('initialize flock and animation')
            this.setState({flock: this.createUnicorns(this.state.flockSize), tick: 0, stopping: false})
            requestAnimationFrame(this.updateAnimationState);
        }
        if (prevProps.started === true && this.props.started === false){
            console.log('shutting down flock')
        }
        if (prevProps.playing === false && this.props.playing === true){
            console.log('resuming play')
            this.rAF = requestAnimationFrame(this.updateAnimationState);
        }
        if (prevProps.playing === true && this.props.playing === false){
            console.log('pausing')
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
    }

    getRandomInt(start,range) {
        return Math.floor(Math.random() * range) + start;
    }

    createUnicorns(size) {
        let flock = []
        for (let i = 0; i < size; i++) {
            let randomAngle = this.getRandomInt(0,360)
            flock.push(new Unicorn(
                i,
                "m20,0l-20,10l-10,-10l10,-10l20,10",
                0,
                new Vector(this.getRandomInt(0, this.props.width), this.getRandomInt(0, this.props.height)),
                Vector.vectorFromAngle(randomAngle).round(5),
                Vector.vectorFromAngle(randomAngle).round(5),
                new Vector(0, 0),
                this.getRandomInt(700, 300) / 1000,
                this.getRandomInt(700, 300) / 1000,
                '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
                '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
            ))
        }
        return flock
    }

    async resetAgent(agent) {
        agent.acceleration.reset()
        agent.targetVelocity = agent.velocity.copy()
        agent.alignNeighbors = []
        agent.avoidNeighbors = []
        agent.cohereNeighbors = []
        return agent
    }

    async updateAge(agent) {
        if (!this.props.started) {
            agent.age += -4
        } else {
            agent.age = (agent.age < 100) ? agent.age + 2 : 100
        }
        return agent
    }

    async getNeighborsAndTargetVelocity(agent, flock) {
        let alignRadiusSqrd = this.props.alignmentRadius * this.props.alignmentRadius
        let avoidRadiusSqrd = this.props.avoidanceRadius * this.props.avoidanceRadius
        let cohereRadiusSqrd = this.props.cohesionRadius * this.props.cohesionRadius
        let neighborVelocities = []
        let avoidVectors = []
        let neighborPositions = []
        for (let i = 0; i < flock.length; i++) {
            if (agent.id === i) continue
            // get alignment vectors (these are neighbor velocities)
            if (Vector.distanceSquared(agent.position, flock[i].position) < alignRadiusSqrd) {
                agent.alignNeighbors.push(flock[i])
                neighborVelocities.push(flock[i].velocity)
            }

            // get avoid vectors (the difference between avoid radius and neighbor position)
            if (Vector.distanceSquared(agent.position, flock[i].position) < avoidRadiusSqrd) {
                agent.avoidNeighbors.push(flock[i])
                let vectorToNeighbor = Vector.difference(flock[i].position, agent.position)
                let vectorToRadius = vectorToNeighbor.copy().lengthen(this.props.avoidanceRadius)
                let avoidVector = Vector.difference(vectorToNeighbor, vectorToRadius)
                avoidVectors.push(avoidVector)
            }
            // get cohere vectors (these are neighbor positions)
            if (Vector.distanceSquared(agent.position, flock[i].position) < cohereRadiusSqrd) {
                agent.cohereNeighbors.push(flock[i])
                neighborPositions.push(flock[i].position)
            }
        }

        // calculate align vector
        let averageNeighborVelocity = new Vector(0, 0)
        if (neighborVelocities.length !== 0)
            averageNeighborVelocity = Vector.average(neighborVelocities).normalize();
        let scaledAlignVector = averageNeighborVelocity.scaleBy(this.props.alignmentWeight)

        // calculate avoid Vector
        let totalAvoidVectors = new Vector (0, 0)
        if (avoidVectors.length !== 0) {
            totalAvoidVectors = Vector.sum(avoidVectors).normalize()
        }
        let scaledAvoidVector = totalAvoidVectors.scaleBy(this.props.avoidanceWeight)
        if(avoidVectors.length >0) {
        }

        // calculate cohere vector
        let velocityToCenter = new Vector(0, 0)
        if (neighborPositions.length !== 0) {
            let neighborsCenter = Vector.average(neighborPositions)
            velocityToCenter = Vector.difference(neighborsCenter, agent.position).normalize()
        }
        let scaledCohereVector = (velocityToCenter) ? velocityToCenter.scaleBy(this.props.cohesionWeight) : null

        agent.targetVelocity = Vector.sum([scaledAlignVector, scaledAvoidVector, scaledCohereVector]).normalize().round(5)
        if (agent.targetVelocity.magnitude() <= .00000001) {
            agent.targetVelocity = agent.velocity.copy().normalize().round(5)
        }
        let wiggle = Vector.vectorFromAngle(this.getRandomInt(0, 360)).scaleBy(this.props.wiggle).round(5)
        agent.targetVelocity.add(wiggle).normalize().round(5)
        // scale by speed factor (Hard to tell if this is doing anything)
        agent.targetVelocity.scaleBy(agent.speedFactor)

        return agent
    }

    async checkBounds(agent) {
        if (agent.position.x + agent.targetVelocity.x < 0 && agent.targetVelocity.x < 0) agent.targetVelocity.x *= -1
        if (agent.position.x + agent.targetVelocity.x > this.props.width && agent.targetVelocity.x > 0) agent.targetVelocity.x *= -1
        if (agent.position.y + agent.targetVelocity.y < 0 && agent.targetVelocity.y < 0) agent.targetVelocity.y *= -1
        if (agent.position.y + agent.targetVelocity.y > this.props.height && agent.targetVelocity.y > 0) agent.targetVelocity.y *= -1
        return agent
    }

    async updateAcceleration(agent) {
        agent.acceleration = Vector.difference(agent.targetVelocity, agent.velocity).scaleBy(.1).round(5)
        return agent
    }

    async updateVelocity(agent) {
        agent.velocity.add(agent.acceleration).round(5)
        return agent
    }

    async updatePosition(agent) {
        agent.position.add(agent.velocity).round(5)
        return agent
    }

    async updateFlock(flock) {
        for (let i = 0; i < flock.length; i++) {
            if (flock[i].id % 10 === this.state.tick % 10) {
                await this.resetAgent(flock[i])
                .then (agent => this.updateAge(agent))
                .then (agent => this.getNeighborsAndTargetVelocity(agent, flock))
                .then (agent => this.checkBounds(agent))
                .then (agent => this.updateAcceleration(agent))
                .then (agent => this.updateVelocity(agent))
                .then (agent => this.updatePosition(agent))
                .catch(error => {
                    console.log(error)
                    console.log('error agent:', flock[i])
                })
            } else {
                flock[i] = await this.updateVelocity(flock[i])
                .then((agent) => this.updatePosition(agent))
                .catch(error => {
                    console.log(error)
                    console.log('error agent:', flock[i])
                })
            }
        }
        //return flock
        return flock.filter(agent => agent.age >= 0)
    }

    async cloneObject(object) {
        return _.cloneDeep(object);
    }

    async updateAnimationState() {
        let tick = this.state.tick
        await this.cloneObject(this.state.flock)
            .then(flock => {
                return this.updateFlock(flock)
            })
            .then(flock => {
                tick += 1
                this.setState({flock: flock, tick: tick})
                if (this.props.playing) {
                    this.rAF = requestAnimationFrame(this.updateAnimationState)
                } else {
                    cancelAnimationFrame(this.rAF)
                }
                if (this.state.flock.length === 0) {
                    console.log('flock is empty')
                    cancelAnimationFrame(this.rAF)
                }
            })
    }

    handleMouse(event) {
        console.log(this.state.tick)
        console.log(this.state.flock)
        console.log(this.rAF)
    }

    render() {
        return (
            <div id="canvas-container" onMouseDown={this.handleMouse}>
                <svg id="flock-canvas" width={this.props.width} height={this.props.height} ref={this.canvasRef}>
                    {this.state.flock.map((agent) => <radialGradient key={agent.id} id={"gradient" + agent.id} fx={"25%"}>
                        <stop offset="0%" style={{'stopColor':agent.color1,'stopOpacity':1}} />
                        <stop offset="100%" style={{'stopColor':agent.color2,'stopOpacity':1}} />
                    </radialGradient>)}
                    {this.state.flock.map((agent) => <path key={agent.id} id={"agent" + agent.id} d={agent.pathString} transform={agent.transformString}
                                                           stroke="black" strokeWidth={"1"}
                                                           fill={agent.gradientId}/>)}
                                                           {/*fill={agent.color1}/>)}*/}
                                                           {/*fill={agent.color} fillOpacity={"1"}/>)}*/}
                </svg>
            </div>
        )
    }
}

export default Animation;
