// ui/uiHelper.js
const uiManager = {
    tooltip: {
        visible: false,
        text: "",
        x: 0,
        y: 0,
        timer: 0,
        delay: 30, 
        targetElement: null 
    },
    showingFailedLog: false, 
    showingBlessingScreen: false, // NEW: Flag for blessing screen

    isMouseOver: function(x, y, w, h) {
        if (typeof mouseX === 'undefined' || typeof mouseY === 'undefined') {
            return false;
        }
        return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
    },

    drawButton: function(config) {
        if (typeof fill === 'undefined' || typeof color === 'undefined' || typeof rect === 'undefined' || 
            typeof textAlign === 'undefined' || typeof textSize === 'undefined' || typeof text === 'undefined' ||
            typeof stroke === 'undefined' || typeof noStroke === 'undefined' ||
            typeof red === 'undefined' || typeof green === 'undefined' || typeof blue === 'undefined') {
            console.error("p5.js drawing functions not available to uiManager.drawButton");
            return;
        }

        let baseColor = config.baseColor || color(220); 
        let hoverColor = config.hoverColor || color(red(baseColor) * 0.85, green(baseColor) * 0.85, blue(baseColor) * 0.85); 
        let inactiveColor = config.inactiveColor || color(170, 170, 170); 
        
        let currentBgColor = config.active ? baseColor : inactiveColor;
        let currentTextColor = config.active ? (config.textColor || color(0)) : color(100);
        
        if (config.active && this.isMouseOver(config.x, config.y, config.w, config.h)) {
            currentBgColor = hoverColor;
            if (config.onHover && typeof config.onHover === 'function') {
                 config.onHover(); 
            }
        }

        fill(currentBgColor);
        stroke(config.borderColor || color(50)); 
        rect(config.x, config.y, config.w, config.h, config.cornerRadius || 5);
        
        noStroke(); 
        fill(currentTextColor);
        textAlign(CENTER, CENTER);
        textSize(config.textSize || 16);
        text(config.label, config.x + config.w / 2, config.y + config.h / 2);
        
        textAlign(LEFT, BASELINE); 
    },

    updateTooltip: function(elementX, elementY, elementW, elementH, newText, elementRef) {
        if (typeof mouseX === 'undefined' || typeof width === 'undefined' || typeof textSize === 'undefined' || typeof textWidth === 'undefined') {
            return;
        }

        if (this.isMouseOver(elementX, elementY, elementW, elementH)) {
            if (this.tooltip.targetElement !== elementRef) { 
                this.tooltip.timer = 0;
                this.tooltip.targetElement = elementRef;
                this.tooltip.visible = false; 
            }
            this.tooltip.timer++;
            if (this.tooltip.timer >= this.tooltip.delay) {
                this.tooltip.visible = true;
                this.tooltip.text = newText;
                
                let approxTooltipWidth = 0;
                textSize(12); 
                let linesForApprox = this.tooltip.text.split('\n');
                for(let line of linesForApprox){
                    approxTooltipWidth = Math.max(approxTooltipWidth, textWidth(line));
                }
                approxTooltipWidth += 20; 

                if (mouseX + approxTooltipWidth + 15 > width) { 
                    this.tooltip.x = mouseX - approxTooltipWidth - 5; 
                } else {
                    this.tooltip.x = mouseX + 15; 
                }
                this.tooltip.y = mouseY + 5;
            }
        } else {
            if (this.tooltip.targetElement === elementRef) { 
                this.tooltip.visible = false;
                this.tooltip.timer = 0;
                this.tooltip.targetElement = null;
            }
        }
    },

    drawTooltip: function() {
        if (typeof fill === 'undefined' || typeof rect === 'undefined' || typeof textAlign === 'undefined' || 
            typeof textSize === 'undefined' || typeof text === 'undefined' || typeof textWidth === 'undefined' ||
            typeof noStroke === 'undefined' || typeof width === 'undefined' || typeof height === 'undefined') {
            return;
        }

        if (this.tooltip.visible && this.tooltip.text) {
            let lines = this.tooltip.text.split('\n');
            
            textSize(12); 
            let textLeadingValue = 15; 
            let tooltipWidth = 0;
            for(let line of lines){
                tooltipWidth = Math.max(tooltipWidth, textWidth(line));
            }
            tooltipWidth += 20; 
            let tooltipHeight = lines.length * textLeadingValue + (lines.length > 0 ? 5 : 10) + 5; 

            let finalX = this.tooltip.x;
            let finalY = this.tooltip.y;

            if (finalX + tooltipWidth > width) { finalX = width - tooltipWidth - 5; }
            if (finalX < 5) { finalX = 5; }
            if (finalY + tooltipHeight > height) { finalY = height - tooltipHeight - 5; }
            if (finalY < 5) { finalY = 5; }
            
            fill(50, 50, 50, 230); 
            noStroke();
            rect(finalX, finalY, tooltipWidth, tooltipHeight, 5); 
            
            fill(255); 
            textAlign(LEFT, TOP); 
            for(let i=0; i < lines.length; i++){
                text(lines[i], finalX + 10, finalY + 5 + i * textLeadingValue); 
            }
            textAlign(LEFT, BASELINE); 
        }
    }
};
