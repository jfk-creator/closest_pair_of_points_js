
class Point {
    x; y; r;
    constructor(x, y, r){
        this.x = x; 
        this.y = y;
        this.r = r;
    }

    static dist(a, b){
        return Math.hypot(a.x - b.x, a.y - b.y);  
    }
}

function create_random_points(canvasWidth, canvasHeight, n){
    const point_array = [];

    for(let i = 0; i < n; i++){
        const POINT_RADIUS = 8;
        const point = new Point(Math.random() * canvasWidth, Math.random() * canvasHeight, POINT_RADIUS);
        point_array.push(point);
    }

    return point_array;
}

function draw_points(p, point_array) {
    for(let i = 0; i < point_array.length; i++){
        const point = point_array[i];
        if(point){
            console.log(point)
            p.fill(229, 240, 244);
            p.noStroke();
            p.circle(point.x, point.y, point.r);
        }
    }
}

function brute_force(point_array){
    let min = Number.MAX_VALUE;
    let min_points = [];
    for(let i=0; i < point_array.length - 1; i++){
        let point_a = point_array[i];

        for(let k = i+1; k < point_array.length; k++){
            let point_b = point_array[k];
            let distance = Point.dist(point_a, point_b);

            if(min > distance){
                min = distance;
                min_points[0] = point_a;
                min_points[1] = point_b;
            }
        }
    }

    return { min: min, min_points: min_points };
}


let point_array = [];
function start(p, prop, n){
    if(p.frameCount == 1) point_array = create_random_points(prop.canvasWidth, prop.canvasHeight, n);
    draw_points(p, point_array);
    let {min_points} = brute_force(point_array);
    p.stroke(255);
    p.line(min_points[0].x, min_points[0].y, min_points[1].x, min_points[1].y);
}
