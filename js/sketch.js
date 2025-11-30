
const sketch = (p) => {

  let color_palette;  

  function calc_canvas_size() {
    const scale_factor = 0.9;
    const max_size = 950;
    let canvasWidth = p.windowWidth * scale_factor;
    if(canvasWidth  > max_size) canvasWidth = max_size;
    let canvasHeight = canvasWidth/1.5;

    return {canvasWidth, canvasHeight};
  }
  
  let point_array = [];

  p.setup = () => {
    p.createCanvas(calc_canvas_size().canvasWidth, calc_canvas_size().canvasHeight);
    point_array = start_particles(p, calc_canvas_size());
    //p.noLoop();
  }
  
  p.draw = () => {
    p.background(0)
    move_points(point_array);
    draw_points(point_array);
    //start(p, calc_canvas_size());
      //draw_sunflower(p, color_palette);
  }

  p.windowResized = () => {
    const {canvasWidth, canvasHeight} = calc_canvas_size();
    p.resizeCanvas(canvasWidth, canvasHeight);
    p.frameCount = 0;
  }

  p.mouseClicked = () => {
    //p.draw();
  }
}


new p5(sketch, 'p5_target');


function start_particles(p, prop){
    let n = 200; 
    const point_array = create_random_points(prop.canvasWidth, prop.canvasHeight, n); 
    return point_array;
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