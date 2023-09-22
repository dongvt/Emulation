// Implementation of the 5A22 Micro processor
import { AddressMode as AM, Registers as R } from "./Modes";
import Instructions from './Instructions';

export default class CPU {
  private instructionHandler : Instructions;
  public memory: Memory;
  public registers: Uint16Array;

  //Flags
  public n: boolean;
  public v: boolean;
  public m: boolean;
  public x: boolean;
  public d: boolean;
  public i: boolean;
  public z: boolean;
  public c: boolean;
  public e: boolean;

  //Interrupts
  public irq: boolean;
  public nmi: boolean;
  public abo: boolean;

  public stopped: boolean;
  public waiting: boolean;

  public remainingCycles: number;

  constructor() {
    this.registers = new Uint16Array(8);
    this.instructionHandler = new Instructions();

    this.reset();
  }

  public reset() {
    this.registers[R.DB] = 0;
    this.registers[R.PB] = 0;

    this.registers[R.A] = 0;
    this.registers[R.X] = 0;
    this.registers[R.Y] = 0;
    this.registers[R.SP] = 0;
    this.registers[R.DP] = 0;

    //TODO: Set PC

    this.n = false;
    this.v = false;
    this.m = true;
    this.x = true;
    this.d = false;
    this.i = false;
    this.z = false;
    this.c = false;
    this.e = true;

    this.irq = false;
    this.nmi = false;
    this.abo = false;

    this.stopped = false;
    this.waiting = false;

    this.remainingCycles = 7;

  }

  public cycle() {
    if(this.remainingCycles === 0) {
      if(this.stopped) this.remainingCycles++;
    } else if(this.waiting) {
      if(this.irq || this.nmi) {
        this.waiting = false;
      }
      this.remainingCycles++;
    } else {
      const instructionIdx = 0 //TODO: get this from memory
      let instruction = this.instructionHandler.getInstruction(instructionIdx);
      this.remainingCycles = instruction.cycles;

      if((this.irq && !this.i) || this.nmi || this.abo) {
        this.registers[R.PC]--;
        if(this.abo) {
          this.abo = false;
          instruction = this.instructionHandler.getInstruction(0x100);
        } else if(this.nmi) {
          this.nmi = false;
          instruction = this.instructionHandler.getInstruction(0x101);
        } else {
          instruction = this.instructionHandler.getInstruction(0x102);
        }
        this.remainingCycles = instruction.cycles;
      }

      //execute
      instruction.run(this); //TODO: Add the address so we know what to run
    }

    this.remainingCycles--;
  }
}
