"use strict";
export default class Screen {
  constructor(state) {
    this.canvas = document.getElementById("output");
    this.context = this.canvas.getContext("2d");
    this.WIDTH = 0;
    this.HEIGHT = 0;
    this.state = state;
  }

  async setUpScreen(h, w) {    

    this.cols = 64;
    this.rows = 32;
    this.gap = ~~(w / this.cols);  

    this.WIDTH = this.cols * this.gap;
    this.HEIGHT = this.rows * this.gap;

    this.canvas.height = this.HEIGHT;
    this.canvas.width = this.WIDTH;
    
  }

  draw() {

    const ctx = this.context;
    const gap = this.gap;
    const cols = this.cols;

    this.clear();
    for(let i = 0 ; i < this.state.length; i++) {
        if(this.state[i]) {
            const x = (i % cols);
            const y = ~~(i / cols);
            ctx.fillRect(x * gap, y * gap, gap, gap);
        }
    }
  }

  clear() {
    const ctx = this.context;
    ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);  
  }
}
