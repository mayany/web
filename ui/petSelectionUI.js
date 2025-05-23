// PetSelectionUI: Handles the display and interaction of the pet selection modal.

class PetSelectionUI {
  constructor() {
    this.visible = false; // Controls the visibility of the modal (using 'visible' as in my previous code, prompt uses isVisible)
    // Using options as per the new prompt for task "实现灵宠升级基础功能"
    this.petOptions = [ // Renamed from 'options' to 'petOptions' to match my previous code structure
      { id: 1132, name: "猛虎", emoji: "🐅", x: 150, y: 250, w: 100, h: 50, p5color: [255, 165, 0] }, // Orange - Storing as array for fill()
      { id: 1144, name: "玉兔", emoji: "🐇", x: 300, y: 250, w: 100, h: 50, p5color: [255, 192, 203] }, // Pink
      { id: 1154, name: "祥龙", emoji: "🐉", x: 450, y: 250, w: 100, h: 50, p5color: [255, 215, 0] },  // Gold
      { id: 1161, name: "灵蛇", emoji: "🐍", x: 225, y: 320, w: 100, h: 50, p5color: [0, 128, 0] },    // Green
      { id: 1168, name: "骏马", emoji: "🐎", x: 375, y: 320, w: 100, h: 50, p5color: [165, 42, 42] }    // Brown
    ];
    this.title = "选择你的专属灵宠";
    this.modalWidth = 500; // For centering calculations if needed, though options have fixed x,y
    this.modalHeight = 300; // For centering calculations
  }

  show() {
    this.visible = true;
    // Adjust button positions to be centered if not using fixed x,y from prompt
    // The prompt provides fixed x,y, so we use those.
    // If dynamic positioning was needed:
    // const modalContentX = (width - this.modalWidth) / 2;
    // const modalContentY = (height - this.modalHeight) / 2;
    // For now, the provided x,y are absolute.
    // console.log("PetSelectionUI show called, modal should be visible.");
  }

  hide() {
    this.visible = false;
    // console.log("PetSelectionUI hide called, modal should be hidden.");
  }

  draw() {
    if (!this.visible) {
        return;
    }

    // Draw semi-transparent background overlay
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Draw modal background
    // Using fixed values from prompt for modal size, centered
    let modalRectX = (width - this.modalWidth) / 2;
    let modalRectY = (height - this.modalHeight) / 2;
    fill(230, 230, 230); // Light gray
    stroke(50);
    rect(modalRectX, modalRectY, this.modalWidth, this.modalHeight, 10); // Rounded corners

    // Draw title
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(this.title, width / 2, modalRectY + 40); // Title position relative to modal top

    // Draw pet selection buttons
    this.petOptions.forEach(option => {
        fill(option.p5color[0], option.p5color[1], option.p5color[2]);
        stroke(30);
        rect(option.x, option.y, option.w, option.h, 5); // Button background

        fill(0);
        textAlign(CENTER, CENTER);
        // Display name and emoji as per prompt's suggestion
        textSize(14); // Smaller for name
        text(option.name, option.x + option.w / 2, option.y + option.h / 2 - 10);
        textSize(20); // Larger for emoji
        text(option.emoji, option.x + option.w / 2, option.y + option.h / 2 + 12);
    });
    textAlign(LEFT, BASELINE); // Reset alignment
  }

  handleMousePress(mx, my) {
    if (!this.visible) {
        return null; 
    }

    for (const option of this.petOptions) {
        if (mx > option.x && mx < option.x + option.w && my > option.y && my < option.y + option.h) {
            console.log(`选择了灵宠: ${option.name} (ID: ${option.id})`);
            // this.hide(); // Hide modal after selection - this should be called in sketch.js
            return option.id; // Return the ID of the selected pet
        }
    }
    return null; // No button was clicked
  }
}

// If not using modules and want to make it globally accessible (less ideal)
// window.PetSelectionUI = PetSelectionUI;
// Or for module usage (preferred):
// export default PetSelectionUI;
