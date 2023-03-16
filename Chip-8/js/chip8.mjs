"use strict";
export default class chip8 {
  constructor(keyboard) {
    //Current opt code (16 bit)
    this.opcode = 0x0;
    //Total memory
    this.memory = new Array(4096).fill(0x0);
    //Register (8 bit)
    this.V = new Array(16).fill(0x0);
    //Index register and program counter
    this.I = 0x0;
    this.PC = 0x200;

    //Timer register -> They go to 0 at 60 Hz when they are above 0
    this.delay_timer = 0x0;
    this.sound_timer = 0x0;

    //The call stack
    this.stack = new Array(16).fill(0x0);
    this.SP = 0x0; //Stack pointer

    //Draw flag for opcodes 0x00E0
    this.drawFlag = false;

    //Input
    this.keyboard = keyboard;
    //Screen state
    this.screen = new Array(64 * 32).fill(0);
  }

  reset() {
    this.opcode = 0x0;
    this.I = 0x0;
    this.PC = 0x200;

    this.V = new Array(16).fill(0x0);

    this.memory = new Array(4096).fill(0x0);

    this.stack = new Array(16).fill(0x0);
    this.sp = 0x0;

    this.delay_timer = 0x0;
    this.sound_timer = 0x0;
    
    //Load the font here
    const font = [
		0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
		0x20, 0x60, 0x20, 0x20, 0x70, // 1
		0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
		0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
		0x90, 0x90, 0xF0, 0x10, 0x10, // 4
		0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
		0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
		0xF0, 0x10, 0x20, 0x40, 0x40, // 7
		0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
		0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
		0xF0, 0x90, 0xF0, 0x90, 0x90, // A
		0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
		0xF0, 0x80, 0x80, 0x80, 0xF0, // C
		0xE0, 0x90, 0x90, 0x90, 0xE0, // D
		0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
		0xF0, 0x80, 0xF0, 0x80, 0x80, // F
	];
    for(let i = 0 ; i < font.length ; i++) {
        this.memory[i] = font[i];
    }
  }

  loadMemory(uInt8Arr) {
    for(let i = 0;i < uInt8Arr.length; i++) {
        this.memory[i + 0x200] = uInt8Arr[i];
    }
    //console.log(this.memory);
  }

  emulateCycle() {
    //Fetch opcode
    this.opcode = (this.memory[this.PC] << 8) | this.memory[this.PC + 1];
    //Decode and execute opcode
    this.runOpcode();
    
    //Update timers
    if (this.delay_timer > 0) this.delay_timer--;
    if (this.sound_timer > 0) {
      if (this.sound_timer == 1) {
        //handle sound
        console.log("Beep");
      }
      this.sound_timer--;
    }
  }

  runOpcode() {
    let VIdx, XIdx, YIdx;
    //console.log(this.opcode.toString(16),this.V)
    switch (this.opcode & 0xf000) {
      case 0x0000:
        switch (this.opcode & 0x00ff) {
          case 0x00e0:
            for(let i = 0; i < this.screen.length; i++) {
                this.screen[i] = 0;
            }
            
            this.drawFlag = true;
            this.PC += 2;

            break;
          case 0x00ee:
            this.PC = this.stack[--this.SP];
            break;
        }
        break;
      case 0x1000:
        this.PC = this.opcode & 0x0fff;
        break;
      case 0x2000:
        this.stack[this.SP++] = this.PC + 2;
        this.PC = this.opcode & 0x0fff;
        break;
      case 0x3000:
        VIdx = (this.opcode & 0x0f00) >> 8;
        if (this.V[VIdx] === (this.opcode & 0x00ff)) this.PC += 4;
        else this.PC += 2;
        break;
      case 0x4000:
        VIdx = (this.opcode & 0x0f00) >> 8;
        if (this.V[VIdx] !== (this.opcode & 0x00ff)) this.PC += 4;
        else this.PC += 2;
        break;
      case 0x5000:
        XIdx = (this.opcode & 0x0f00) >> 8;
        YIdx = (this.opcode & 0x00f0) >> 4;
        if (this.V[XIdx] === this.V[YIdx]) this.PC += 4;
        else this.PC += 2;
        break;
      case 0x6000:
        VIdx = (this.opcode & 0x0f00) >> 8;
        this.V[VIdx] = this.opcode & 0x00ff;
        this.PC += 2;
        break;
      case 0x7000:
        VIdx = (this.opcode & 0x0f00) >> 8;
        this.V[VIdx] += this.opcode & 0x00ff;
        //overflow
        this.V[VIdx] = this.V[VIdx] & 0x00ff;
        this.PC += 2;
        break;
      case 0x8000:
        switch (this.opcode & 0x000f) {
          case 0x0000:
            XIdx = (this.opcode & 0x0f00) >> 8;
            YIdx = (this.opcode & 0x00f0) >> 4;
            this.V[XIdx] = this.V[YIdx];
            this.PC += 2;
            break;
          case 0x0001:
            XIdx = (this.opcode & 0x0f00) >> 8;
            YIdx = (this.opcode & 0x00f0) >> 4;
            this.V[XIdx] = this.V[YIdx] | this.V[XIdx];
            this.PC += 2;
            break;
          case 0x0002:
            XIdx = (this.opcode & 0x0f00) >> 8;
            YIdx = (this.opcode & 0x00f0) >> 4;
            this.V[XIdx] = this.V[YIdx] & this.V[XIdx];
            this.PC += 2;
            break;
          case 0x0003:
            XIdx = (this.opcode & 0x0f00) >> 8;
            YIdx = (this.opcode & 0x00f0) >> 4;
            this.V[XIdx] = this.V[YIdx] ^ this.V[XIdx];
            this.PC += 2;
            break;
          case 0x0004:
            XIdx = (this.opcode & 0x0f00) >> 8;
            YIdx = (this.opcode & 0x00f0) >> 4;
            if (this.V[YIdx] > 0xff - this.V[XIdx]) this.V[0xf] = 1;
            else this.V[0xf] = 0;
            this.V[XIdx] = (this.V[XIdx] + this.V[YIdx]) & 0x00ff;
            this.PC += 2;
            break;
          case 0x0005:
            XIdx = (this.opcode & 0x0f00) >> 8;
            YIdx = (this.opcode & 0x00f0) >> 4;
            this.V[XIdx] = (this.V[XIdx] - this.V[YIdx]) & 0x00ff;
            if (this.V[YIdx] > this.V[XIdx]) this.V[0xf] = 0;
            else this.V[0xf] = 1;
            this.PC += 2;
            break;
          case 0x0006:
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.V[0xf] = this.V[VIdx] & 0x1;
            this.V[VIdx] = this.V[VIdx] >> 1;
            this.PC += 2;
            break;
          case 0x0007:
            XIdx = (this.opcode & 0x0f00) >> 8;
            YIdx = (this.opcode & 0x00f0) >> 4;
            
            this.V[XIdx] = (this.V[YIdx] - this.V[XIdx]) & 0x00ff;
            if (this.V[YIdx] < this.V[XIdx]) this.V[0xf] = 0;
            else this.V[0xf] = 1;
            this.PC += 2;
            break;
          case 0x000e:
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.V[0xf] = this.V[VIdx] & 0x80; //Get most significant bit
            this.V[VIdx] = (this.V[VIdx] << 1) & 0xff;
            this.PC += 2;
            break;
          default:
            console.log(`${this.opcode.toString(16)} is not recognized {8 SET}`);
            break;
        }
        break;
      case 0x9000:
        XIdx = (this.opcode & 0x0f00) >> 8;
        YIdx = (this.opcode & 0x00f0) >> 4;
        if (this.V[XIdx] !== this.V[YIdx]) this.PC += 4;
        else this.PC += 2;
        break;
      case 0xa000:
        this.I = this.opcode & 0x0fff;
        this.PC += 2;
        break;
      case 0xb000:
        this.PC = (this.V[0] + this.opcode) & 0x0fff;
        break;
      case 0xc000:
        VIdx = (this.opcode & 0x0f00) >> 8;
        this.V[VIdx] = ~~(Math.random() * 256) & this.opcode & 0x00ff;
        this.PC += 2;
        break;
      case 0xd000:
        XIdx = (this.opcode & 0x0f00) >> 8;
        YIdx = (this.opcode & 0x00f0) >> 4;
        const height = (this.opcode & 0x000f);
        //Draw screen
        this.V[0xF] = 0;

        for(let yLine = 0 ; yLine < height; yLine++) {
            const pixel = this.memory[this.I + yLine];
            for(let xLine = 0; xLine < 8; xLine++) {
                if((pixel & (0x80 >> xLine)) !== 0) {
                    if(this.screen[this.V[XIdx] + xLine + (this.V[YIdx] + yLine) * 64] !== 0)
                        this.V[0xF] = 1;
                    this.screen[this.V[XIdx] + xLine + (this.V[YIdx] + yLine) * 64] ^= 1;
                }
            }
        }
        //console.log(`Drawing in ${this.V[XIdx]},${this.V[YIdx]}`);
        this.drawFlag = true;
        this.PC += 2;
        break;
      case 0xe000:
        switch (this.opcode & 0x00ff) {
          case 0x009e:
            //Handle key press
            VIdx = (this.opcode & 0x0f00) >> 8;
            if (this.keyboard.pressedKeys[this.V[VIdx]]) this.PC += 4;
            else this.PC += 2;
            break;
          case 0x00a1:
            //Handle key press
            VIdx = (this.opcode & 0x0f00) >> 8;
            if (!this.keyboard.pressedKeys[this.V[VIdx]]) this.PC += 4;
            else this.PC += 2;
            break;
          default:
            console.log(`${this.opcode.toString(16)} is not recognized {E SET}`);
            break;
        }
        break;
      case 0xf000:
        switch (this.opcode & 0x00ff) {
          case 0x0007:
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.V[VIdx] = this.delay_timer;
            this.PC += 2;
            break;
          case 0x000a:
            const key = this.keyboard.getPressedKey();
            console.log(key,'*****************')
            if (key !== -1) {
              VIdx = (this.opcode & 0x0f00) >> 8;
              this.V[VIdx] = key;
              this.PC += 2;
            }
            break;
          case 0x0015:
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.delay_timer = this.V[VIdx];
            this.PC += 2;
            break;
          case 0x0018:
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.sound_timer = this.V[VIdx];
            this.PC += 2;
            break;
          case 0x001e:
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.I += this.V[VIdx];
            //Overflow
            //this.I = this.I & 0xfff;
            this.PC += 2;
            break;
          case 0x0029:
            //Read from the output?
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.I = (this.V[VIdx] & 0x000f) * 5;
            this.PC += 2;
            break;
          case 0x0033:
            VIdx = (this.opcode & 0x0f00) >> 8;
            this.memory[this.I] = ~~(this.V[VIdx] / 100)
            this.memory[this.I + 1] = ~~(this.V[VIdx] / 10) % 10;
            this.memory[this.I + 2] = this.V[VIdx]  % 10;
            this.PC += 2;
            break;
          case 0x0055:
            VIdx = (this.opcode & 0x0f00) >> 8;
            for(let i = 0; i <= VIdx ; i++) {
                this.memory[this.I + i] = this.V[i];
            }
            this.PC += 2;
            break;
          case 0x0065:
            VIdx = (this.opcode & 0x0f00) >> 8;
            for(let i = 0; i <= VIdx ; i++) {
                this.V[i] = this.memory[this.I + i];
            }
            this.PC += 2;
            break;
          default:
            console.log(`${this.opcode.toString(16)} is not recognized {F SET}`);
            break;
        }
        break;
      default:
        console.log(`${this.opcode.toString(16)} is not recognized {General SET}`);
        break;
    }
  }
}
