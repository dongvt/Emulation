import chip8 from "./chip8.mjs";
import Keyboard from "./keyboard.mjs";
import Screen from "./screen.mjs";

async function main() {
  //Input
  const keyboard = new Keyboard();
  keyboard.setUpKeyboard();
  //Initialize
  const newChip8 = new chip8(keyboard);
  newChip8.reset();

  //Graphics
  const screen = new Screen(newChip8.screen);
  screen.setUpScreen(800, 800);

  //Load ROM
  const ROM = await fetch("./roms/br8kout.ch8").then(
    (response) => response.arrayBuffer()
  );
  newChip8.loadMemory(new Uint8Array(ROM));

  while (true) {
    //Emulate cycle
    newChip8.emulateCycle();

    //Check graphics
    if (newChip8.drawFlag) {
      newChip8.drawFlag = false;
      screen.draw();
    }
    await new Promise((resolve) => setTimeout(resolve,1))
  }

}

main();
