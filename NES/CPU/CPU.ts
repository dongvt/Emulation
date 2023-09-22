import { Opcode } from "./Opcode";

enum Flags {
  C = 1 << 0, //Carry Bit
  Z = 1 << 1, //Zero
  I = 1 << 2, //Disable Interrupts
  D = 1 << 3, //Decimal Mode
  B = 1 << 4, //Break
  U = 1 << 5, //Unused
  V = 1 << 6, //Overflow
  N = 1 << 7, //Negative
}
class CPU {
  private fetched = 0x00;
  private address_abs = 0x0000;
  private address_rel = 0x0000;
  private opcode = 0x00;
  private cycles = 0;
  private bus: Bus;

  //Registers
  private a = 0x00;
  private x = 0x00;
  private y = 0x00;
  private sp = 0x0000;
  private pc = 0x00;
  private status = 0x00;

  private lookup : Opcode;

  constructor() {
    this.lookup = new Opcode(this);
  } 

  private getFlag() {}

  private setFlag() {}

  public ConnectBus(n: Bus) {
    this.bus = n;
  }

  public write(address: number, data: number): void {
    this.bus.write(address, data);
  }

  public read(address: number): number {
    return this.bus.read(address);
  }

  public clock(): void {
    if(this.cycles === 0) {
      this.opcode = this.read(this.pc);
      this.pc++;

      this.cycles = this.lookup[this.opcode].cycles;

      const additionalCycle1 = this.lookup[this.opcode].addrmode();

      const additionalCycle2 = this.lookup[this.opcode].operation();

      this.cycles += additionalCycle1 + additionalCycle2;

    }

    this.cycles--;
  }
  public reset(): void {}
  public irq(): void {} //interrupt request signal
  public nmi(): void {} //non maskable interrupt

  public fetch(): number {}

  //Addressing modes (12)
  public IMP(): number {
    this.fetched = this.a;
    return 0;
  }

  public ZP0(): number {
    
  }
  public ZPY(): number {}
  public ABS(): number {}
  public ABY(): number {}
  public IZX(): number {}
  public IMM(): number {
    this.address_abs = this.pc++;
    return 0;
  }
  public ZPX(): number {}
  public REL(): number {}
  public ABX(): number {}
  public IND(): number {}
  public IZY(): number {}

  //opcodes (52)
  public ADC(): number {}
  public BCS(): number {}
  public BNE(): number {}
  public BVS(): number {}
  public CLV(): number {}
  public DEC(): number {}
  public INC(): number {}
  public JSR(): number {}
  public LSR(): number {}
  public PHP(): number {}
  public ROR(): number {}
  public SEC(): number {}
  public STX(): number {}
  public TSX(): number {}
  public AND(): number {}
  public BEQ(): number {}
  public BPL(): number {}
  public CLC(): number {}
  public CMP(): number {}
  public DEX(): number {}
  public INX(): number {}
  public LDA(): number {}
  public NOP(): number {}
  public PLA(): number {}
  public RTI(): number {}
  public SED(): number {}
  public STY(): number {}
  public TXA(): number {}
  public ASL(): number {}
  public BIT(): number {}
  public BRK(): number {}
  public CLD(): number {}
  public CPX(): number {}
  public DEY(): number {}
  public INY(): number {}
  public LDX(): number {}
  public ORA(): number {}
  public PLP(): number {}
  public RTS(): number {}
  public SEI(): number {}
  public TAX(): number {}
  public TXS(): number {}
  public BCC(): number {}
  public BMI(): number {}
  public BVC(): number {}
  public CLI(): number {}
  public CPY(): number {}
  public EOR(): number {}
  public JMP(): number {}
  public LDY(): number {}
  public PHA(): number {}
  public ROL(): number {}
  public SBC(): number {}
  public STA(): number {}
  public TAY(): number {}
  public TYA(): number {}

  //Un handled opcodes
  public XXX(): number {}
}
