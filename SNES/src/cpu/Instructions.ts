import CPU from "./CPU";
import { AddressMode as AM, Registers as R } from "./Modes";

interface IndividualInstruction {
  mode: AM,
  cycles: number,
  run: (CPU: CPU) => void
}

export default class Instructions {
  private cycles: number[];
  private modes: AM[];
  private executables: Array<(CPU: CPU) => void>;
  
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

    this.executables = [
      this.brk, this.ora, this.cop, this.ora, this.tsb, this.ora, this.asl, this.ora, this.php, this.ora, this.asla,this.phd, this.tsb, this.ora, this.asl, this.ora,
      this.bpl, this.ora, this.ora, this.ora, this.trb, this.ora, this.asl, this.ora, this.clc, this.ora, this.inca,this.tcs, this.trb, this.ora, this.asl, this.ora,
      this.jsr, this.and, this.jsl, this.and, this.bit, this.and, this.rol, this.and, this.plp, this.and, this.rola,this.pld, this.bit, this.and, this.rol, this.and,
      this.bmi, this.and, this.and, this.and, this.bit, this.and, this.rol, this.and, this.sec, this.and, this.deca,this.tsc, this.bit, this.and, this.rol, this.and,
      this.rti, this.eor, this.wdm, this.eor, this.mvp, this.eor, this.lsr, this.eor, this.pha, this.eor, this.lsra,this.phk, this.jmp, this.eor, this.lsr, this.eor,
      this.bvc, this.eor, this.eor, this.eor, this.mvn, this.eor, this.lsr, this.eor, this.cli, this.eor, this.phy, this.tcd, this.jml, this.eor, this.lsr, this.eor,
      this.rts, this.adc, this.per, this.adc, this.stz, this.adc, this.ror, this.adc, this.pla, this.adc, this.rora,this.rtl, this.jmp, this.adc, this.ror, this.adc,
      this.bvs, this.adc, this.adc, this.adc, this.stz, this.adc, this.ror, this.adc, this.sei, this.adc, this.ply, this.tdc, this.jmp, this.adc, this.ror, this.adc,
      this.bra, this.sta, this.brl, this.sta, this.sty, this.sta, this.stx, this.sta, this.dey, this.biti,this.txa, this.phb, this.sty, this.sta, this.stx, this.sta,
      this.bcc, this.sta, this.sta, this.sta, this.sty, this.sta, this.stx, this.sta, this.tya, this.sta, this.txs, this.txy, this.stz, this.sta, this.stz, this.sta,
      this.ldy, this.lda, this.ldx, this.lda, this.ldy, this.lda, this.ldx, this.lda, this.tay, this.lda, this.tax, this.plb, this.ldy, this.lda, this.ldx, this.lda,
      this.bcs, this.lda, this.lda, this.lda, this.ldy, this.lda, this.ldx, this.lda, this.clv, this.lda, this.tsx, this.tyx, this.ldy, this.lda, this.ldx, this.lda,
      this.cpy, this.cmp, this.rep, this.cmp, this.cpy, this.cmp, this.dec, this.cmp, this.iny, this.cmp, this.dex, this.wai, this.cpy, this.cmp, this.dec, this.cmp,
      this.bne, this.cmp, this.cmp, this.cmp, this.pei, this.cmp, this.dec, this.cmp, this.cld, this.cmp, this.phx, this.stp, this.jml, this.cmp, this.dec, this.cmp,
      this.cpx, this.sbc, this.sep, this.sbc, this.cpx, this.sbc, this.inc, this.sbc, this.inx, this.sbc, this.nop, this.xba, this.cpx, this.sbc, this.inc, this.sbc,
      this.beq, this.sbc, this.sbc, this.sbc, this.pea, this.sbc, this.inc, this.sbc, this.sed, this.sbc, this.plx, this.xce, this.jsr, this.sbc, this.inc, this.sbc,
      this.abo, this.nmi, this.irq // abo, nmi, irq
    ];
  }

  public getInstruction(index : number) : IndividualInstruction{
    return {
      mode: this.modes[index],
      cycles: this.cycles[index],
      run: this.executables[index]
    }
  }

  /**
   * Returns the effective address (low and high) of the instruction based on the mode
   * @param CPU 
   * @param mode 
   * @returns [low,high]
   */
  getAddress(CPU: CPU, mode: AM) : number[] {
    switch(mode){
      case AM.IMP :{
        return [0,0]
      }
      case AM.IMM :{
        return [(CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++,0]
      }
      case AM.IMMm:{
        if(CPU.m) {
          return [(CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++,0];
        } else {
          const low = (CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++;
          const high = (CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++;
          return [low,high];
        }
      }
      case AM.IMMx:{
        if(CPU.x) {
          return [(CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++,0];
        } else {
          const low = (CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++;
          const high = (CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++;
          return [low,high];
        }
      }
      case AM.IMMl:{
        const low = (CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++;
        const high = (CPU.registers[R.PB] << 16) | CPU.registers[R.PC]++;
        return [low,high];
      }
      case AM.DP  :{
        const address = 0 //TODO: get this from memory
        if((CPU.registers[R.DP] & 0xFF) !== 0) CPU.remainingCycles++;
        return [(CPU.registers[R.DP] + address) & 0xFFFF,
        (CPU.registers[R.DP] + address + 1) & 0xFFFF]
      }
      case AM.DPX :{
        const address = 0 //TODO: get this from memory
        if((CPU.registers[R.DP] & 0xFF) !== 0) CPU.remainingCycles++;
        return [(CPU.registers[R.DP] + address + CPU.registers[R.X]) & 0xFFFF,
                (CPU.registers[R.DP] + address + CPU.registers[R.X] + 1) & 0xFFFF]
      }
      case AM.DPY :{
        const address = 0 //TODO: get this from memory
        if((CPU.registers[R.DP] & 0xFF) !== 0) CPU.remainingCycles++;
        return [(CPU.registers[R.DP] + address + CPU.registers[R.Y]) & 0xFFFF,
                (CPU.registers[R.DP] + address + CPU.registers[R.Y] + 1) & 0xFFFF]
      }
      case AM.IDP :{}
      case AM.IDX :{}
      case AM.IDY :{}
      case AM.IDYr:{}
      case AM.IDL :{}
      case AM.ILY :{}
      case AM.SR  :{}
      case AM.ISY :{}
      case AM.ABS :{}
      case AM.ABX :{}
      case AM.ABXr:{}
      case AM.ABY :{}
      case AM.ABYr:{}
      case AM.ABL :{}
      case AM.ALX :{}
      case AM.IND :{}
      case AM.IAX :{}
      case AM.IAL :{}
      case AM.REL :{}
      case AM.RLL :{}
      case AM.BM  :{}
    }
  }

  //Instructions
  public adc(CPU : CPU){}
  public sbc(CPU : CPU){}
  public cmp(CPU : CPU){}
  public cpx(CPU : CPU){}
  public cpy(CPU : CPU){}
  public dec(CPU : CPU){}
  public deca(CPU : CPU){}
  public dex(CPU : CPU){}
  public dey(CPU : CPU){}
  public inc(CPU : CPU){}
  public inca(CPU : CPU){}
  public inx(CPU : CPU){}
  public iny(CPU : CPU){}
  public and(CPU : CPU){}
  public eor(CPU : CPU){}
  public ora(CPU : CPU){}
  public bit(CPU : CPU){}
  public biti(CPU : CPU){}
  public trb(CPU : CPU){}
  public tsb(CPU : CPU){}
  public asl(CPU : CPU){}
  public asla(CPU : CPU){}
  public lsr(CPU : CPU){}
  public lsra(CPU : CPU){}
  public rol(CPU : CPU){}
  public rola(CPU : CPU){}
  public ror(CPU : CPU){}
  public rora(CPU : CPU){}
  public bcc(CPU : CPU){}
  public bcs(CPU : CPU){}
  public beq(CPU : CPU){}
  public bmi(CPU : CPU){}
  public bne(CPU : CPU){}
  public bpl(CPU : CPU){}
  public bra(CPU : CPU){}
  public bvc(CPU : CPU){}
  public bvs(CPU : CPU){}
  public brl(CPU : CPU){}
  public jmp(CPU : CPU){}
  public jml(CPU : CPU){}
  public jsl(CPU : CPU){}
  public jsr(CPU : CPU){}
  public rtl(CPU : CPU){}
  public rts(CPU : CPU){}
  public brk(CPU : CPU){}
  public cop(CPU : CPU){}
  public abo(CPU : CPU){}
  public nmi(CPU : CPU){}
  public irq(CPU : CPU){}
  public rti(CPU : CPU){}
  public clc(CPU : CPU){}
  public cld(CPU : CPU){}
  public cli(CPU : CPU){}
  public clv(CPU : CPU){}
  public sec(CPU : CPU){}
  public sed(CPU : CPU){}
  public sei(CPU : CPU){}
  public rep(CPU : CPU){}
  public sep(CPU : CPU){}
  public lda(CPU : CPU){}
  public ldx(CPU : CPU){}
  public ldy(CPU : CPU){}
  public sta(CPU : CPU){}
  public stx(CPU : CPU){}
  public sty(CPU : CPU){}
  public stz(CPU : CPU){}
  public mvn(CPU : CPU){}
  public mvp(CPU : CPU){}
  public nop(CPU : CPU){}
  public wdm(CPU : CPU){}
  public pea(CPU : CPU){}
  public pei(CPU : CPU){}
  public per(CPU : CPU){}
  public pha(CPU : CPU){}
  public phx(CPU : CPU){}
  public phy(CPU : CPU){}
  public pla(CPU : CPU){}
  public plx(CPU : CPU){}
  public ply(CPU : CPU){}
  public phb(CPU : CPU){}
  public phd(CPU : CPU){}
  public phk(CPU : CPU){}
  public php(CPU : CPU){}
  public plb(CPU : CPU){}
  public pld(CPU : CPU){}
  public plp(CPU : CPU){}
  public stp(CPU : CPU){}
  public wai(CPU : CPU){}
  public tax(CPU : CPU){}
  public tay(CPU : CPU){}
  public tsx(CPU : CPU){}
  public txa(CPU : CPU){}
  public txs(CPU : CPU){}
  public txy(CPU : CPU){}
  public tya(CPU : CPU){}
  public tyx(CPU : CPU){}
  public txd(CPU : CPU){}
  public tcd(CPU : CPU){}
  public tcs(CPU : CPU){}
  public tdc(CPU : CPU){}
  public tsc(CPU : CPU){}
  public xba(CPU : CPU){}
  public xce(CPU : CPU){}


  
}
