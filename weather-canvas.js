/**
 * Weather Canvas - Atmospheric Ambient Particle Engine
 * High-performance 2D canvas effects: Rain, Snow, Lightning, Stars, Sun Beams, Fog & Clouds
 */

class WeatherCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mode = 'clear-day'; // 'clear-day', 'clear-night', 'clouds', 'rain', 'thunder', 'snow', 'fog'
    this.lightningAlpha = 0;
    this.lastLightning = 0;
    this.animId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initMode(this.mode);
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.initMode(this.mode);
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.initMode(mode);
  }

  initMode(mode) {
    this.particles = [];
    const count = this.getParticleCount(mode);

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(mode));
    }
  }

  getParticleCount(mode) {
    const isMobile = window.innerWidth < 768;
    switch (mode) {
      case 'rain': return isMobile ? 80 : 160;
      case 'thunder': return isMobile ? 100 : 180;
      case 'snow': return isMobile ? 60 : 120;
      case 'clear-night': return isMobile ? 50 : 100;
      case 'fog': return isMobile ? 20 : 35;
      case 'clouds': return isMobile ? 15 : 25;
      case 'clear-day': default: return isMobile ? 25 : 45;
    }
  }

  createParticle(mode) {
    const w = this.width;
    const h = this.height;

    switch (mode) {
      case 'rain':
      case 'thunder':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          length: Math.random() * 18 + 12,
          speed: Math.random() * 10 + 14,
          opacity: Math.random() * 0.4 + 0.2,
          wind: Math.random() * 2 - 1
        };

      case 'snow':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1.5 + 0.8,
          wind: Math.random() * 1.2 - 0.6,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.03 + 0.01,
          opacity: Math.random() * 0.7 + 0.3
        };

      case 'clear-night':
        return {
          x: Math.random() * w,
          y: Math.random() * (h * 0.85),
          radius: Math.random() * 1.8 + 0.4,
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          baseOpacity: Math.random() * 0.5 + 0.3
        };

      case 'fog':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 140 + 80,
          speedX: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.08 + 0.03
        };

      case 'clouds':
        return {
          x: Math.random() * w,
          y: Math.random() * (h * 0.6),
          radius: Math.random() * 100 + 60,
          speedX: Math.random() * 0.4 + 0.15,
          opacity: Math.random() * 0.1 + 0.04
        };

      case 'clear-day':
      default:
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3 + 1,
          speedY: -(Math.random() * 0.4 + 0.1),
          speedX: Math.random() * 0.4 - 0.2,
          opacity: Math.random() * 0.3 + 0.15,
          pulse: Math.random() * Math.PI
        };
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.mode) {
      case 'rain':
        this.renderRain();
        break;
      case 'thunder':
        this.renderThunder();
        break;
      case 'snow':
        this.renderSnow();
        break;
      case 'clear-night':
        this.renderStars();
        break;
      case 'fog':
        this.renderFog();
        break;
      case 'clouds':
        this.renderClouds();
        break;
      case 'clear-day':
      default:
        this.renderSunBeams();
        break;
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  renderRain() {
    this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
    this.ctx.lineWidth = 1.2;
    this.ctx.lineCap = 'round';

    for (let p of this.particles) {
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + p.wind, p.y + p.length);
      this.ctx.stroke();

      p.y += p.speed;
      p.x += p.wind;

      if (p.y > this.height) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width) p.x = 0;
      if (p.x < 0) p.x = this.width;
    }
  }

  renderThunder() {
    this.renderRain();

    // Random lightning flash
    const now = Date.now();
    if (now - this.lastLightning > 4500 && Math.random() < 0.02) {
      this.lightningAlpha = Math.random() * 0.45 + 0.25;
      this.lastLightning = now;
    }

    if (this.lightningAlpha > 0) {
      this.ctx.fillStyle = `rgba(224, 231, 255, ${this.lightningAlpha})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.lightningAlpha -= 0.035;
      if (this.lightningAlpha < 0) this.lightningAlpha = 0;
    }
  }

  renderSnow() {
    for (let p of this.particles) {
      p.sway += p.swaySpeed;
      const swayOffset = Math.sin(p.sway) * 1.5;

      this.ctx.fillStyle = `rgba(240, 249, 255, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x + swayOffset, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      p.y += p.speed;
      p.x += p.wind;

      if (p.y > this.height) {
        p.y = -10;
        p.x = Math.random() * this.width;
      }
    }
  }

  renderStars() {
    for (let p of this.particles) {
      p.twinklePhase += p.twinkleSpeed;
      const alpha = p.baseOpacity + Math.sin(p.twinklePhase) * 0.25;

      this.ctx.fillStyle = `rgba(241, 245, 249, ${Math.max(0.1, alpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  renderFog() {
    for (let p of this.particles) {
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(226, 232, 240, ${p.opacity})`);
      grad.addColorStop(1, 'rgba(226, 232, 240, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      p.x += p.speedX;
      if (p.x - p.radius > this.width) {
        p.x = -p.radius;
        p.y = Math.random() * this.height;
      }
    }
  }

  renderClouds() {
    for (let p of this.particles) {
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(203, 213, 225, ${p.opacity})`);
      grad.addColorStop(1, 'rgba(203, 213, 225, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      p.x += p.speedX;
      if (p.x - p.radius > this.width) {
        p.x = -p.radius;
        p.y = Math.random() * (this.height * 0.6);
      }
    }
  }

  renderSunBeams() {
    // Soft glowing solar flare at top-right
    const sunX = this.width * 0.75;
    const sunY = 40;
    const grad = this.ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 280);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.18)');
    grad.addColorStop(0.5, 'rgba(251, 191, 36, 0.06)');
    grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Floating subtle warm dust motes
    for (let p of this.particles) {
      p.pulse += 0.02;
      const alpha = p.opacity + Math.sin(p.pulse) * 0.1;

      this.ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.05, alpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
    }
  }
}

// Global hook
window.addEventListener('DOMContentLoaded', () => {
  window.weatherCanvas = new WeatherCanvas('weather-canvas');
});
