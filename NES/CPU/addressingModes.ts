import { CPU } from "./CPU";

export type AddressingModeFn = (cpu: CPU) => number;

//Immediate: Just fetch the next byte
export const immediate: AddressingModeFn = (cpu) => {
    return cpu.fetchByte();
}

//Absolute: Fetch the next two bytes, combine them into an address
//and return the value at that address
export const absolute: AddressingModeFn = (cpu) => {
    const low = cpu.fetchByte();
    const high = cpu.fetchByte();
    const address = (high << 8) | low;
    return cpu.memory[address];
}

// Absolute X
export const absoluteX : AddressingModeFn = (cpu) => {
    const low = cpu.fetchByte();
    const high = cpu.fetchByte();
    const base = (high << 8) | low;
    const address = (base + cpu.X) & 0xFFFF; // Wrap around 16-bit address space
    return cpu.memory[address];
}

// Absolute Y
export const absoluteY : AddressingModeFn = (cpu) => {
    const low = cpu.fetchByte();
    const high = cpu.fetchByte();
    const base = (high << 8) | low;
    const address = (base + cpu.Y) & 0xFFFF; // Wrap around 16-bit address space
    return cpu.memory[address];
}



// Absolute Address for STA
export const absoluteAddress: AddressingModeFn = (cpu) => {
    const low = cpu.fetchByte();
    const high = cpu.fetchByte();
    return (high << 8) | low; // Return the address
}


// Zero Page: Fetch the next byte, use it as an address to return the value
export const zeroPage: AddressingModeFn = (cpu) => {
    const address = cpu.fetchByte();
    return cpu.memory[address];
}

// Zero page X
export const zeroPageX: AddressingModeFn = (cpu) => {
    const address = (cpu.fetchByte() + cpu.X) & 0xFF; // Wrap around zero page
    return cpu.memory[address];
}

// Zero page Y
export const zeroPageY: AddressingModeFn = (cpu) => {
    const address = (cpu.fetchByte() + cpu.Y) & 0xFF; // Wrap around zero page
    return cpu.memory[address];
}