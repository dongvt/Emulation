import {CPU} from './cpu/CPU';

const cpu = new CPU();

cpu.memory[0xFFFC] = 0x00; // Low byte of reset vector
cpu.memory[0xFFFD] = 0x80; // High byte of reset vector



// Set up program
cpu.memory[0x8000] = 0xB9;  
cpu.memory[0x8001] = 0x34;
cpu.memory[0x8002] = 0x12; 

cpu.memory[0x1234] = 0x55;  

cpu.reset();

cpu.Y = 0x0; 

cpu.step();

console.log("A:", cpu.A.toString(16)); // Should be 0xAB
