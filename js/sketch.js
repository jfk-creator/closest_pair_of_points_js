
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
  
  p.setup = () => {
    p.createCanvas(calc_canvas_size().canvasWidth, calc_canvas_size().canvasHeight);
    p.noLoop();
  }
  
  p.draw = () => {
    p.background(0)
      //draw_sunflower(p, color_palette);
      start(p, calc_canvas_size());
  }

  p.windowResized = () => {
    const {canvasWidth, canvasHeight} = calc_canvas_size();
    p.resizeCanvas(canvasWidth, canvasHeight);
    p.frameCount = 0;
  }

  p.mouseClicked = () => {
    p.draw();
  }
}


new p5(sketch, 'p5_target');
