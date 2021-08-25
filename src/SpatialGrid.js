class SpatialGrid {

    constructor(rows = 2, columns = 2, width, height) {
        this._rows = rows;
        this._columns = columns;
        // this._width = width;
        // this._height = height;
        this._cellMap = this.makeMap(rows, columns);
    }

    // set width(width) {
    //     this._width = width
    // }
    //
    // set height(height) {
    //     this._height = height
    // }

    getCellIndex(entity, width, height) {
        if (entity.position.x < 0 || entity.position.x > width
            || entity.position.y < 0 || entity.position.y > height) {
            return '0.0'
        }
        let x = Math.floor(entity.position.x / width) + 1;
        let y = Math.floor(entity.position.y / height) + 1;
        return x.toString() + '.' + y.toString()
    }

    addToCell(entity) {
        let key = entity.gridKey
        let cell = this._cellMap.get(key)
        if (entity.id === 0){
            console.log('adding to cell ', entity.id, key, cell)
            alert()
        }
        cell.push(entity.id)
        this._cellMap.set(key, cell.sort((a, b) => a - b))
        if (entity.id === 0){
            console.log('added to cell ', entity.id, key, cell)
            console.log('current grid ', this._cellMap)
            alert()
        }

    }

    removeFromCell(entity) {
        let key = entity.gridKey
        let cell = this._cellMap.get(key)
        this._cellMap.set(key, cell.filter(id => id !== entity.id))
    }

    getKey(position, width, height) {
        // console.log('getting key')
        // console.log(position, width, height)
        if (position.x < 0 || position.x > width
            || position.y < 0 || position.y > height) {
            return '0.0'
        }
        let x = Math.floor(10 * position.x / width) + 1;
        let y = Math.floor(10 * position.y / height) + 1;
        // console.log(x,y)
        return x.toString() + '.' + y.toString()
    }

    makeMap(r, c) {
        let m = new Map()
        m.set('0.0', [])
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