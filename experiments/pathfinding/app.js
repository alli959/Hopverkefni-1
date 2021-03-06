


function Grid(width, height) {

    this.width = width;
    this.height = height;

    
    const grid = [];
    for (let i = 0; i < this.height; i += 1) {
        const row = [];
        for (let j = 0; j < this.width; j += 1) {
            row.push({});
        };
        grid.push(row);
    };

    this._grid = grid;
}

Grid.prototype.toString = function (path, undefinedMarker) {

    path = typeof path !== 'undefined' ? path : [];
    undefinedMarker = typeof undefinedMarker !== 'undefined' ? undefinedMarker : 'undefined';

    let msg = "";

    const grid = this._grid;

    for (let i = 0; i < this.height; i += 1) {
        for (let j = 0; j < this.width; j += 1) {
            let val = grid[i][j];
            for (let k = 0; k < path.length; k += 1) {
                val = val[path[k]];
            }
            if (typeof val !== 'undefined') {
                msg += val + "";
            } else {
                msg += undefinedMarker + "";
            }
        }
        msg += "\n";
    }

    return msg;
};

Grid.prototype.shortestPathGridString = function (sx, sy, dx, dy) {

    let msg = "";

    const grid = this._grid;

    for (let i = 0; i < this.height; i += 1) {
        for (let j = 0; j < this.width; j += 1) {
            let obj = grid[i][j];
            
            const parent = obj.parent;

            if (i === sy && j === sx) {
                msg += "s";
                continue;
            } else if (i === dy && j === dx) {
                msg += "d";
                continue;
            } else if (grid[i][j].obstruction) {
                msg += "█";
                continue;
            }

            if (!parent) {
                msg += ".";
            } else {
                const dx = parent.x - j;
                const dy = parent.y - i;

                if (dx < 0 && dy < 0) {
                    msg += "↖"
                } else if (dx < 0 && dy === 0) {
                    msg += "←";
                } else if (dx < 0 && dy > 0) {
                    msg += "↙";
                } else if (dx === 0 && dy > 0) {
                    msg += "↓";
                } else if (dx > 0 && dy > 0) {
                    msg += "↘";
                } else if (dx > 0 && dy === 0) {
                    msg += "→";
                } else if (dx > 0 && dy < 0) {
                    msg += "↗";
                } else if (dx === 0 && dy === 0) {
                    msg += ".";
                } else if (dx === 0 && dy < 0) {
                    msg += "↑";
                }
            }

            
        }
        msg += "\n";
    }

    return msg;
};




Grid.prototype.addNoise = function (p, n) {
    const grid = this._grid;

    for (let i = 0; i < this.height; i += 1) {
        for (let j = 0; j < this.width; j += 1) {
            if (Math.random() < p) {
                grid[i][j].obstruction = true;
            }
        }
    }
}

Grid.prototype.set = function (x, y, value) {
    if (x < 0 || x >= this.width) throw Error();
    if (y < 0 || y >= this.height) throw Error();
    this._grid[y][x] = value;
};

Grid.prototype.get = function (x, y) {
    if (x < 0 || x >= this.width) throw Error();
    if (y < 0 || y >= this.height) throw Error();
    return this._grid[y][x];
};

// from source to destination
Grid.prototype.carveShortestPath = function (sx, sy, dx, dy) {

    function hce(x1, y1, x2, y2) {
        return Math.sqrt(x1 * x2 + y1 * y2);
    }

    const start = { x: sx, y: sy };
    const goal = { x: dx, y: dy };

    //console.log("Start: ", start);
    //console.log("Goal: ", goal);

    const closedSet = new Set2D();

    // key is fScore
    const openPQ = new PriorityQueue();
    openPQ.setComparator((a, b) => a > b);

    //console.log("Open priority queue:", openPQ);

    //console.log(JSON.stringify(openPQ));

    //const gScore = Number.POSITIVE_INFINITY;

    // undefined should be treated as infinity

    // hce = heuristic cost estiamte

    this.get(start.x, start.y).gScore = 0;
    this.get(start.x, start.y).fScore = hce(start.x, start.y, goal.x, goal.y);

    openPQ.enqueue(
        this.get(start.x, start.y).fScore,
        start
    );

    //console.log("STARTING!");

    while (!openPQ.isEmpty()) {
        // key value, current
        //console.log(">> Before dequeueing: " + JSON.stringify(openPQ));
        const c = openPQ.dequeue();
        //console.log(">> After dequeueing: " + JSON.stringify(openPQ));
        //console.log(">> Current node: ", JSON.stringify(c));

        if (c.x === goal.x && c.y === goal.y) {
            // console.log("-------------- DONE! --------------");
            return true;
        }

        this.get(c.x, c.y).closed = true;

        // Iterate neighbours
        for (let dy = -1; dy <= 1; dy += 1) {
            for (let dx = -1; dx <= 1; dx += 1) {
                
                // Neighbour
                const nx = c.x + dx;
                const ny = c.y + dy;
                //console.log(">>> Neighbour: " + nx + ", " + ny);

                if (nx < 0 || nx >= this.width) {
                    // console.log("!!!! OUT OF WIDTH BOUNDS");
                    continue;
                }
                if (ny < 0 || ny >= this.height) {
                    //console.log("!!!! OUT OF HEIGHT BOUNDS");
                    continue;
                }

                if (dx === 0 && dy === 0) {
                    //console.log("!!!! DON'T COMPARE WITH SELF");
                    continue;
                }

                if (this.get(nx, ny).closed === true) {
                    //console.log("!!!! IS CLOSED");
                    continue;
                }

                if (this.get(nx, ny).obstruction) {
                    continue;
                }

                // ADD nx, ny to openPQ

                // const dist between current and neighbour
                const dist = Math.sqrt(c.x * nx + c.y * ny);

                const tentative_gScore = this.get(c.x, c.y).gScore + dist;

                const otgs = this.get(nx, ny).gScore;

                //console.log(">>>> Tentative score: " + tentative_gScore);
                //console.log(">>>> Current score: " + this.get(nx, ny).gScore);
                
                if (typeof otgs !== 'undefined') {
                    if (tentative_gScore >= otgs) {
                        // Not a better path
                        //console.log("!!!! WORSE PATH");
                        continue;
                    }
                }

                this.get(nx, ny).gScore = tentative_gScore;
                this.get(nx, ny).fScore = tentative_gScore + hce(nx, ny, goal.x, goal.y);

                //console.log("To enqueue",  this.get(nx, ny).fScore,{ x: nx, y: ny });

                this.get(nx, ny).parent = {
                    x: c.x,
                    y: c.y
                };

                //console.log(">>>>>> Before enqueueing: ", JSON.stringify(openPQ));
                openPQ.enqueue(
                    this.get(nx, ny).fScore,
                    { x: nx, y: ny }
                );

                //console.log("After enqueueing: ", JSON.stringify(openPQ));
            }
        }
    }

    return false;

};


/*
const grid = new Grid(100, 100);

const sx = Math.floor(Math.random() * grid.width);
const sy = Math.floor(Math.random() * grid.height);

const dx = Math.floor(Math.random() * grid.width);
const dy = Math.floor(Math.random() * grid.height);

grid.addNoise(0.25);

//grid.carveShortestPath(sx, sy, dx, dy);


// console.log(grid.shortestPathGridString(sx, sy, dx, dy));
*/
