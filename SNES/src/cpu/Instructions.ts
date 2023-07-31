import { AddressMode as AM } from "./Modes";

interface IndividualInstruction {
  mode: AM,
  cycles: number,
  run: () => void
}

export default class Instructions {
  private cycles: number[];
  private modes: AM[];
  private executables: Array<() => void>;
  
  constructor() {
    this.modes = [
      AM.IMP, AM.IDX,  AM.IMM, AM.SR , AM.DP , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.ABS, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDYr, AM.IDP, AM.ISY, AM.DP , AM.DPX, AM.DPX, AM.ILY, AM.IMP, AM.ABYr, AM.IMP, AM.IMP, AM.ABS, AM.ABXr,AM.ABX, AM.ALX,
      AM.ABS, AM.IDX,  AM.ABL, AM.SR , AM.DP , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.ABS, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDYr, AM.IDP, AM.ISY, AM.DPX, AM.DPX, AM.DPX, AM.ILY, AM.IMP, AM.ABYr, AM.IMP, AM.IMP, AM.ABXr,AM.ABXr,AM.ABX, AM.ALX,
      AM.IMP, AM.IDX,  AM.IMM, AM.SR , AM.BM , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.ABS, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDYr, AM.IDP, AM.ISY, AM.BM , AM.DPX, AM.DPX, AM.ILY, AM.IMP, AM.ABYr, AM.IMP, AM.IMP, AM.ABL, AM.ABXr,AM.ABX, AM.ALX,
      AM.IMP, AM.IDX,  AM.RLL, AM.SR , AM.DP , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.IND, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDYr, AM.IDP, AM.ISY, AM.DPX, AM.DPX, AM.DPX, AM.ILY, AM.IMP, AM.ABYr, AM.IMP, AM.IMP, AM.IAX, AM.ABXr,AM.ABX, AM.ALX,
      AM.REL, AM.IDX,  AM.RLL, AM.SR , AM.DP , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.ABS, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDY,  AM.IDP, AM.ISY, AM.DPX, AM.DPX, AM.DPY, AM.ILY, AM.IMP, AM.ABY,  AM.IMP, AM.IMP, AM.ABS, AM.ABX, AM.ABX, AM.ALX,
      AM.IMMx,AM.IDX,  AM.IMMx,AM.SR , AM.DP , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.ABS, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDYr, AM.IDP, AM.ISY, AM.DPX, AM.DPX, AM.DPY, AM.ILY, AM.IMP, AM.ABYr, AM.IMP, AM.IMP, AM.ABXr,AM.ABXr,AM.ABYr,AM.ALX,
      AM.IMMx,AM.IDX,  AM.IMM, AM.SR , AM.DP , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.ABS, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDYr, AM.IDP, AM.ISY, AM.DP , AM.DPX, AM.DPX, AM.ILY, AM.IMP, AM.ABYr, AM.IMP, AM.IMP, AM.IAL, AM.ABXr,AM.ABX, AM.ALX,
      AM.IMMx,AM.IDX,  AM.IMM, AM.SR , AM.DP , AM.DP , AM.DP , AM.IDL, AM.IMP, AM.IMMm, AM.IMP, AM.IMP, AM.ABS, AM.ABS, AM.ABS, AM.ABL,
      AM.REL, AM.IDYr, AM.IDP, AM.ISY, AM.IMMl,AM.DPX, AM.DPX, AM.ILY, AM.IMP, AM.ABYr, AM.IMP, AM.IMP, AM.IAX, AM.ABXr,AM.ABX, AM.ALX,
      AM.IMP, AM.IMP,  AM.IMP // abo, nmi, irq
    ];

    this.cycles = [
      7, 6, 7, 4, 5, 3, 5, 6, 3, 2, 2, 4, 6, 4, 6, 5,
      2, 5, 5, 7, 5, 4, 6, 6, 2, 4, 2, 2, 6, 4, 7, 5,
      6, 6, 8, 4, 3, 3, 5, 6, 4, 2, 2, 5, 4, 4, 6, 5,
      2, 5, 5, 7, 4, 4, 6, 6, 2, 4, 2, 2, 4, 4, 7, 5,
      6, 6, 2, 4, 7, 3, 5, 6, 3, 2, 2, 3, 3, 4, 6, 5,
      2, 5, 5, 7, 7, 4, 6, 6, 2, 4, 3, 2, 4, 4, 7, 5,
      6, 6, 6, 4, 3, 3, 5, 6, 4, 2, 2, 6, 5, 4, 6, 5,
      2, 5, 5, 7, 4, 4, 6, 6, 2, 4, 4, 2, 6, 4, 7, 5,
      3, 6, 4, 4, 3, 3, 3, 6, 2, 2, 2, 3, 4, 4, 4, 5,
      2, 6, 5, 7, 4, 4, 4, 6, 2, 5, 2, 2, 4, 5, 5, 5,
      2, 6, 2, 4, 3, 3, 3, 6, 2, 2, 2, 4, 4, 4, 4, 5,
      2, 5, 5, 7, 4, 4, 4, 6, 2, 4, 2, 2, 4, 4, 4, 5,
      2, 6, 3, 4, 3, 3, 5, 6, 2, 2, 2, 3, 4, 4, 6, 5,
      2, 5, 5, 7, 6, 4, 6, 6, 2, 4, 3, 3, 6, 4, 7, 5,
      2, 6, 3, 4, 3, 3, 5, 6, 2, 2, 2, 3, 4, 4, 6, 5,
      2, 5, 5, 7, 5, 4, 6, 6, 2, 4, 4, 2, 8, 4, 7, 5,
      7, 7, 7 // abo, nmi, irq
    ];

    this.executables = [];
  }

  getInstruction(index : number) : IndividualInstruction{
    return {
      mode: this.modes[index],
      cycles: this.cycles[index],
      run: this.executables[index]
    }
  }

  getAddress(){}

  //Instruction
  adc(){}
  sbc(){}
  cmp(){}
  cpx(){}
  cpy(){}
  dec(){}
  deca(){}
  dex(){}
  dey(){}
  inc(){}
  inca(){}
  inx(){}
  iny(){}
  and(){}
  eor(){}
  ora(){}
  bit(){}
  biti(){}
  trb(){}
  tsb(){}
  asl(){}
  asla(){}
  lsr(){}
  lsra(){}
  rol(){}
  rola(){}
  ror(){}
  rora(){}
  bcc(){}
  bcs(){}
  beq(){}
  bmi(){}
  bne(){}
  bpl(){}
  bra(){}
  bvc(){}
  bvs(){}
  brl(){}
  jmp(){}
  jml(){}
  jsl(){}
  jsr(){}
  rtl(){}
  rts(){}
  brk(){}
  cop(){}
  abo(){}
  nmi(){}
  irq(){}
  rti(){}
  clc(){}
  cld(){}
  cli(){}
  clv(){}
  sec(){}
  sed(){}
  sei(){}
  rep(){}
  sep(){}
  lda(){}
  ldx(){}
  ldy(){}
  sta(){}
  stx(){}
  sty(){}
  stz(){}
  mvn(){}
  mvp(){}
  nop(){}
  wdm(){}
  pea(){}
  pei(){}
  per(){}
  pha(){}
  phx(){}
  phy(){}
  pla(){}
  plx(){}
  phb(){}
  phd(){}
  phk(){}
  php(){}
  plb(){}
  pld(){}
  plp(){}
  stp(){}
  wai(){}
  tax(){}
  tay(){}
  tsx(){}
  txa(){}
  txs(){}
  txy(){}
  tya(){}
  tyx(){}
  txd(){}
  tcd(){}
  tcs(){}
  tdc(){}
  tsc(){}
  xba(){}
  xce(){}


  
}
