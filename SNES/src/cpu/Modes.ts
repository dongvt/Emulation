export enum AddressMode {
    IMP   = 0 ,
    IMM   = 1,
    IMMm  = 2,
    IMMx  = 3,
    IMMl  = 4, // Long
    DP    = 5,
    DPX   = 6,
    DPY   = 7,
    IDP   = 8,
    IDX   = 9,
    IDY   = 10,
    IDYr  = 11, //Reads
    IDL   = 12,
    ILY   = 13,
    SR    = 14,
    ISY   = 15,
    ABS   = 16,
    ABX   = 17,
    ABXr  = 18,
    ABY   = 19,
    ABYr  = 20,
    ABL   = 21,
    ALX   = 22,
    IND   = 23,
    IAX   = 24,
    IAL   = 25,
    REL   = 26,
    RLL   = 27,
    BM    = 28
}

export enum Registers {
    DB  = 0, //Data Bank
    PB  = 1, //Program Bank
    A   = 2, //Accumulator
    X   = 3, // Index X
    Y   = 4, // Index Y
    SP  = 5, // Stack pointer
    PC  = 6, // Program counter
    DP  = 7  // Direct Page
}