import Bus from "./Bus";

interface sHeader {
  name: string;
  prg_rom_chunks: number;
  chr_rom_chunks: number;
  mapper1: number;
  mapper2: number;
  prg_ram_size: number;
  tv_system1: number;
  tv_system2: number;
  unused: string;
}
export class Cartridge {
  private vPRGMemory: []; //Program Memory
  private vCHRMemory: []; //Character Memory

  private nMapperId: number;
  private nPRGBanks: number;
  private nCHRBanks: number;

  constructor() {}

  public cpuRead(address: number): number {}
  public cpuWrite(address: number, data: number): void {}

  public ppuRead(address: number): number {}
  public ppuWrite(address: number, data: number): void {}

  static async loadCartridge(filePath: string): Promise<Cartridge> {
    const file = await fetch(filePath);
    const buffer = await file.arrayBuffer();
    const dataView = new DataView(buffer);
    const header : sHeader = {
        name: String.fromCharCode(...new Uint8Array(buffer.slice(0, 4))),
        prg_rom_chunks: dataView.getUint8(4),
        chr_rom_chunks: dataView.getUint8(5),
        mapper1: dataView.getUint8(6),
        mapper2: dataView.getUint8(7),
        prg_ram_size: dataView.getUint8(8),
        tv_system1: dataView.getUint8(9),
        tv_system2: dataView.getUint8(10),
        unused: String.fromCharCode(...new Uint8Array(buffer.slice(11,5)))
    }
    
    return new Cartridge();
  }
}
