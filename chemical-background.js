// ===================================
// Interactive Chemical Background
// ===================================

class ChemicalParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.element = this.getRandomElement();
        this.active = false; // Start inactive (gray)
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = 12;
        this.active = false;
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

        // Keep within bounds
        this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }

    draw(ctx, opacity = 1) {
        // Discrete Mode: Gray if inactive, Element Color if active
        const baseColor = this.active ? this.element.color : '#aaaaaa';

        // Draw element circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = baseColor + Math.floor(opacity * 20).toString(16).padStart(2, '0');
        ctx.fill();
        ctx.strokeStyle = baseColor + Math.floor(opacity * 128).toString(16).padStart(2, '0');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw element symbol
        ctx.fillStyle = baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.element.symbol, this.x, this.y);
    }

    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceToSquared(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }

    canBondWith(other) {
        const bondRules = {
            'C-O': true, 'O-C': true,
            'C-H': true, 'H-C': true,
            'N-H': true, 'H-N': true,
            'O-H': true, 'H-O': true,
            'C-N': true, 'N-C': true,
            'Ni-O': true, 'O-Ni': true,
            'Cu-O': true, 'O-Cu': true,
            'C-C': true,
            'N-O': true, 'O-N': true
        };

        const key = `${this.element.symbol}-${other.element.symbol}`;
        return bondRules[key] || false;
    }
}

class ChemicalBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.explosions = [];
        this.mouse = { x: null, y: null };
        this.maxDistance = 180;
        this.isMobile = window.innerWidth < 768; // Detect mobile
        this.particleCount = this.isMobile ? 30 : 50; // Optimized count
        this.contentAreas = [];
        this.reactionDistance = 80;
        this.reactionDistanceSq = this.reactionDistance * this.reactionDistance;
        this.draggedParticle = null;
        this.frame = 0;

        this.init();
    }

    init() {
        this.canvas.id = 'chemical-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.resize();

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new ChemicalParticle(this.canvas));
        }

        this.updateContentAreas();

        window.addEventListener('resize', () => {
            this.resize();
            this.updateContentAreas();
        });

        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', () => this.handleMouseUp());

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.handleMouseUp();
        });

        window.addEventListener('touchstart', (e) => this.handleMouseDown(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleMouseMove(e), { passive: false });
        window.addEventListener('touchend', () => this.handleMouseUp());

        this.animate();
    }

    handleMouseDown(e) {
        // Mobile Optimization: Disable interaction to allow scrolling
        if (this.isMobile) return;

        if (e.target.closest('a, button, input, textarea, select, .lang-btn')) return;

        let x, y;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        const clickedParticle = this.particles.find(p => {
            const dx = p.x - x;
            const dy = p.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 30;
        });

        if (clickedParticle) {
            if (e.cancelable) e.preventDefault();
            this.draggedParticle = clickedParticle;
            this.draggedParticle.vx = 0;
            this.draggedParticle.vy = 0;
            this.draggedParticle.active = true; // Activate on drag
        } else {
            this.forceReactionAtPoint(x, y);
        }
    }

    handleMouseMove(e) {
        let x, y;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        this.mouse.x = x;
        this.mouse.y = y;

        if (this.draggedParticle) {
            if (e.cancelable) e.preventDefault();
            this.draggedParticle.x = this.mouse.x;
            this.draggedParticle.y = this.mouse.y;
            this.draggedParticle.vx = 0;
            this.draggedParticle.vy = 0;
            this.draggedParticle.active = true;
        }
    }

    handleMouseUp() {
        if (this.draggedParticle) {
            this.draggedParticle.vx = (Math.random() - 0.5) * 0.5;
            this.draggedParticle.vy = (Math.random() - 0.5) * 0.5;
            this.draggedParticle = null;
        }
    }

    updateContentAreas() {
        this.contentAreas = [];
        const sections = document.querySelectorAll('section, .nav-container, footer');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            this.contentAreas.push({
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            });
        });
    }

    isOverContent(x, y) {
        return this.contentAreas.some(area =>
            x >= area.x &&
            x <= area.x + area.width &&
            y >= area.y &&
            y <= area.y + area.height
        );
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawConnection(p1, p2, opacity) {
        if (!p1.canBondWith(p2)) return;

        const c1 = p1.active ? p1.element.color : '#aaaaaa';
        const c2 = p2.active ? p2.element.color : '#aaaaaa';

        const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, c1 + Math.floor(opacity * 180).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, c2 + Math.floor(opacity * 180).toString(16).padStart(2, '0'));

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        if (opacity > 0.6) {
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            let bondSymbol = '—';
            if ((p1.element.symbol === 'C' && p2.element.symbol === 'O') ||
                (p1.element.symbol === 'O' && p2.element.symbol === 'C')) {
                bondSymbol = '=';
            }

            this.ctx.fillStyle = '#00ff88' + Math.floor(opacity * 200).toString(16).padStart(2, '0');
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(bondSymbol, midX, midY);
        }
    }

    checkChemicalReactions() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const distSq = p1.distanceToSquared(p2);

                if (distSq < this.reactionDistanceSq && p1.canBondWith(p2)) {
                    const molecule = this.tryFormMolecule(p1, p2, i, j);
                    if (molecule) {
                        return;
                    }
                }
            }
        }
    }

    tryFormMolecule(p1, p2, index1, index2) {
        if ((p1.element.symbol === 'C' && p2.element.symbol === 'O') ||
            (p1.element.symbol === 'O' && p2.element.symbol === 'C')) {

            for (let k = 0; k < this.particles.length; k++) {
                if (k !== index1 && k !== index2) {
                    const p3 = this.particles[k];
                    if (p3.element.symbol === 'O' &&
                        p1.distanceTo(p3) < this.reactionDistance * 1.5 &&
                        p2.distanceTo(p3) < this.reactionDistance * 1.5) {

                        const centerX = (p1.x + p2.x + p3.x) / 3;
                        const centerY = (p1.y + p2.y + p3.y) / 3;

                        this.createExplosion(centerX, centerY, '#00ff88');
                        this.createMolecule(centerX, centerY, 'CO₂', '#00ff88');

                        this.particles.splice(Math.max(index1, index2, k), 1);
                        this.particles.splice(Math.min(Math.max(index1, index2), Math.max(index1, k), Math.max(index2, k)), 1);
                        this.particles.splice(Math.min(index1, index2, k), 1);

                        return true;
                    }
                }
            }
        }

        if ((p1.element.symbol === 'H' && p2.element.symbol === 'O') ||
            (p1.element.symbol === 'O' && p2.element.symbol === 'H')) {

            for (let k = 0; k < this.particles.length; k++) {
                if (k !== index1 && k !== index2) {
                    const p3 = this.particles[k];
                    if (p3.element.symbol === 'H' &&
                        p1.distanceTo(p3) < this.reactionDistance * 1.5 &&
                        p2.distanceTo(p3) < this.reactionDistance * 1.5) {

                        const centerX = (p1.x + p2.x + p3.x) / 3;
                        const centerY = (p1.y + p2.y + p3.y) / 3;

                        this.createExplosion(centerX, centerY, '#4488ff');
                        this.createMolecule(centerX, centerY, 'H₂O', '#4488ff');

                        this.particles.splice(Math.max(index1, index2, k), 1);
                        this.particles.splice(Math.min(Math.max(index1, index2), Math.max(index1, k), Math.max(index2, k)), 1);
                        this.particles.splice(Math.min(index1, index2, k), 1);

                        return true;
                    }
                }
            }
        }

        return false;
    }

    createMolecule(x, y, symbol, color) {
        const molecule = new ChemicalParticle(this.canvas);
        molecule.x = x;
        molecule.y = y;
        molecule.element = { symbol, color, name: symbol, valence: 0 };
        molecule.vx = (Math.random() - 0.5) * 0.3;
        molecule.vy = (Math.random() - 0.5) * 0.3;
        molecule.active = true;
        this.particles.push(molecule);
    }

    createExplosion(x, y, color) {
        const explosion = {
            x, y, color,
            radius: 5,
            maxRadius: 50,
            opacity: 1,
            particles: []
        };

        const newElementCount = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < newElementCount; i++) {
            const angle = (Math.PI * 2 * i) / newElementCount;
            const speed = 2 + Math.random() * 2;

            const newParticle = new ChemicalParticle(this.canvas);
            newParticle.x = x;
            newParticle.y = y;
            newParticle.vx = Math.cos(angle) * speed;
            newParticle.vy = Math.sin(angle) * speed;
            newParticle.active = true;

            explosion.particles.push(newParticle);
        }

        this.explosions.push(explosion);
    }

    updateExplosions() {
        this.explosions = this.explosions.filter(explosion => {
            explosion.radius += 0.5;
            explosion.opacity -= 0.01;

            if (explosion.opacity > 0) {
                this.ctx.beginPath();
                this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = explosion.color + Math.floor(explosion.opacity * 100).toString(16).padStart(2, '0');
                this.ctx.lineWidth = 3;
                this.ctx.stroke();

                explosion.particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vx *= 0.95;
                    particle.vy *= 0.95;

                    particle.draw(this.ctx, explosion.opacity);
                });

                return true;
            }

            explosion.particles.forEach(p => {
                p.vx *= 0.2;
                p.vy *= 0.2;
                p.active = false; // Reset to inactive when joining main pool
                this.particles.push(p);
            });

            return false;
        });
    }

    forceReactionAtPoint(x, y) {
        const nearbyParticles = this.particles.filter(p => {
            const dx = p.x - x;
            const dy = p.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 150;
        });

        if (nearbyParticles.length < 2) return;

        const elementGroups = {};
        nearbyParticles.forEach(p => {
            if (!elementGroups[p.element.symbol]) {
                elementGroups[p.element.symbol] = [];
            }
            elementGroups[p.element.symbol].push(p);
        });

        if (elementGroups['C'] && elementGroups['O'] && elementGroups['O'].length >= 2) {
            const c = elementGroups['C'][0];
            const o1 = elementGroups['O'][0];
            const o2 = elementGroups['O'][1];

            this.particles = this.particles.filter(p => p !== c && p !== o1 && p !== o2);
            this.createBigExplosion(x, y, '#00ff88', 'CO₂');
            return;
        }

        if (elementGroups['H'] && elementGroups['H'].length >= 2 && elementGroups['O']) {
            const h1 = elementGroups['H'][0];
            const h2 = elementGroups['H'][1];
            const o = elementGroups['O'][0];

            this.particles = this.particles.filter(p => p !== h1 && p !== h2 && p !== o);
            this.createBigExplosion(x, y, '#4488ff', 'H₂O');
            return;
        }
    }

    createBigExplosion(x, y, color, moleculeName) {
        const explosion = {
            x, y, color,
            radius: 10,
            maxRadius: 100,
            opacity: 1,
            particles: []
        };

        const newElementCount = Math.floor(Math.random() * 6) + 7;
        for (let i = 0; i < newElementCount; i++) {
            const angle = (Math.PI * 2 * i) / newElementCount;
            const speed = 3 + Math.random() * 3;

            const newParticle = new ChemicalParticle(this.canvas);
            newParticle.x = x;
            newParticle.y = y;
            newParticle.vx = Math.cos(angle) * speed;
            newParticle.vy = Math.sin(angle) * speed;
            newParticle.active = true;

            explosion.particles.push(newParticle);
        }

        if (moleculeName) {
            this.createMolecule(x, y, moleculeName, color);
        }

        this.explosions.push(explosion);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frame++;

        if (this.frame % 60 === 0) {
            this.updateContentAreas();
        }

        // Reset active state
        this.particles.forEach(p => {
            if (p !== this.draggedParticle) p.active = false;
        });

        // Check proximity for coloring
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];

                if (Math.abs(p1.x - p2.x) > 120 || Math.abs(p1.y - p2.y) > 120) continue;

                const distSq = p1.distanceToSquared(p2);

                if (distSq < 14400 && p1.canBondWith(p2)) { // 120^2 = 14400
                    p1.active = true;
                    p2.active = true;
                }
            }
        }

        if (this.frame % 20 === 0) {
            this.checkChemicalReactions();
        }

        this.updateExplosions();

        this.particles.forEach(particle => {
            particle.update();

            const overContent = this.isOverContent(particle.x, particle.y);
            const baseOpacity = overContent ? 0.15 : 0.6;

            particle.draw(this.ctx, baseOpacity);
        });

        if (this.mouse.x !== null && this.mouse.y !== null) {
            this.particles.forEach(particle => {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distSq = dx * dx + dy * dy;
                const maxDistSq = this.maxDistance * this.maxDistance;

                if (distSq < maxDistSq) {
                    const distance = Math.sqrt(distSq);
                    const opacity = 1 - (distance / this.maxDistance);

                    this.particles.forEach(other => {
                        if (particle !== other) {
                            const particleDistSq = particle.distanceToSquared(other);
                            if (particleDistSq < maxDistSq) {
                                const particleDistance = Math.sqrt(particleDistSq);
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

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ChemicalBackground();
    }, 100);
});
