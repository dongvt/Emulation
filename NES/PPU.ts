import Bus from "./Bus";
import { Cartridge } from "./Cartridge";

//Implementation of the 2c02 chip
export default class PPU {

    private cartridge : Cartridge;
    
    constructor(bus : Bus) {
    }

    public cpuRead(address: number) : number {
        const temp : number = 0x00;

        switch(address) {
            case 0x00: //control
                break;
            case 0x01: //Mask
                break;
            case 0x02: // Status
                break;
            case 0x03: //OAM Address
                break;
            case 0x04: //OAM Data
                break;
            case 0x05: // Scroll
                break;
            case 0x06: //PPU Address
                break;
            case 0x07: //PPU Data
                break;
        }
        return temp;
    }
    public cpuWrite(address: number, data: number) : void{
        switch(address) {
            case 0x00: //control
                break;
            case 0x01: //Mask
                break;
            case 0x02: // Status
                break;
            case 0x03: //OAM Address
                break;
            case 0x04: //OAM Data
                break;
            case 0x05: // Scroll
                break;
            case 0x06: //PPU Address
                break;
            case 0x07: //PPU Data
                break;
        }
        
    }

    public ppuRead(address: number) : number {
        const data: number = 0x00;
        address &= 0x3FFF;

        return data;
    }
    public ppuWrite(address: number, data: number) : void {
        address &= 0x3FFF;
    }


    public connectCartridge(cartridge: Cartridge) : void {
        this.cartridge = cartridge;
    }

    public clock() : void {}
}