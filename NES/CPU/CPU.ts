import { Instruction } from "./instructionTable";
import * as modes from "./addressingModes";

export class CPU {
  // 8-bit registers
  A = 0x00; // Accumulator
  X = 0x00; // X Register
  Y = 0x00; // Y Register

  // Stack Pointer
  SP = 0xfd; // Stack Pointer (initialized to 0xFD)

  // Program Counter
  PC = 0x0000;

  // Status Register
  P = 0x24; // Status Register

  // Memory 64KB
  memory: Uint8Array = new Uint8Array(0x10000);

  private instructions: Record<number, Instruction> = {};

  constructor() {
    this.initInstructions();
  }

  initInstructions() {
    this.instructions = {
      0x8d: {
        name: "STA",
        mode: "absolute",
        bytes: 3,
        cycles: 4,
        execute: () => this.sta(modes.absoluteAddress(this)),
      },
      0xa0: {
        name: "LDY",
        mode: "immediate",
        bytes: 2,
        cycles: 2,
        execute: () => this.ldy(modes.immediate(this)),
      },
      0xa2: {
        name: "LDX",
        mode: "immediate",
        bytes: 2,
        cycles: 2,
        execute: () => this.ldx(modes.immediate(this)),
      },
      0xa4: {
        name: "LDY",
        mode: "zeroPage",
        bytes: 2,
        cycles: 3,
        execute: () => this.ldy(modes.zeroPage(this)),
      },
      0xa5: {
        name: "LDA",
        mode: "zeroPage",
        bytes: 2,
        cycles: 3,
        execute: () => this.lda(modes.zeroPage(this)),
      },
      0xa6: {
        name: "LDX",
        mode: "zeroPage",
        bytes: 2,
        cycles: 3,
        execute: () => this.ldx(modes.zeroPage(this)),
      },
      0xa9: {
        name: "LDA",
        mode: "immediate",
        bytes: 2,
        cycles: 2,
        execute: () => this.lda(modes.immediate(this)),
      },
      0xaa: {
        name: "TAX",
        mode: "implied",
        bytes: 1,
        cycles: 2,
        execute: () => this.tax(),
      },
      0xac: {
        name: "LDY",
        mode: "absolute",
        bytes: 3,
        cycles: 4,
        execute: () => this.ldy(modes.absolute(this)),
      },
      0xad: {
        name: "LDA",
        mode: "absolute",
        bytes: 3,
        cycles: 4,
        execute: () => this.lda(modes.absolute(this)),
      },
      0xb4: {
        name: "LDY",
        mode: "zeroPage,X",
        bytes: 2,
        cycles: 4,
        execute: () => this.ldy(modes.zeroPageX(this)),
      },
      0xb5: {
        name: "LDA",
        mode: "zeroPage,X",
        bytes: 2,
        cycles: 4,
        execute: () => this.lda(modes.zeroPageX(this)),
      },
      0xb6: {
        name: "LDX",
        mode: "zeroPage,Y",
        bytes: 2,
        cycles: 4,
        execute: () => this.ldx(modes.zeroPageY(this)),
      },
      0xb9: {
        name: "LDA",
        mode: "absolute,Y",
        bytes: 3,
        cycles: 4, // +1 if page boundary crossed
        execute: () => this.lda(modes.absoluteY(this)),
      },
      0xbc: {
        name: "LDY",
        mode: "absolute,X",
        bytes: 3,
        cycles: 4, // +1 if page boundary crossed
        execute: () => this.ldy(modes.absoluteX(this)),
      },
      0xbe: {
        name: "LDX",
        mode: "absolute",
        bytes: 3,
        cycles: 4,
        execute: () => this.ldx(modes.absolute(this)),
      },
    };
  }

  reset() {
    const lo = this.memory[0xfffc];
    const hi = this.memory[0xfffd];
    this.PC = (hi << 8) | lo;
  }

  step(): void {
    const opcode = this.fetchByte();
    this.execute(opcode);
  }

  fetchByte(): number {
    const byte = this.memory[this.PC];
    this.PC++;
    return byte;
  }

  execute(opcode: number): void {
    const instruction = this.instructions[opcode];

    if (!instruction) {
        console.log(this.instructions)
      throw new Error(`Unknown opcode: ${opcode.toString(16)}`);
    }

    instruction.execute();
  }

  lda(value: number): void {
    this.A = value;
    this.updateZeroAndNegativeFlags(this.A);
  }

  ldx(value: number): void {
    this.X = value;
    this.updateZeroAndNegativeFlags(this.X);
  }

  ldy(value: number): void {
    this.Y = value;
    this.updateZeroAndNegativeFlags(this.Y);
  }

  tax(): void {
    this.X = this.A;
    this.updateZeroAndNegativeFlags(this.X);
  }

  sta(address: number): void {
    this.memory[address] = this.A;
  }

  

  updateZeroAndNegativeFlags(value: number): void {
    this.setFlag(2, value === 0); // Zero Flag
    this.setFlag(7, (value & 0x80) !== 0); // Negative Flag
  }

  setFlag(flag: number, condition: boolean): void {
    if (condition) {
      this.P |= 1 << flag;
    } else {
      this.P &= ~(1 << flag);
    }
  }
}
