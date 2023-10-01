import CPU  from "./CPU/CPU";
import { Cartridge } from "./Cartridge";
import PPU from "./PPU";

export default class Bus {

    private cpu : CPU;
    private ppu : PPU;
    private cpuRam : number[];

    private cartridge : Cartridge;
    private systemClockCounter : number;


    constructor(){
        //Create RAM Space
        this.cpuRam = new Array(2 * 1024).fill(0x00);
        //Connect CPU to the bus
        this.cpu.ConnectBus(this);
    }

    public cpuWrite(address: number, data: number) : void {
        if(address >= 0x0000 && address <= 0x1FFF)
            this.cpuRam[address & 0x07FF] = data;
        else if(address >= 0x2000 && address <= 0x3FFF) {
            this.ppu.ppuWrite(address & 0x07, data);
        }
    }

    public cpuRead(address :number ) : number {
        let data = 0x00;
        
        if(address >= 0x0000 && address <= 0x1FFF)
            data = this.cpuRam[address & 0x07FF]; 
        else if(address >= 0x2000 && address <= 0x3FFF) {
            this.ppu.ppuRead(address & 0x07);
        }

        return data;
    }

    public insertCartridge(cartridge: Cartridge) : void {
        this.cartridge = cartridge;
        //this.cpu.ConnectCartridge(cartridge);
        this.ppu.connectCartridge(cartridge);
    
    }

    public reset() : void {
        this.cpu.reset();
        this.systemClockCounter = 0;
    }

    public clock() : void {
    }


}