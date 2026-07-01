// Golden star trail cursor effect
class StarTrail {
  constructor() {
    this.stars = [];
    this.maxStars = 12;
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    // Create star container
    this.starContainer = document.createElement('div');
    this.starContainer.id = 'star-trail-container';
    this.starContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.starContainer);

    // Listen for mouse movement
    document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    document.addEventListener('mouseenter', () => {
      this.starContainer.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      this.starContainer.style.opacity = '0';
    });

    // Animation loop
    this.animate();
  }

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.createStar();
  }

  createStar() {
    const star = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const randomOffset = Math.random() * 20 - 10;
    
    star.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 9999;
      margin: 0;
      padding: 0;
    `;

    // Create star SVG
    star.innerHTML = `
      <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; display: block;">
        <polygon points="50,10 61,40 92,40 67,60 78,90 50,70 22,90 33,60 8,40 39,40" 
                 fill="#d4a574" opacity="0.9"/>
      </svg>
    `;

    // Add star data
    star.starData = {
      x: this.mouseX + randomOffset,
      y: this.mouseY + randomOffset,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 2, // Bias upward
      life: 1,
      size: size
    };

    this.starContainer.appendChild(star);
    this.stars.push(star);

    // Limit number of stars
    if (this.stars.length > this.maxStars) {
      const oldStar = this.stars.shift();
      oldStar.remove();
    }
  }

  animate() {
    this.stars.forEach((star, index) => {
      const data = star.starData;
      
      // Update position
      data.x += data.vx;
      data.y += data.vy;
      data.vy += 0.1; // Gravity
      data.life -= 0.05; // Fade out

      // Apply transformations
      star.style.transform = `translate(${data.x}px, ${data.y}px) scale(${data.life})`;
      star.style.opacity = Math.max(0, data.life);

      // Remove dead stars
      if (data.life <= 0) {
        star.remove();
        this.stars.splice(index, 1);
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
function initStarTrail() {
  if (document.body) {
    new StarTrail();
  } else {
    // Try again if body isn't ready yet
    setTimeout(initStarTrail, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStarTrail);
} else {
  initStarTrail();
}
