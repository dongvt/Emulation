interface Instruction {
  execute: () => void;
}

// Implementation of the 5A22 Micro processor
class CPU {
  private A: number;
  private X: number;
  private Y: number;
  private S: number;
  private D: number;
  private PC: number; //Program counter
  private SP: number; //Stack pointer
  private P: number;
  private PSR: number;

  private wram: Memory = new Memory(128 * 1024);

  private opcode: Opcode;
  private opcodesHandlers = new Map<number, () => void>();

  constructor() {
    this.A = 0x0;
    this.X = 0x0;
    this.Y = 0x0;
    this.S = 0x0;
    this.D = 0x0;
    this.PC = 0x0;
    this.SP = 0x0;
    this.P = 0x0;
    this.PSR = 0x0;
    this.opcode = new Opcode(this);
    this.opcodesHandlers = this.opcode.createMapHandler();
  }

  //Getters and setters
  getA() {
    return this.A;
  }
  getX() {
    return this.X;
  }
  getY() {
    return this.Y;
  }
  getS() {
    return this.S;
  }
  getD() {
    return this.D;
  }
  getPC() {
    return this.PC;
  }
  getSP() {
    return this.SP;
  }
  getP() {
    return this.P;
  }
  getPSR() {
    return this.PSR;
  }
  readWRAM(address:number) {
    return this.wram.read(address);
  }

  setA(val: number) {
    this.A = val;
  }
  setX(val: number) {
    this.X = val;
  }
  setY(val: number) {
    this.Y = val;
  }
  setS(val: number) {
    this.S = val;
  }
  setD(val: number) {
    this.D = val;
  }
  setPC(val: number) {
    this.PC = val;
  }
  setSP(val: number) {
    this.SP = val;
  }
  setP(val: number) {
    this.P = val;
  }
  setPSR(val: number) {
    this.PSR = val;
  }

  private fetchDecodeExecute() {
    while (this.wram.read(this.PC) !== 0x00) {
      const opcode = this.wram.read(this.PC);

      const instruction = this.decode(opcode);

      this.execute(instruction);

      this.PC++;
    }
  }

  private decode(opcode: number): Instruction {
    const handler = this.opcodesHandlers.get(opcode);

    if (!handler) {
      throw new Error(`Unknown opcode: ${opcode}`);
    }

    return {
      execute: handler,
    };
  }

  private execute(instruction: Instruction) {
    instruction.execute();
  }

  load(rom: Array<number>) {
    for (let i = 0; i < rom.length; i++) {
      this.wram.write(i, rom[i]);
    }
    this.PC = 0;
  }

  start() {
    this.fetchDecodeExecute();
  }

  cycle() {}
}
