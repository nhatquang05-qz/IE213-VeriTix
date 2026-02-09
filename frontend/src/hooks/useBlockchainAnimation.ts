import { useEffect } from 'react';

class Node {
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
    ctx.fill();
  }
}

export const useBlockchainAnimation = () => {
  useEffect(() => {
    const canvas = document.getElementById('blockchainCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 600;

    const nodes: Node[] = [];
    for (let i = 0; i < 30; i++) {
      nodes.push(new Node(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(node => {
        node.update(canvas.width, canvas.height);
        node.draw(ctx);
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 102, 255, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
};
