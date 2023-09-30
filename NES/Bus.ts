import CPU  from "./CPU/CPU";

export default class Bus {

    private cpu : CPU;
    private ram : number[];

    constructor(){
        //Create RAM Space
        this.ram = new Array(64 * 1024).fill(0x00);
        //Connect CPU to the bus
        this.cpu.ConnectBus(this);
    }

    public write(address: number, data: number) : void {
        if(address >= 0x0000 && address <= 0xFFFF)
            this.ram[address] = data;
    }

    public read(address :number ) : number {
        if(address >= 0x0000 && address <= 0xFFFF)
            return this.ram[address]; 
        return 0;
    }

}