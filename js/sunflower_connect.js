let c = 20;
let n = 160;
let dotSize = 3;
let goldenAngle = 137.5;

let COLOR_;

function createPoint(p, i){

    let a = i * goldenAngle;
    let r = c * p.sqrt(i);

    let x = r * p.cos(a);
    let y = r * p.sin(a);

    let hue = a % 360;
    
    let sat = 90;
    let bri = 90;
    let t = 0;
    const point = {x, y, hue, sat, bri, t};

    return point;

}

function draw_dots(p){
  for(let i = 0; i < point_array.length; i++){
      let ppoint = point_array[i];
      // rainbow fill(p.hue, p.sat, p.bri);
      p.fill(COLOR_.white);
      p.noStroke();
      p.circle(ppoint.x, ppoint.y, dotSize);
    }
}

const animation_duration = 220; //frames
let line_count = 0;

function draw_lines(p_, point, parray){
  for(let i = 0; i < line_count; i++){
      let p = parray[i];
      // rainbow fill(p.hue, p.sat, p.bri);


        p_.stroke(COLOR_.white);
        let x = p_.lerp(point.x, p.x, p.t/animation_duration);
        let y = p_.lerp(point.y, p.y, p.t/animation_duration);
        p_.line(point.x, point.y , x, y, dotSize);
        if(p.t <= animation_duration) p.t++;
      }
        if(line_count < parray.length && p_.frameCount % 3 == 0) line_count++;
      
}

function set_t_zero(parray){
  for(let i = 0; i < parray.length; i++){
    parray[i].t = 0;
  }

}

let point_array = [];
let point_array2 = [];
let point_array3 = [];

function draw_sunflower(p, color_palette) {
    c = p.windowWidth / 65;
    n = Math.floor( p.windowWidth / 8);
    const frameCount = p.frameCount;
    COLOR_= color_palette
    p.background(0,0,0,0);
    p.translate(p.width / 2, p.height / 2);
    if(frameCount == 1) {
      point_array = [];
      point_array2 = [];
      point_array3 = [];
     }
    if(frameCount < n) {
      point_array.push(createPoint(p, frameCount)) 
    }
    if(frameCount > n ) {
      draw_lines(p, point_array[30], point_array)
    }
    if(frameCount == n + animation_duration ) {
      point_array2 = JSON.parse(JSON.stringify(point_array))
      set_t_zero(point_array2);
    }
    if(frameCount > n + animation_duration ) {
      draw_lines(p, point_array2[2], point_array2)
    }
    if(frameCount == n + 2*animation_duration ) {
      point_array3 = JSON.parse(JSON.stringify(point_array))
      set_t_zero(point_array3);
    }
    if(frameCount > n + 2*animation_duration ) {
      draw_lines(p, point_array3[15], point_array3)
    }
    draw_dots(p)

}