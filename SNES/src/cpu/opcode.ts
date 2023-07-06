class Opcode {
    private CPU : CPU;
    constructor(cpu: CPU) {
        this.CPU = cpu;
    }

    createMapHandler() {
        const opcodeHandlers = new Map();
        opcodeHandlers.set(0x69,() => this.ADC_Immediate());
        opcodeHandlers.set(0x6D,() => this.ADC_Absolute());
        return opcodeHandlers;
    }

    ADC_Immediate() {
        const address = this.CPU.getPC() + 1;
        const operant = this.CPU.readWRAM(address) ;
        const carry = (this.CPU.getPSR() & 0b00000001) > 0 ? 1 : 0;
        const A = this.CPU.getA();

        const result = A + operant + carry;

        this.CPU.setA(result & 0xff)
        if (result > 0xFF) this.CPU.setPSR(this.CPU.getPSR() | 0b00000001);
        else this.CPU.setPSR(this.CPU.getPSR() | 0b11111110);

        //Cycles?

        return {newPC: this.CPU.getPC() + 2};
    }

    ADC_Absolute() {
        const address = (this.CPU.readWRAM(this.CPU.getPC() + 2) << 8) | this.CPU.readWRAM(this.CPU.getPC() + 1);
        const operand = this.CPU.readWRAM(address);
        const carry = (this.CPU.getPSR() & 0b00000001) > 0 ? 1 : 0;
        const A = this.CPU.getA();
    
        const result = A + operand + carry;
    
        this.CPU.setA(result & 0xff)
        if (result > 0xFF) this.CPU.setPSR(this.CPU.getPSR() | 0b00000001);
        else this.CPU.setPSR(this.CPU.getPSR() & 0b11111110);
    
        return {newPC: this.CPU.getPC() + 3};
    }
    
}