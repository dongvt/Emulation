import Bus from "./Bus";

export class Cartridge {

    private vPRGMemory : []; //Program Memory
    private vCHRMemory : []; //Character Memory

    private mapID : number;
    private nPRGBanks : number;
    private nCHRBanks : number;

    constructor(bus : Bus) {
    }

    public cpuRead(address: number) : number {
    }
    public cpuWrite(address: number, data: number) : void{

    }

    public ppuRead(address: number) : number {

    }
    public ppuWrite(address: number, data: number) : void {

    }
}