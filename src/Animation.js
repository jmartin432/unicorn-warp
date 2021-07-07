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

    getVelocityFromAngle(angle) {
        return new Vector(Math.cos(angle), Math.sin(angle))
    }

    createUnicorns(size) {
        let flock = []
        for (let i = 0; i < size; i++) {
            let randomAngle = this.getRandomInt(360)
            flock.push(new Unicorn(
                i,
                "m20,0l-20,10l-10,-10l10,-10l20,10",
                2,
                new Vector(this.getRandomInt(this.props.width), this.getRandomInt(this.props.height)),
                this.getVelocityFromAngle(randomAngle),
                this.getVelocityFromAngle(randomAngle),
                Math.random() * .3 + .7,
                1,
                '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
                '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
            ))
        }
        return flock
    }

    async resetAgent(agent) {
        agent.acceleration = new Vector(0,0)
        agent.targetVelocity = new Vector(agent.velocity.x, agent.velocity.y)
        agent.alignNeighbors = []
        agent.avoidNeighbors = []
        agent.cohereNeighbors = []
        return agent
    }

    async getNeighborsAndTargetVelocity(agent, flock) {
        let alignRadiusSqrd = this.props.alignmentRadius * this.props.alignmentRadius
        let avoidRadiusSqrd = this.props.avoidanceRadius * this.props.avoidanceRadius
        let cohereRadiusSqrd = this.props.cohesionRadius * this.props.cohesionRadius
        let alignVectors = []
        let avoidVectors = []
        let cohereVectors = []
        for (let i = 0; i < flock.length; i++) {
            if (agent.id === i) continue
            if (Vector.distanceSquared(agent.position, flock[i].position) < alignRadiusSqrd) {
                agent.alignNeighbors.push(flock[i])
                alignVectors.push(flock[i].velocity)
            }
            if (Vector.distanceSquared(agent.position, flock[i].position) < avoidRadiusSqrd) {
                agent.avoidNeighbors.push(flock[i])
                let vectorToNeighbor = Vector.difference(flock[i].position, agent.position)

            //    ???????
                avoidVectors.push(Vector.difference(vectorToNeighbor, vectorToNeighbor.lengthen(this.props.avoidanceRadius)))
            }
            if (Vector.distanceSquared(agent.position, flock[i].position) < cohereRadiusSqrd) {
                agent.cohereNeighbors.push(flock[i])
                //  get velocity should be the vector to the center not the cnter itself
                cohereVectors.push(flock[i].position)
            }
        }
        let alignVector = (alignVectors.length !== 0) ? Vector.average(alignVectors) : null
        // ?????
        let avoidVector = (avoidVectors.length !== 0) ? Vector.average(avoidVectors) : null
        // ????
        let cohereVector = (cohereVectors.length !== 0)
            ? Vector.difference(Vector.average(cohereVectors), agent.position)
            : null

        let scaledAlignVector = (alignVector) ? alignVector.scaleBy(this.props.alignmentWeight) : null
        let scaledAvoidVector = (avoidVector) ? avoidVector.scaleBy(this.props.avoidanceWeight) : null
        let scaledCohereVector = (cohereVector) ? cohereVector.scaleBy(this.props.cohesionWeight) : null

        let nonNullVectors = [scaledAlignVector, scaledAvoidVector, scaledCohereVector].filter(Boolean)
        if (nonNullVectors.length > 0) agent.targetVelocity = Vector.average(nonNullVectors)

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
        if (!agent.targetVelocity.equals(agent.velocity)) {
            agent.acceleration = Vector.difference(agent.targetVelocity, agent.velocity).scaleBy(.1)
        }
        return agent
    }

    async updateVelocity(agent) {
        agent.velocity = Vector.add(agent.velocity, agent.acceleration)
        return agent
    }

    async updatePosition(agent) {
        agent.position = Vector.add(agent.position, agent.velocity)
        return agent
    }

    async updateFlock(flock) {
        for (let i = 0; i < flock.length; i++) {
            if (flock[i].id % 10 === this.state.tick % 10) {
                await this.resetAgent(flock[i])
                .then (agent => this.getNeighborsAndTargetVelocity(agent, flock))
                .then (agent => this.checkBounds(agent))
                .then (agent => this.updateAcceleration(agent))
                .then (agent => this.updateVelocity(agent))
                .then (agent => this.updatePosition(agent))
            } else {
                flock[i] = await this.updateVelocity(flock[i])
                .then((agent) => this.updatePosition(agent))
            }
        }
        return flock
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
                if (this.state.playing) {
                    this.rAF = requestAnimationFrame(this.updateAnimationState)
                } else {
                    cancelAnimationFrame(this.rAF)
                }
            })
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
                    {this.state.flock.map((agent) => <radialGradient key={agent.id} id={"gradient" + agent.id} fx={"25%"}>
                        <stop offset="0%" style={{'stop-color':agent.color1,'stop-opacity':1}} />
                        <stop offset="100%" style={{'stop-color':agent.color2,'stop-opacity':1}} />
                    </radialGradient>)}
                    {this.state.flock.map((agent) => <path key={agent.id} d={agent.pathString} transform={agent.transformString}
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
