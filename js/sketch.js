
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
  }
  
  p.draw = () => {
     // Color palette
      const night     = p.color('#1a1b26');
      const white     = p.color(229, 240, 244);
      const red       = p.color('#ff757f');
      const green     = p.color('#9ece6a');
      const gold      = p.color('#efb662');
      const lightBlue = p.color('#7dcfff');
      const blue      = p.color('#7aa2f7');
  
      color_palette= {
        night: night, 
        white: white,
        red: red, 
        green: green,
        gold: gold, 
        lightBlue: lightBlue,
        blue: blue 
      }
  
      const color_array = [red, green, gold, lightBlue, blue];
      draw_sunflower(p, color_palette);
  }

 p.windowResized = () => {
  p.resizeCanvas(calc_canvas_size().canvasWidth, calc_canvas_size().canvasHeight);
  p.frameCount = 0;
}
}


new p5(sketch, 'p5_target');
