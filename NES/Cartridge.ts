import Bus from "./Bus";

export class Cartridge {
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