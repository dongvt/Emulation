export type addressingMode =
  | "immediate"
  | "absolute"
  | "implied"
  | "zeroPage"
  | "zeroPage,X"
  | "zeroPage,Y"
  | "absolute,Y"
  | "absolute,X";

export interface Instruction {
  name: string;
  mode: addressingMode;
  bytes: number;
  cycles: number;
  execute: () => void;
}
