class SpaceTheme {
    constructor(w, h, maxDepth = 1000) {
        this.maxDepth = maxDepth;
        this.stars = [];
        this.bodies = [];
        this.galaxies = [];
        this.comets = [];
        this.init(w, h);
    }

    init(w, h) {
        this.starMaxDepth = 600; // shorten max depth of stars
        // --- Stars Setup ---
        const starCount = 688;
        this.stars = [];
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: (Math.random() - 0.5) * w * 3,
                y: (Math.random() - 0.5) * h * 3,
                z: Math.random() * this.starMaxDepth,
                size: Math.random() * 1.5 + 0.9,
                color: Math.random() > 0.45 ? '#ff6a00' : '#00f3ff'
            });
        }

        // --- Planets and Black Hole Setup ---
        this.bodies = [
            {
                type: 'planet',
                name: 'Earth',
                x: -w * 0.35,
                y: -h * 0.2,
                z: 220,
                baseRadius: 30,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0.008,
                moons: [
                    { name: 'Moon', angle: 0, speed: 0.015, orbitDist: 1.8, size: 4, color: '#b0b0b0' }
                ]
            },
            {
                type: 'planet',
                name: 'Mars',
                x: w * 0.4,
                y: h * 0.3,
                z: 420,
                baseRadius: 18,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0.01,
                colorLight: '#ff826e',
                colorDark: '#5e1b10',
                moons: [
                    { name: 'Phobos', angle: 0, speed: 0.03, orbitDist: 1.7, size: 2.2, color: '#8c7d75' },
                    { name: 'Deimos', angle: Math.PI, speed: 0.02, orbitDist: 2.3, size: 1.6, color: '#7a6f68' }
                ]
            },
            {
                type: 'planet',
                name: 'Jupiter',
                x: -w * 0.4,
                y: h * 0.25,
                z: 600,
                baseRadius: 46,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0.005,
                moons: [
                    { name: 'Io', angle: 0, speed: 0.025, orbitDist: 1.45, size: 3, color: '#e0df9b' },
                    { name: 'Europa', angle: 1.2, speed: 0.018, orbitDist: 1.75, size: 2.8, color: '#b5cdd8' },
                    { name: 'Ganymede', angle: 2.5, speed: 0.012, orbitDist: 2.1, size: 3.8, color: '#a69d95' },
                    { name: 'Callisto', angle: 4.2, speed: 0.008, orbitDist: 2.5, size: 3.5, color: '#7a7672' }
                ]
            },
            {
                type: 'planet',
                name: 'Saturn',
                x: w * 0.35,
                y: -h * 0.35,
                z: 780,
                baseRadius: 38,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0.006,
                hasRings: true,
                ringColor: 'rgba(235, 207, 155, 0.4)',
                ringAngle: Math.PI / 8,
                moons: [
                    { name: 'Titan', angle: 0.5, speed: 0.01, orbitDist: 2.2, size: 3.6, color: '#e0b869' }
                ]
            },
            {
                type: 'blackhole',
                name: 'Gargantua',
                x: w * 0.04,
                y: h * 0.02,
                z: 320,
                baseRadius: 28,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0.02
            }
        ];

        // --- Galaxies Setup ---
        const createGalaxy = (gx, gy, gz, coreColor, outerColor) => {
            const localStars = [];
            const arms = 2;
            const count = 75;
            for (let j = 0; j < count; j++) {
                const theta = (j / count) * Math.PI * 7;
                const armAngle = ((j % arms) * 2 * Math.PI) / arms;
                const rFactor = 10 * Math.pow(1.11, j);
                const angle = theta + armAngle;
                localStars.push({
                    dx: Math.cos(angle) * rFactor,
                    dy: Math.sin(angle) * rFactor,
                    dz: (Math.random() - 0.5) * 10,
                    size: Math.random() * 0.6 + 0.3,
                    color: j < 25 ? coreColor : outerColor
                });
            }
            return {
                x: gx,
                y: gy,
                z: gz,
                coreColor: 'rgba(255, 235, 200, 0.45)',
                stars: localStars,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0.003
            };
        };

        this.galaxies = [
            createGalaxy(w * 0.4, -h * 0.4, 450, '#ffc78f', '#00f3ff'),
            createGalaxy(-w * 0.45, -h * 0.1, 740, '#ff9666', '#bd00ff')
        ];
    }

    spawnComet(w, h) {
        if (this.comets.length >= 4) return;
        this.comets.push({
            x: (Math.random() * w * 2) - w,
            y: -h * 1.5,
            z: Math.random() * 400 + 400,
            vx: (Math.random() - 0.3) * 8 + 4,
            vy: (Math.random() * 5) + 6,
            vz: -Math.random() * 3 - 2,
            baseRadius: Math.random() * 3 + 5,
            trailPoints: []
        });
    }

    resetPosition(obj, w, h) {
        if (obj.type === 'blackhole') {
            obj.z = 3000;
            obj.x = (Math.random() - 0.5) * w * 0.15;
            obj.y = (Math.random() - 0.5) * h * 0.15;
        } else {
            obj.z = this.maxDepth;
            obj.x = (Math.random() - 0.5) * w * 1.8;
            obj.y = (Math.random() - 0.5) * h * 1.8;
        }
    }

    resetPositionBack(obj, w, h) {
        obj.z = 10;
        if (obj.type === 'blackhole') {
            obj.x = (Math.random() - 0.5) * w * 0.15;
            obj.y = (Math.random() - 0.5) * h * 0.15;
        } else {
            obj.x = (Math.random() - 0.5) * w * 1.8;
            obj.y = (Math.random() - 0.5) * h * 1.8;
        }
    }

    update(depthChange, mouseX, mouseY, w, h) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        
        if (Math.random() < 0.015) {
            this.spawnComet(w, h);
        }

        // 1. Update Galaxies
        this.galaxies.forEach(g => {
            g.z -= depthChange;
            g.rotation += g.rotSpeed;
            g.x += mouseX * 0.005;
            g.y += mouseY * 0.005;

            if (g.z <= 0) {
                this.resetPosition(g, w, h);
            } else if (g.z > this.maxDepth) {
                this.resetPositionBack(g, w, h);
            }
        });

        // 2. Update Stars
        this.stars.forEach(p => {
            p.z -= depthChange;
            p.x += mouseX * 0.015;
            p.y += mouseY * 0.015;

            let reset = false;
            if (p.z <= 0) {
                p.z = this.starMaxDepth;
                p.x = (Math.random() - 0.5) * w * 3;
                p.y = (Math.random() - 0.5) * h * 3;
                reset = true;
            } else if (p.z > this.starMaxDepth) {
                p.z = 10;
                p.x = (Math.random() - 0.5) * w * 3;
                p.y = (Math.random() - 0.5) * h * 3;
                reset = true;
            }
            if (reset) p.history = [];
        });

        // 3. Update Planets and Black Hole
        this.bodies.forEach(p => {
            p.z -= depthChange;
            p.rotation += p.rotSpeed;
            p.x += mouseX * 0.01;
            p.y += mouseY * 0.01;

            const limit = p.type === 'blackhole' ? 3000 : this.maxDepth;
            let resetOccurred = false;
            if (p.z <= 0) {
                this.resetPosition(p, w, h);
                resetOccurred = true;
            } else if (p.z > limit) {
                this.resetPositionBack(p, w, h);
                resetOccurred = true;
            }

            if (p.moons) {
                p.moons.forEach(m => {
                    m.angle += m.speed;
                    if (resetOccurred) m.history = [];
                });
            }
        });

        // 4. Update Comets
        this.comets.forEach(c => {
            c.x += c.vx;
            c.y += c.vy;
            c.z += c.vz - depthChange;

            const factor = 250 / c.z;
            const cx = c.x * factor + w / 2;
            const cy = c.y * factor + h / 2;
            
            if (!c.trailPoints) c.trailPoints = [];
            c.trailPoints.push({ x: cx, y: cy, factor: factor });
            if (c.trailPoints.length > 8) c.trailPoints.shift();
        });
        this.comets = this.comets.filter(c => c.z > 30 && c.z < 2000 && c.y < h * 2 && c.x > -w * 2 && c.x < w * 2);
    }

    draw(ctx, w, h, themeTransitionAlpha, scrollSpeed) {
        ctx.save();
        ctx.globalAlpha = themeTransitionAlpha;

        // 1. Draw Galaxies
        this.galaxies.forEach(g => {
            const factor = 250 / g.z;
            const gx = g.x * factor + w / 2;
            const gy = g.y * factor + h / 2;

            if (gx > -200 && gx < w + 200 && gy > -200 && gy < h + 200) {
                const alpha = Math.min(1, (1 - g.z / this.maxDepth) * 1.5);
                ctx.beginPath();
                const coreRad = 40 * factor;
                const coreGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, coreRad);
                coreGrad.addColorStop(0, g.coreColor);
                coreGrad.addColorStop(0.3, g.coreColor);
                coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = coreGrad;
                ctx.globalAlpha = themeTransitionAlpha * alpha;
                ctx.arc(gx, gy, coreRad, 0, Math.PI * 2);
                ctx.fill();

                const cos = Math.cos(g.rotation);
                const sin = Math.sin(g.rotation);

                g.stars.forEach(s => {
                    const rx = s.dx * cos - s.dy * sin;
                    const ry = s.dx * sin + s.dy * cos;
                    const absZ = g.z + s.dz;
                    const sFactor = 250 / absZ;
                    const sx = (g.x + rx) * sFactor + w / 2;
                    const sy = (g.y + ry) * sFactor + h / 2;

                    if (sx > 0 && sx < w && sy > 0 && sy < h) {
                        const sAlpha = Math.min(1, (1 - absZ / this.maxDepth) * 1.5);
                        ctx.beginPath();
                        ctx.fillStyle = s.color;
                        ctx.globalAlpha = themeTransitionAlpha * sAlpha;
                        ctx.arc(sx, sy, s.size * sFactor * 0.35, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            }
        });

        // 2. Draw Stars
        this.stars.forEach(p => {
            const factor = 250 / p.z;
            const px = p.x * factor + w / 2;
            const py = p.y * factor + h / 2;
            const alpha = Math.min(1, (1 - p.z / this.starMaxDepth) * 1.5);

            // Update star history
            if (!p.history) p.history = [];
            p.history.push({ x: px, y: py, factor: factor });
            if (p.history.length > 5) p.history.shift();

            // Draw star tail (same style as moon)
            if (p.history.length > 1) {
                for (let idx = 0; idx < p.history.length - 1; idx++) {
                    const pt1 = p.history[idx];
                    const pt2 = p.history[idx + 1];
                    const trailAlpha = (idx / p.history.length) * alpha * 0.75;
                    ctx.beginPath();
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = themeTransitionAlpha * trailAlpha;
                    ctx.lineWidth = p.size * pt1.factor * 0.5;
                    ctx.moveTo(pt1.x, pt1.y);
                    ctx.lineTo(pt2.x, pt2.y);
                    ctx.stroke();
                }
            }

            // Draw star head
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = themeTransitionAlpha * alpha;
            ctx.arc(px, py, p.size * factor * 0.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 3. Draw Planets and Black Hole
        this.bodies.forEach(p => {
            const factor = 250 / p.z;
            const px = p.x * factor + w / 2;
            const py = p.y * factor + h / 2;
            const r = p.baseRadius * factor;

            if (px > -r * 3 && px < w + r * 3 && py > -r * 3 && py < h + r * 3) {
                const limit = p.type === 'blackhole' ? 3000 : this.maxDepth;
                const alpha = Math.min(1, (1 - p.z / limit) * 2.0);

                // Update moon history once per frame
                if (p.moons) {
                    p.moons.forEach(m => {
                        const sin = Math.sin(m.angle);
                        const cos = Math.cos(m.angle);
                        const mx = px + cos * r * m.orbitDist;
                        const my = py + sin * r * m.orbitDist * 0.3;
                        
                        if (!m.history) m.history = [];
                        m.history.push({ x: mx, y: my, factor: factor });
                        if (m.history.length > 8) m.history.shift();
                    });
                }

                // Moon trails (drawn behind the planet core)
                if (p.moons) {
                    p.moons.forEach(m => {
                        if (m.history && m.history.length > 1) {
                            for (let idx = 0; idx < m.history.length - 1; idx++) {
                                const pt1 = m.history[idx];
                                const pt2 = m.history[idx + 1];
                                const trailAlpha = (idx / m.history.length) * alpha * 0.75;
                                ctx.beginPath();
                                ctx.strokeStyle = m.color;
                                ctx.globalAlpha = themeTransitionAlpha * trailAlpha;
                                ctx.lineWidth = m.size * pt1.factor * 1.3;
                                ctx.moveTo(pt1.x, pt1.y);
                                ctx.lineTo(pt2.x, pt2.y);
                                ctx.stroke();
                            }
                        }
                    });
                }

                // Moons behind planet
                if (p.moons) {
                    p.moons.forEach(m => {
                        const sin = Math.sin(m.angle);
                        if (sin < 0 && m.history && m.history.length > 0) {
                            const currentPos = m.history[m.history.length - 1];
                            const mRad = m.size * factor * 0.6;
                            ctx.beginPath();
                            ctx.fillStyle = m.color;
                            ctx.globalAlpha = themeTransitionAlpha * alpha;
                            ctx.arc(currentPos.x, currentPos.y, mRad, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    });
                }

                // Black Hole Accretion Disk Back
                if (p.type === 'blackhole') {
                    ctx.globalAlpha = themeTransitionAlpha * alpha;
                    ctx.strokeStyle = 'rgba(255, 120, 0, 0.75)';
                    ctx.lineWidth = r * 0.38;
                    ctx.beginPath();
                    ctx.ellipse(px, py, r * 2.4, r * 0.6, Math.PI / 12, Math.PI, 0, false);
                    ctx.stroke();

                    ctx.strokeStyle = 'rgba(255, 70, 0, 0.45)';
                    ctx.lineWidth = r * 0.6;
                    ctx.beginPath();
                    ctx.arc(px, py, r * 1.3, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Rings back (Saturn)
                if (p.hasRings) {
                    ctx.globalAlpha = themeTransitionAlpha * alpha;
                    ctx.beginPath();
                    ctx.strokeStyle = p.ringColor;
                    ctx.lineWidth = r * 0.18;
                    ctx.ellipse(px, py, r * 2.1, r * 0.42, p.ringAngle, 0, Math.PI, true);
                    ctx.stroke();
                }

                // Draw Core Body
                ctx.globalAlpha = themeTransitionAlpha * alpha;
                if (p.type === 'blackhole') {
                    ctx.beginPath();
                    ctx.fillStyle = '#000000';
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.name === 'Earth') {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.clip();

                    ctx.fillStyle = '#004c8c';
                    ctx.fillRect(px - r, py - r, r * 2, r * 2);

                    ctx.fillStyle = '#2d7a42';
                    const earthOffset = (p.rotation * r * 0.4) % (r * 3.5);
                    ctx.beginPath();
                    ctx.arc(px - r + earthOffset, py + r * 0.1, r * 0.5, 0, Math.PI * 2);
                    ctx.arc(px + r * 0.5 - r * 1.8 + earthOffset, py - r * 0.25, r * 0.45, 0, Math.PI * 2);
                    ctx.arc(px - r * 2.2 + earthOffset, py - r * 0.1, r * 0.4, 0, Math.PI * 2);
                    ctx.arc(px - r * 0.1 + earthOffset, py - r * 0.4, r * 0.35, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    const cloudOffset = (p.rotation * r * 0.55) % (r * 3.5);
                    ctx.beginPath();
                    ctx.ellipse(px - r * 0.8 + cloudOffset, py - r * 0.3, r * 0.7, r * 0.15, 0, 0, Math.PI * 2);
                    ctx.ellipse(px - r * 2.1 + cloudOffset, py + r * 0.25, r * 0.85, r * 0.18, 0, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();

                    ctx.beginPath();
                    const earthGrad = ctx.createRadialGradient(px - r * 0.28, py - r * 0.28, r * 0.05, px, py, r);
                    earthGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
                    earthGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.75)');
                    earthGrad.addColorStop(1, 'rgba(0, 0, 0, 0.96)');
                    ctx.fillStyle = earthGrad;
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.name === 'Jupiter') {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.clip();

                    ctx.fillStyle = '#bfa580';
                    ctx.fillRect(px - r, py - r, r * 2, r * 2);

                    ctx.fillStyle = '#6e4b3b';
                    ctx.fillRect(px - r, py - r * 0.48, r * 2, r * 0.18);
                    ctx.fillRect(px - r, py + r * 0.15, r * 2, r * 0.14);

                    ctx.fillStyle = '#d9cbb8';
                    ctx.fillRect(px - r, py - r * 0.2, r * 2, r * 0.15);
                    ctx.fillRect(px - r, py + r * 0.42, r * 2, r * 0.12);

                    ctx.fillStyle = '#9e3223';
                    const spotX = px - r * 0.6 + (p.rotation * r * 0.2) % (r * 2);
                    if (spotX > px - r * 0.8 && spotX < px + r * 0.8) {
                        ctx.beginPath();
                        ctx.ellipse(spotX, py + r * 0.2, r * 0.24, r * 0.14, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();

                    ctx.beginPath();
                    const jupGrad = ctx.createRadialGradient(px - r * 0.28, py - r * 0.28, r * 0.05, px, py, r);
                    jupGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
                    jupGrad.addColorStop(0.85, 'rgba(0,0,0,0.72)');
                    jupGrad.addColorStop(1, 'rgba(0,0,0,0.96)');
                    ctx.fillStyle = jupGrad;
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.name === 'Saturn') {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.clip();

                    ctx.fillStyle = '#d6b885';
                    ctx.fillRect(px - r, py - r, r * 2, r * 2);

                    ctx.fillStyle = '#8f7756';
                    ctx.fillRect(px - r, py - r * 0.35, r * 2, r * 0.14);
                    ctx.fillRect(px - r, py + r * 0.1, r * 2, r * 0.12);
                    ctx.restore();

                    ctx.beginPath();
                    const satGrad = ctx.createRadialGradient(px - r * 0.28, py - r * 0.28, r * 0.05, px, py, r);
                    satGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
                    satGrad.addColorStop(0.85, 'rgba(0,0,0,0.75)');
                    satGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
                    ctx.fillStyle = satGrad;
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    const grad = ctx.createRadialGradient(px - r * 0.28, py - r * 0.28, r * 0.05, px, py, r);
                    grad.addColorStop(0, p.colorLight);
                    grad.addColorStop(0.3, p.colorLight);
                    grad.addColorStop(0.85, p.colorDark);
                    grad.addColorStop(1, '#050508');
                    ctx.fillStyle = grad;
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Black Hole Accretion Disk Front
                if (p.type === 'blackhole') {
                    ctx.globalAlpha = themeTransitionAlpha * alpha;
                    ctx.strokeStyle = 'rgba(255, 120, 0, 0.75)';
                    ctx.lineWidth = r * 0.38;
                    ctx.beginPath();
                    ctx.ellipse(px, py, r * 2.4, r * 0.6, Math.PI / 12, 0, Math.PI, false);
                    ctx.stroke();

                    ctx.strokeStyle = 'rgba(255, 185, 30, 0.85)';
                    ctx.lineWidth = r * 0.16;
                    ctx.beginPath();
                    ctx.ellipse(px, py, r * 1.25, r * 1.25, 0, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Rings front (Saturn)
                if (p.hasRings) {
                    ctx.globalAlpha = themeTransitionAlpha * alpha;
                    ctx.beginPath();
                    ctx.strokeStyle = p.ringColor;
                    ctx.lineWidth = r * 0.18;
                    ctx.ellipse(px, py, r * 2.1, r * 0.42, p.ringAngle, 0, Math.PI, false);
                    ctx.stroke();
                }

                // Moons in front of planet
                if (p.moons) {
                    p.moons.forEach(m => {
                        const sin = Math.sin(m.angle);
                        if (sin >= 0 && m.history && m.history.length > 0) {
                            const currentPos = m.history[m.history.length - 1];
                            const mRad = m.size * factor * 0.6;
                            ctx.beginPath();
                            ctx.fillStyle = m.color;
                            ctx.globalAlpha = themeTransitionAlpha * alpha;
                            ctx.arc(currentPos.x, currentPos.y, mRad, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    });
                }
            }
        });

        // 4. Draw Comets
        this.comets.forEach(c => {
            const factor = 250 / c.z;
            const cx = c.x * factor + w / 2;
            const cy = c.y * factor + h / 2;
            const r = c.baseRadius * factor;

            if (cx > -100 && cx < w + 100 && cy > -100 && cy < h + 100) {
                const alpha = Math.min(1, (1 - c.z / this.maxDepth) * 2.0);

                // Draw comet trail (tail)
                if (c.trailPoints && c.trailPoints.length > 1) {
                    for (let idx = 0; idx < c.trailPoints.length - 1; idx++) {
                        const pt1 = c.trailPoints[idx];
                        const pt2 = c.trailPoints[idx + 1];
                        const trailAlpha = (idx / c.trailPoints.length) * alpha * 0.75;
                        
                        ctx.beginPath();
                        ctx.strokeStyle = '#ffe8b5';
                        ctx.globalAlpha = themeTransitionAlpha * trailAlpha;
                        ctx.lineWidth = c.baseRadius * pt1.factor * 1.3;
                        ctx.moveTo(pt1.x, pt1.y);
                        ctx.lineTo(pt2.x, pt2.y);
                        ctx.stroke();
                    }
                }

                // Draw comet head
                ctx.beginPath();
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.3, '#ffe8b5');
                grad.addColorStop(1, 'rgba(255, 200, 140, 0)');
                ctx.fillStyle = grad;
                ctx.globalAlpha = themeTransitionAlpha * alpha;
                ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.restore();
    }

    getBlackHole() {
        return this.bodies.find(b => b.type === 'blackhole') || null;
    }
}

window.SpaceTheme = SpaceTheme;
