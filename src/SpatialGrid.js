class SpatialGrid {

    constructor(rows = 2, columns = 2, width, height) {
        this._rows = rows;
        this._columns = columns;
        this._cellMap = this.makeMap(rows, columns);
        this._clamp = (num, min, max) => {
            return Math.min(Math.max(num, min), max)
        }
    }

    get rows() {
       return this._rows
    }

    get columns() {
        return this._columns
    }

    addToCell(entity) {
        let key = entity.gridKey
        let cell = this._cellMap.get(key)
        // if (entity.id === 0){
        //     console.log('adding to cell ', entity.id, key, cell)
        //     alert()
        // }
        cell.push(entity.id)
        this._cellMap.set(key, cell.sort((a, b) => a - b))
        // if (entity.id === 0){
        //     console.log('added to cell ', entity.id, key, cell)
        //     console.log('current grid ', this._cellMap)
        //     alert()
        // }
    }

    removeFromCell(entity) {
        let key = entity.gridKey
        let cell = this._cellMap.get(key)
        this._cellMap.set(key, cell.filter(id => id !== entity.id))
    }

    getLocalCells(position, radius, width, height) {
        let cells = []
        let leftLimit = this._clamp(Math.floor(10 * (position.x - radius) / width) + 1, 1, this._columns);
        let rightLimit = this._clamp(Math.floor(10 * (position.x + radius) / width) + 1, 1, this._columns);
        let upLimit = this._clamp(Math.floor(10 * (position.y - radius) / height) + 1, 1, this._rows);
        let downLimit = this._clamp(Math.floor(10 * (position.y + radius) / height) + 1, 1, this._rows);
        for (let i = leftLimit; i <= rightLimit; i++){
            for (let j = upLimit; j <= downLimit; j++){
                cells.push(i.toString() + '.' + j.toString())
            }
        }
        return cells
    }

    getCellEntities(key){
        return this._cellMap.get(key)
    }

    getKey(position, width, height) {
        // console.log('getting key')
        // console.log(position, width, height)
        if (position.x < 0 || position.x > width
            || position.y < 0 || position.y > height) {
            return 'none'
        }
        let x = Math.floor(10 * position.x / width) + 1;
        let y = Math.floor(10 * position.y / height) + 1;
        // console.log(x,y)
        return x.toString() + '.' + y.toString()
    }

    makeMap(r, c) {
        let m = new Map()
        m.set('none', [])
        for (let i = 1; i <= r; i++){
            for (let j = 1; j <= c; j++) {
                let key = i.toString() + '.' + j.toString()
                m.set(key, [])
            }
        }
    return m;
  }
}

export default SpatialGrid;