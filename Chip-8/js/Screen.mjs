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
    this.canvas.height = h;
    this.canvas.width = w;
    this.WIDTH = w;
    this.HEIGHT = h;

    // //Testing
    // const ctx = this.context;
    // for(let i = 0; i < 64 ; i++) {
    //     if(i % 2 === 0) ctx.fillStyle = 'blue';
    //     else ctx.fillStyle = 'red';
    //     this.draw(5, i);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    // }
  }

  draw() {

    const ctx = this.context;
    //console.log(this.state)
    const cols = 64;
    const rows = 32;
    const gap = ~~(this.WIDTH / cols);  

    this.clear();
    for(let i = 0 ; i < this.state.length; i++) {
        if(this.state[i]) {
            const x = (i % cols);
            const y = ~~(i / rows);
            ctx.fillRect(x * gap, y * gap, gap, gap);
        }
    }
  }

  clear() {
    const ctx = this.context;
    ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);  
  }
}
