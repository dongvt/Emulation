"use strict";
export default class Keyboard {
    constructor() {
        this.pressedKeys = new Array(16).fill(false); 
        this.keyMap = null;
    }

    setUpKeyboard() {
        this.keyMap = new Map([
            ['digit1',0x1],
            ['digit2',0x2],
            ['digit3',0x3],
            ['digit4',0xc],
            ['keyq',0x4],
            ['keyw',0x5],
            ['keye',0x6],
            ['keyr',0xd],
            ['keya',0x7],
            ['keys',0x8],
            ['keyd',0x9],
            ['keyf',0xe],
            ['keyz',0xa],
            ['keyx',0x0],
            ['keyc',0xb],
            ['keyv',0xf],
        ]);

        const setKey = (key,value) => {
            const actionKey =key.toLowerCase();
            if(this.keyMap.has(actionKey)) {
                this.pressedKeys[this.keyMap.get(actionKey)] = value;
            }
        }
        document.addEventListener('keydown',(e) => {
            setKey(e.code,true);
        });
        document.addEventListener('keyup',(e) => {
            setKey(e.code,false);
        });

    }

    getPressedKey() {
        for(let i = 0x0 ; i < this.pressedKeys.length; i++) {
            if(this.pressedKeys[i]) return i;
        }
        return -0x1;
    }
}