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

  private lookup: Opcode;

  constructor() {
    this.lookup = new Opcode(this);
  }

  private getFlag(f : number) : number {
    return (this.status & 0xf) > 0 ? 1 : 0;
  }

  private setFlag(f : Flags, value : boolean) {
    if(value) {
      this.status |= f;
    } else {
      this.status &= ~f;
    }
  }

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
    if (this.cycles === 0) {
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

  public fetch(): number {
    if(this.lookup[this.opcode].addrmode !== this.IMP) {
      this.fetched = this.read(this.address_abs);
    }
    return this.fetched;
  }

  //Addressing modes (12)
  public IMP(): number {
    this.fetched = this.a;
    return 0;
  }

  public IMM(): number {
    this.address_abs = this.pc++;
    return 0;
  }

  public ZP0(): number {
    this.address_abs = this.read(this.pc++);
    this.address_abs &= 0x0ff;
    return 0;
  }

  public ZPY(): number {
    this.address_abs = this.read(this.pc) + this.y;
    this.pc++;
    this.address_abs &= 0x0ff;
    return 0;
  }

  public ZPX(): number {
    this.address_abs = this.read(this.pc) + this.x;
    this.pc++;
    this.address_abs &= 0x0ff;
    return 0;
  }

  public ABS(): number {
    const low = this.read(this.pc);
    this.pc++;
    const high = this.read(this.pc);
    this.pc++;

    this.address_abs = (high << 8) | low;

    return 0;
  }

  public ABX(): number {
    const low = this.read(this.pc);
    this.pc++;
    const high = this.read(this.pc);
    this.pc++;

    this.address_abs = (high << 8) | low;
    this.address_abs += this.x;

    if ((this.address_abs & 0xff00) !== high << 8) {
      return 1;
    } else {
      return 0;
    }
  }

  public ABY(): number {
    const low = this.read(this.pc);
    this.pc++;
    const high = this.read(this.pc);
    this.pc++;

    this.address_abs = (high << 8) | low;
    this.address_abs += this.y;

    if ((this.address_abs & 0xff00) !== high << 8) {
      return 1;
    } else {
      return 0;
    }
  }

  public IND(): number {
    const low = this.read(this.pc);
    this.pc++;
    const high = this.read(this.pc);
    this.pc++;

    const completeAddr = (high << 8) | low;

    if (low == 0x00ff) {
      this.address_abs =
        (this.read(completeAddr & 0x00ff) << 8) | this.read(completeAddr + 0);
    } else {
      this.address_abs =
        (this.read(completeAddr + 1) << 8) | this.read(completeAddr + 0);
    }

    return 0;
  }

  public IZX(): number {
    const t = this.read(this.pc);
    const low = this.read((t + this.x) & 0x00ff);
    const high = this.read((t + this.x + 1) & 0x00ff);

    this.address_abs = (high << 8) | low;

    return 0;
  }

  public IZY(): number {
    const t = this.read(this.pc);
    this.pc++;
    const low = this.read(t & 0x00ff);
    const high = this.read((t + 1) & 0x00ff);

    this.address_abs = (high << 8) | low;
    this.address_abs += this.y;

    if ((this.address_abs & 0x00ff) !== high << 8) {
      return 1;
    } else {
      return 0;
    }
  }

  public REL(): number {
    this.address_rel = this.read(this.pc);
    this.pc++;
    if(this.address_rel & 0x80)
      this.address_rel |= 0xFF00;

      return 0;
  }

  //opcodes (52)
  public ADC(): number {}
  public BCS(): number {
    if(this.getFlag(Flags.C) === 1) {
      this.cycles++;
      this.address_abs = this.pc + this.address_rel;
      if((this.address_abs & 0xff00) !== (this.pc & 0x00ff)){
        this.cycles++;
      }

      this.pc = this.address_abs;
    }

    return 0;
  }
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
  public AND(): number {
    this.fetch();
    this.a = this.a & this.fetched;
    this.setFlag(Flags.Z, this.a == 0x00);
    this.setFlag(Flags.N,(this.a & 0x80) !== 0);
    return 1;
  }
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
