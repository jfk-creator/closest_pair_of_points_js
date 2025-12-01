let p_array = [];
let DRAG = 0.99;
let PARTICLE_RADIUS = 5; // Increased size for better visibility
let NUMBER_OF_PARTICLES = 120;
let STICKINESS = 0.4;
let CPOP = true;
const FACTOR = 5;
const CANVAS_FACTOR = 0.65;

function update_particle_count(el){
  NUMBER_OF_PARTICLES = el.value;
  p_array = start_particles();
}

function set_particle_radius(el){
  PARTICLE_RADIUS = el.value;
  p_array = start_particles();
}
function set_particle_stickiness(el){
  STICKINESS = el.value;
  p_array = start_particles();
}
function set_particle_drag(el){
  DRAG = el.value;
  p_array = start_particles();
}
function toggle_cpop(el){
  CPOP = el.checked;
}

function setup() {
  createCanvas(windowWidth, windowHeight*CANVAS_FACTOR);
  p_array = start_particles();
}

let FRAMES = 0; 
function draw() {
  background(20);
  move_points(p_array);
  if(!CPOP) resolve_collisions(p_array); // New function here
  if(CPOP) collision_closest_pair(p_array);
  draw_points(p_array);
  if(frameCount % 10 == 0) FRAMES = frameRate();
  fill(250);
  textSize(20);
  text(Math.floor(FRAMES), 20, 40);
  apply_mouse_attraction(p_array);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight*CANVAS_FACTOR);
}

function apply_mouse_attraction(point_array) {
  // 1. Check if mouse is inside canvas
  if (!mouseIsPressed) {
    return;
  }

  const ATTRACTION_STRENGTH = 0.5; // How strong the magnet is
  
  for (let i = 0; i < point_array.length; i++) {
    let point = point_array[i];

    // 2. Vector Math: Calculate direction to mouse
    let dx = mouseX - point.x;
    let dy = mouseY - point.y;
    
    // 3. Distance
    let dist = Math.hypot(dx, dy);

    // Prevent extreme forces when very close (clamp distance)
    if (dist < 10) dist = 10;
    if (dist > 800) continue; // Optimization: Ignore particles too far away

    // 4. Normalize and Apply Force
    // (dx/dist) gives us the direction (0 to 1)
    // We multiply by strength to get the force
    let forceX = (dx / dist) * ATTRACTION_STRENGTH;
    let forceY = (dy / dist) * ATTRACTION_STRENGTH;

    // Add to velocity
    point.vx += forceX;
    point.vy += forceY;
  }
  
  // Visual Guide: Draw a small circle at mouse to show it's active
  noFill();
  stroke(255, 100);
  circle(mouseX, mouseY, 20);
}

// --- The New Collision Function ---
function resolve_collisions(point_array) {
  for (let i = 0; i < point_array.length - 1; i++) {
    let p1 = point_array[i];

    for (let k = i + 1; k < point_array.length; k++) {
      let p2 = point_array[k];

      // 1. Calculate Distance
      let dx = p2.x - p1.x;
      let dy = p2.y - p1.y;
      let distSq = dx * dx + dy * dy; // Distance squared (faster than sqrt)
      
      // In p5, circle() takes Diameter. So r is Diameter. 
      // Physics Radius is r / 2.
      // Minimum distance to not overlap is (r1/2 + r2/2).
      let minDist = (p1.r / 2) + (p2.r / 2);

      // Check collision
      if (distSq < minDist * minDist && distSq > 0) {
        let dist = Math.sqrt(distSq);

        // 2. Resolve Overlap (The "Push")
        // Calculate how far they are overlapping
        let overlap = minDist - dist;
        
        // Calculate the normal vector (direction of collision)
        let nx = dx / dist;
        let ny = dy / dist;

        // Move p1 away by half the overlap
        p1.x -= nx * overlap * 0.5;
        p1.y -= ny * overlap * 0.5;

        // Move p2 away by half the overlap
        p2.x += nx * overlap * 0.5;
        p2.y += ny * overlap * 0.5;

        // 3. Resolve Velocity (The "Bounce")
        // This is 1D elastic collision logic along the normal vector
        
        // Relative velocity
        let rvx = p2.vx - p1.vx;
        let rvy = p2.vy - p1.vy;

        // Calculate velocity along the normal
        let velAlongNormal = rvx * nx + rvy * ny;

        // Do not resolve if velocities are separating
        if (velAlongNormal > 0) continue;

        // Calculate impulse (assuming equal mass)
        let impulse = -1 * velAlongNormal; // -2 for perfect elasticity, -1 works well here
        
        // Apply impulse
        // In simple physics, we just swap the force along the normal
        let impulseX = nx * velAlongNormal;
        let impulseY = ny * velAlongNormal;

        p1.vx += impulseX;
        p1.vy += impulseY;
        p2.vx -= impulseX;
        p2.vy -= impulseY;

        p1.vx *= STICKINESS;
        p2.vx *= STICKINESS;
      }
    }
  }
}
function collision_closest_pair(point_array){
      const points_x = point_array.toSorted((a, b) => a.x - b.x);
      const points_y = point_array.toSorted((a, b) => a.y - b.y);
      closest_pair(points_x, points_y)
}


function closest_pair(px, py){
    const n = px.length;
    
    if(n <= 3) return resolve_collisions(px); 
    
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

    const dl = closest_pair(lx, ly);
    const dr = closest_pair(rx, ry);
    
    let dmin = PARTICLE_RADIUS*2;
   
    const strip_y = [];
    for(let i=0; i < py.length; i++){
        const cur_point = py[i];
        if(Math.abs(cur_point.x - xm_point.x) < dmin) strip_y.push(cur_point);
    }

    let ds = PARTICLE_RADIUS; 
    let ds_min_points = new Array(2);
    
    for(let i = 0; i < strip_y.length; i++){
        for(let k = i+1; k < Math.min(i+7, strip_y.length); k++){
            const point_a = strip_y[i];
            const point_b = strip_y[k];
            const strip_dist = Point.dist(point_a, point_b);
            if(ds > strip_dist.min){
                ds_min_points = strip_dist.min_points;
                resolve_collisions([point_a, point_b]);
            }
        }
    }
    
    const min = Math.min(dmin, ds);
    let min_points = ds_min_points;
        
    return {min: min, min_points: min_points};
}

function start_particles() {
  let n = NUMBER_OF_PARTICLES;
  const point_array = create_random_points(width, height, n);
  return point_array;
}

function move_points(point_array) {
  for (let i = 0; i < point_array.length; i++) {
    let point = point_array[i];
    point.x += point.vx;
    point.y += point.vy;
    point.vy += 0.2;
    point.vy *= DRAG;
    point.vx *= DRAG;

    const EPSILON = 0.05;
    if(Math.abs(point.vy) < EPSILON) point.vy = 0;
    if(Math.abs(point.vx) < EPSILON) point.vx = 0;

    // Fixed: Account for radius at edges to prevent sticking
    let radius = point.r / 2;

    if (point.x > width - radius) {
      point.x = width - radius;
      point.vx *= -1;
    } else if (point.x < radius) {
      point.x = radius;
      point.vx *= -1;
    }
    if (point.y > height - radius) {
      point.y = height - radius;
      point.vy *= -1;
      point.vy *0.8;
    } else if (point.y < radius) {
      point.y = radius;
      point.vy *= -1;
    }
  }
}

class Point {
  constructor(x, y, vx, vy, r) {
    this.x = x;
    this.y = y;
    this.r = r; // NOTE: In p5 circle(), this acts as Diameter
    this.vx = vx;
    this.vy = vy;
  }
  static dist(a, b){
        const min = Math.hypot(a.x - b.x, a.y - b.y); 
        const min_points = [a,b];
        return { min: min, min_points: min_points };
    }
}

function create_random_points(canvasWidth, canvasHeight, n) {
  const point_array = [];
  for (let i = 0; i < n; i++) {
    let random = Math.random();
    const vx = random > 0.5 ? -1 * random * FACTOR : random * FACTOR;
    random = Math.random();
    const vy = random > 0.5 ? -1 * random * FACTOR : random * FACTOR;
    const point = new Point(
      Math.random() * canvasWidth,
      Math.random() * canvasHeight/3,
      vx,
      vy,
      PARTICLE_RADIUS
    );
    point_array.push(point);
  }
  return point_array;
}

function draw_points(point_array) {
  noStroke();
  for (let i = 0; i < point_array.length; i++) {
    const point = point_array[i];
    
    // Calculate Speed (Magnitude of velocity vector)
    // Math.hypot(vx, vy) is cleaner than sqrt(vx*vx + vy*vy)
    let speed = Math.hypot(point.vx, point.vy);
    
    // Map speed to Hue
    // Speed 0 -> 240 (Blue)
    // Speed 8 -> 0   (Red)
    let hue = map(speed, 0, 13, 8, 280, true); 
    // Map speed to Saturation (Optional: faster items are more vivid)
    let sat = 100

    fill(hue, sat, 100);
    circle(point.x, point.y, point.r);
  }
}