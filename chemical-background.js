// ===================================
// Interactive Chemical Background
// ===================================

class ChemicalParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.element = this.getRandomElement();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = 12; // Reduzido de 20 para 12
    }

    getRandomElement() {
        const elements = [
            { symbol: 'C', color: '#00ff88', name: 'Carbon', valence: 4 },
            { symbol: 'H', color: '#ffffff', name: 'Hydrogen', valence: 1 },
            { symbol: 'O', color: '#ff4444', name: 'Oxygen', valence: 2 },
            { symbol: 'N', color: '#4488ff', name: 'Nitrogen', valence: 3 },
            { symbol: 'Ni', color: '#00d4ff', name: 'Nickel', valence: 2 },
            { symbol: 'Cu', color: '#ff8844', name: 'Copper', valence: 2 }
        ];
        return elements[Math.floor(Math.random() * elements.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        this.updateExplosions();

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();

            // Reduz opacidade se estiver sobre conteúdo
            const overContent = this.isOverContent(particle.x, particle.y);
            const baseOpacity = overContent ? 0.15 : 0.6;

            particle.draw(this.ctx, baseOpacity);
        });

        // Draw connections based on mouse proximity
        if (this.mouse.x !== null && this.mouse.y !== null) {
            this.particles.forEach(particle => {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = 1 - (distance / this.maxDistance);

                    // Connect to nearby particles
                    this.particles.forEach(other => {
                        if (particle !== other) {
                            const particleDistance = particle.distanceTo(other);
                            if (particleDistance < this.maxDistance) {
                                const particleOpacity = (1 - (particleDistance / this.maxDistance)) * opacity;
                                if (particleOpacity > 0.3) {
                                    this.drawConnection(particle, other, particleOpacity);
                                }
                            }
                        }
                    });
                }
            });
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure body is ready
    setTimeout(() => {
        new ChemicalBackground();
    }, 100);
});
