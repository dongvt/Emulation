class Memory {
    private ram: Uint8Array;
  
    constructor(size: number) {
      this.ram = new Uint8Array(size);
    }
  
    read(address: number) {
      return this.ram[address];
    }
  
    write(address: number, value: number) {
      this.ram[address] = value;
    }
  }
  