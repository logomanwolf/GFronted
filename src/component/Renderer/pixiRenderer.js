import * as d3 from "d3";
import * as PIXI from "pixi.js";
import Map2 from "./Map2";

const _SELECTED_ = "selected";
const _CLICKED_ = "clicked";
const _HOVERED_ = "hovered";
const _ORIGIN_ = "origin";

class ParticleRenderer {
    constructor(option) {
        this.option = option
        this.renderer = null
        this.stage = null
        this.dataMap = new Map()
        this.texture = null
        this.size = 1
        this.sizeScale = d3.scaleLog().domain([100, 1]).range([1, 10])
        this.color = 0xcccccc
        this.onClick = option.onClick
        this.onHover = option.onHover
        this.onHoverOut = option.onHoverOut
        this.clickedNodeIdList = []

        this.sequence = [_ORIGIN_, _CLICKED_, _SELECTED_, _HOVERED_]

        this.edges = new Map()
        this.hoveredNodes = new Map()
        this.selectedNodes = new Map()
        this.selectedEdges = new Map()

        this.textureMap = this.sequence.reduce((r, s) => {
            r[s] = null
            return r
        }, {})

        this.colorMap = {}
        this.colorMap[_ORIGIN_] = 0xcccccc
        this.colorMap[_CLICKED_] = 0x61afef
        this.colorMap[_SELECTED_] = 0xf59c20
        this.colorMap[_HOVERED_] = 0x56b6c2

        this.sizeMap = {}
        this.sizeMap[_ORIGIN_] = 1
        this.sizeMap[_CLICKED_] = 1.5
        this.sizeMap[_SELECTED_] = 1.5
        this.sizeMap[_HOVERED_] = 1.5

        this.nodes = {}
        this.nodes[_ORIGIN_] = new Map()
        this.nodes[_CLICKED_] = new Map()
        this.nodes[_SELECTED_] = new Map()
        this.nodes[_HOVERED_] = new Map()

        this.edges = {}
        this.edges[_ORIGIN_] = new Map2()
        this.edges[_CLICKED_] = new Map2()
        this.edges[_SELECTED_] = new Map2()
        this.edges[_HOVERED_] = new Map2()

        this.maskColor = 0xcccccc
        this.isMaskExit = false
        this.maskAlpha = 0.4
        this.maskTexture = null
        this.mask = null

        this.switch = true
    }

    generateSpriteByTexture(texture, id, x, y) {
        let p = new PIXI.Sprite(texture)
        p.x = x
        p.y = y
        p.anchor.set(0.5)
        p.interactive = true
        p.buttonMode = true
        p.id = id
        p.on('pointerover', (e) => {
            this.onHover(id, event)
        })
        p.on('pointerout', (e) => {
            this.onHoverOut(id, event)
        })
        p.on('pointerdown', (event) => {
            this.clickedNodeIdList.push(id)
            this.onClick(id, event)
        })
        return p
    }

    calculateEdgeTransform = (source, target) => {
        let dis = Math.sqrt(Math.pow(source.y - target.y, 2) + Math.pow(target.x -
            source.x, 2))
        let cos = (target.x - source.x) / dis
        let sin = (target.y - source.y) / dis
        return {
            x: source.x,
            y: source.y,
            scaleX: dis / 10,
            scaleY: 1,
            rotate: (sin < 0 ? -1 : 1) * Math.acos((target.x - source.x) / dis)
        }
    }

    generateEdgeSpriteByTexture = (texture, source, target) => {
        let p = new PIXI.Sprite(texture)
        let transform = this.calculateEdgeTransform(source, target)
        p.x = transform.x
        p.y = transform.y
        p.setTransform(p.x, p.y, transform.scaleX, transform.scaleY, transform.rotate)
        return p
    }

    generateMask = (x = 0, y = 0, width = this.option.width, height = this.option.height) => {
        let p = new PIXI.Sprite(this.maskTexture)
        p.x = x
        p.y = y
        p.setTransform(p.x, p.y, width / 10, height / 10, 0)
        return p
    }

    /**
     * 
     * @param {string | int} id 
     */
    getNode = id => {
        let node = this.dataMap.get(id) || this.dataMap.get("" + id) || this.dataMap.get(parseInt(id))
        if (!node) {
            console.log("%c PRender", "font-size:80px", id, this.dataMap)
        }
        return node
    }

    makeParticleGraphic(size, color) {
        const graphic = new PIXI.Graphics()
        graphic.lineStyle(size > 3 ? size / 5 : 0, 0xffffff)
        graphic.beginFill(color)
        graphic.drawCircle(0, 0, size > 1 ? size : 1)
        return graphic
    }

    makeEdgeGraphic(color) {
        let graphic = new PIXI.Graphics()
        graphic.beginFill(color, 1)
        graphic.drawRect(0, 0, 10, 1)
        return graphic
    }

    generateTexture(state, size) {
        return this.renderer.generateTexture(this.makeParticleGraphic(size, this.colorMap[state]))
    }

    makeMaskTexture = (color = this.maskColor, alpha = this.maskAlpha) => {
        let graphic = new PIXI.Graphics()
        graphic.beginFill(color, alpha)
        graphic.drawRect(0, 0, 10, 10)
        return graphic
    }

    reGenerateAllTexture = (size = this.size) => {
        Object.keys(this.colorMap).forEach(state => {
            this.textureMap[state] = this.generateTexture(state, size * this.sizeMap[state])
        })
        this.maskTexture = this.renderer.generateTexture(this.makeMaskTexture())
    }

    render() {
        let self = this
        let {
            container,
            data,
            xScaleFunc,
            yScaleFunc,
            width,
            height,
            level
        } = this.option

        data.forEach(element => {
            self.dataMap.set(element.id, element)
        })

        const canvas = container
            .select(".dashboard-chart1 canvas")
            .node()

        let rangeSize = d3.scaleLog().domain([100000, 100]).range([1, 10])
        let domain = [data.length / level[0], data.length / level[level.length - 1]]
        let range = [rangeSize(domain[0]), rangeSize(domain[1])]
        self.sizeScale = d3.scaleLog().domain(domain).range(range)
        self.size = self.sizeScale(data.length / level[0])

        const app = new PIXI.Application(width, height, {
            transparent: true,
            autoStart: false
        })

        const stage = self.stage = app.stage
        const renderer = self.renderer = app.renderer
        container.select(".dashboard-chart1").node().appendChild(app.view)

        self.reGenerateAllTexture()
        // let sprites = []
        data.forEach((element, i) => {
            let state = _ORIGIN_
            element.stateStack = [state]
            element.pixel = self.generateSpriteByTexture(self.textureMap[state], element.id, xScaleFunc(element.x), yScaleFunc(element.y))
            self.nodes[state].set(element.id, element)
            stage.addChild(element.pixel)
        })



        // stage.addChild(...sprites)

        renderer.render(stage)
    }

    zoom = (newXScaleFunc, newYScaleFunc, level, doNeedDataChange) => {
        let self = this
        self.size = self.sizeScale(self.option.data.length / level)

        if (doNeedDataChange) {
            self.reGenerateAllTexture()
            self.stage.removeChildren()
            self.sequence.forEach(state => {
                self.nodes[state].forEach(node => {
                    node.pixel = self.generateSpriteByTexture(self.textureMap[state], node.id, newXScaleFunc(node.x), newYScaleFunc(node.y))
                    self.stage.addChild(node.pixel)
                })
            })
        } else {
            self.sequence.forEach(state => {
                for (let element of self.nodes[state].values()) {
                    element.pixel.x = newXScaleFunc(element.x)
                    element.pixel.y = newYScaleFunc(element.y)
                }
            })
        }
        self.sequence.forEach(state => {
            self.reSetEdges(self.edges[state].values())
        })

        self.renderer.render(self.stage)
    }

    container() {
        return this.option.container.select(".dashboard-chart1 canvas")
    }

    /**
     * 
     * @param {Object Array} nodes
     */
    reSetNodes = (nodes) => {
        let self = this
        nodes.forEach(node => {
            if (node) {
                let x = node.pixel.x,
                    y = node.pixel.y
                let state = node.stateStack[node.stateStack.length - 1]
                node.pixel.destroy()
                node.pixel = self.generateSpriteByTexture(self.textureMap[state], node.id, x, y)
                self.stage.addChild(node.pixel)
                self.sequence.forEach(s => {
                    if (s != state) {
                        this.nodes[s].delete(node.id)
                    } else {
                        this.nodes[s].set(node.id, node)
                    }
                })
            }
        })
    }

    /**
     * 
     * @param {Object Array} edge
     */
    reSetEdges(edges) {
        let self = this
        edges.forEach(edge => {
            this.renderEdge(edge.source, edge.target, edge.state, true)
        })
    }

    renderEdge = (sourceId, targetId, state, batch = true) => {
        let self = this
        let color = self.colorMap[state]
        let source = self.getNode(sourceId).pixel,
            target = self.getNode(targetId).pixel,
            texture = self.renderer.generateTexture(this.makeEdgeGraphic(color))
        let hasEdge = this.edges[state].has([sourceId, targetId])
        if (hasEdge) {
            let existEdge = this.edges[state].get([sourceId, targetId])
            existEdge.sprite.destroy()
            this.edges[state].delete([sourceId, targetId])
        }
        let edgeSprite = self.generateEdgeSpriteByTexture(texture, source, target)
        self.stage.addChild(edgeSprite)
        if (!batch) {
            self.renderer.render(self.stage)
        }
        let edge = {
            state: state,
            source: sourceId,
            target: targetId,
            sprite: edgeSprite
        }
        self.edges[state].set([edge.source, edge.target], edge)
        return edge
    }

    setHovered = (nodes, edges, needClear = true) => {
        if (nodes.length == 0) {
            if (this.mask) {
                this.destroyMask()
            }
            this.renderWithState([...this.nodes[_SELECTED_].values()], this.edges[_SELECTED_].values(), _SELECTED_, needClear)
            this.renderWithState([...this.nodes[_CLICKED_].values()], this.edges[_CLICKED_].values(), _CLICKED_, needClear)
        }
        this.renderWithState(nodes, edges, _HOVERED_, needClear)
    }

    renderWithState(nodes, edges, state, needClear = true) {
        let self = this
        if (self.switch) {
            if (needClear) {
                self.nodes[state].forEach((node, id) => {
                    if (node) {
                        node.stateStack.pop()
                        self.reSetNodes([node])
                    }
                })

                self.edges[state].forEach((edge, id) => {
                    if (edge) {
                        edge.sprite.destroy()
                        self.edges[state].delete(id)
                    }
                })
                if (state == _HOVERED_ && nodes.length > 0) {
                    this.renderMask()
                }
            }
            edges.forEach(edge => {
                if (!self.edges[state].has([edge.source, edge.target])) {
                    edge.state = state
                }
            })

            nodes.forEach(node => {
                if (!self.nodes[state].has(node.id)) {
                    node.stateStack.push(state)
                }
            })

            self.reSetEdges(edges)
            self.reSetNodes(nodes)
            self.renderer.render(self.stage)
        }
    }

    renderMask = (x = 0, y = 0) => {
        this.mask = this.generateMask(x, y)
        this.isMaskExit = true
        this.stage.addChild(this.mask)
    }

    destroyMask = () => {
        this.isMaskExit = false
        this.mask.destroy()
        this.mask = null
        this.renderer.render(this.stage)
    }

    hasMask = () => this.isMaskExit

    off = () => {
        if (this.mask) {
            this.destroyMask()
        }
        this.renderMask()
        this.renderWithState([...this.nodes[_CLICKED_].values()], this.edges[_CLICKED_].values(), _CLICKED_)
        this.switch = false
    }

    on = () => {
        if (this.mask) {
            this.destroyMask()
        }
        this.switch = true
    }

    removeClickedByRegion(region) {
        let self = this
        self.removeClicked(self.getClickedNodesInRegion(region))
    }

    getClickedNodesInRegion(region){
        let self = this
        let isInRegion = (x, y, region) => x >= region[0][0] && y >= region[0][1] && x < region[1][0] && y < region[1][1]
        let newClickedNodes = []
        self.nodes[_CLICKED_].forEach(node => {
            if(!isInRegion(node.pixel.x, node.pixel.y, region)){
                newClickedNodes.push(node)
            }
        })
        
        return newClickedNodes
    }
}

export default ParticleRenderer