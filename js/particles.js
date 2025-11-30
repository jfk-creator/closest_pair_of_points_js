
class Point {
    x; y; r; vx; vy;
    constructor(x, y, vx, vy, r){
        this.x = x; 
        this.y = y;
        this.r = r;
        this.vx = vx; 
        this.vy = vy;
    }

    static dist(a, b){
        const min = Math.hypot(a.x - b.x, a.y - b.y); 
        const min_points = [a,b];
        return { min: min, min_points: min_points };
    }
}

function create_random_points(canvasWidth, canvasHeight, n){
    const point_array = [];

    for(let i = 0; i < n; i++){
        const POINT_RADIUS = 8;
        let random = Math.random();
        const vx = random > 0.5 ? (-1 ) * random() * 4 : random() * 4;
        random = Math.random();
        const vy = random > 0.5 ? (-1 ) * random() * 4 : random() * 4;
        const point = new Point(Math.random() * canvasWidth, Math.random() * canvasHeight, vx, vy, POINT_RADIUS);
        point_array.push(point);
    }

    return point_array;
}

function draw_points(p, point_array) {
    for(let i = 0; i < point_array.length; i++){
        const point = point_array[i];
        if(point){
            p.fill(229, 240, 244);
            p.noStroke();
            p.circle(point.x, point.y, point.r);
        }
    }
}

function draw_points(p, point_array, rgb) {
    for(let i = 0; i < point_array.length; i++){
        const point = point_array[i];
        if(point){
            p.fill(rgb.r, rgb.g, rgb.b);
            p.noStroke();
            p.circle(point.x, point.y, point.r);
        }
    }
}

function move_points(point_array){
    for(let i = 0; i < point_array.length; i++){
        let point = point_array[i];
        point.x += point.vx; 
        point.y += point.vy; 

        console.log(p.Width);
        if(point.x > p.Width){
            point.x = p.Width;
            point.vx *= -1;
        }
        if(point.x < 0){
            point.x = 0;
            point.vx *= -1;
        }
        if(point.y > p.Height){
            point.y = p.Height;
            point.vy *= -1;
        }
        if(point.y < 0){
            point.y = 0;
            point.vy *= -1;
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
            let distance = Point.dist(point_a, point_b).min;

            if(min > distance){
                min = distance;
                min_points[0] = point_a;
                min_points[1] = point_b;
            }
        }
    }

    return { min: min, min_points: min_points };
}

function closest_pair(px, py, p, prop){
    const n = px.length;
    
    if(n <= 3) return brute_force(px); 
    
    const median = Math.floor(n/2);
    const xm_point = px[median];
    const lx = px.slice(0, median);
    const rx = px.slice(median);
    
    let ly = [];
    let ry = []; 
    for(let i = 0; i < py.length; i++){
        const cur_point = py[i];
        if(cur_point.x <= xm_point.x){
            ly.push(cur_point);
        } else {
            ry.push(cur_point);
        }
    }

    const dl = closest_pair(lx, ly, p, prop);
    const dr = closest_pair(rx, ry, p, prop);
    
    let dmin = dl.min;
    let dmin_points = dl.min_points;

    if (dr.min < dl.min) {
        dmin = dr.min;
        dmin_points = dr.min_points;
    }
   
    const strip_y = [];
    for(let i=0; i < py.length; i++){
        const cur_point = py[i];
        if(Math.abs(cur_point.x - xm_point.x) < dmin) strip_y.push(cur_point);
    }

    let ds = dmin; 
    let ds_min_points = new Array(2);
    
    for(let i = 0; i < strip_y.length; i++){
        for(let k = i+1; k < p.min(i+7, strip_y.length); k++){
            const strip_dist = Point.dist(strip_y[i], strip_y[k]);
            if(ds > strip_dist.min){
                ds = strip_dist.min;
                ds_min_points = strip_dist.min_points;
            }
        }
    }
    
    const min = Math.min(dmin, ds);
    let min_points = [];
    if(min == dmin) {
        min_points = dmin_points;
    } else { 
        min_points = ds_min_points;
    }
        
    return {min: min, min_points: min_points};
}

function start(p, prop){
    let point_array = [];
    let n = 8;
    if(p.frameCount == 1) point_array = create_random_points(prop.canvasWidth, prop.canvasHeight, n);
    draw_points(p, point_array, {r:255,g:255,b:255});
    let min_points_brute = brute_force(point_array).min_points;
    p.stroke(0,0,255);
    const line_offset = 5;
    p.line(min_points_brute[0].x +line_offset, min_points_brute[0].y+line_offset, min_points_brute[1].x +line_offset, min_points_brute[1].y +line_offset);
    
    const points_x = point_array.toSorted((a, b) => a.x - b.x);
    const points_y = point_array.toSorted((a, b) => a.y - b.y);
    DEPTH = 0;
    const min_pair = closest_pair(points_x, points_y, p, prop).min_points;
    p.stroke(255,0,0);
    p.line(min_pair[0].x, min_pair[0].y, min_pair[1].x, min_pair[1].y);
}

function start_particles(p, prop){
    let n = 200; 
    const point_array = create_random_points(prop.canvasWidth, prop.canvasHeight, n); 
    return point_array;
}