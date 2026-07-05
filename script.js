(function () {
  const canvas = document.getElementById("cyber-scene");
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: false });
  const pointer = { x: 0.5, y: 0.5 };
  let width = 0;
  let height = 0;
  let deviceRatio = 1;
  let nodes = [];

  function resize() {
    deviceRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * deviceRatio);
    canvas.height = Math.floor(height * deviceRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);

    const count = Math.max(42, Math.floor((width * height) / 25000));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: (index * 97) % width,
      y: (index * 193) % height,
      vx: ((index % 5) - 2) * 0.08,
      vy: (((index + 2) % 5) - 2) * 0.08,
      phase: index * 0.37,
    }));
  }

  function drawGrid(time) {
    const horizon = height * 0.64;
    context.strokeStyle = "rgba(34, 247, 255, 0.18)";
    context.lineWidth = 1;

    for (let x = -width; x < width * 2; x += 72) {
      const drift = (time * 0.03 + pointer.x * 20) % 72;
      context.beginPath();
      context.moveTo(x + drift, horizon);
      context.lineTo((x - width / 2) * 2.2 + width / 2, height);
      context.stroke();
    }

    for (let i = 0; i < 16; i += 1) {
      const offset = (time * 0.05 + i * 28) % 420;
      const y = horizon + Math.pow(i / 15, 2.3) * (height - horizon) + offset * 0.12;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  function drawNodes(time) {
    context.lineWidth = 1;

    for (const node of nodes) {
      node.x += node.vx + (pointer.x - 0.5) * 0.08;
      node.y += node.vy + (pointer.y - 0.5) * 0.08;

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
    }

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 145) {
          const alpha = (1 - distance / 145) * 0.26;
          context.strokeStyle = `rgba(255, 43, 214, ${alpha})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    for (const node of nodes) {
      const pulse = 0.55 + Math.sin(time * 0.002 + node.phase) * 0.45;
      context.fillStyle = `rgba(34, 247, 255, ${0.28 + pulse * 0.44})`;
      context.fillRect(node.x - 1.5, node.y - 1.5, 3, 3);
    }
  }

  function frame(time) {
    context.fillStyle = "#05060d";
    context.fillRect(0, 0, width, height);

    const glow = context.createLinearGradient(0, 0, width, height);
    glow.addColorStop(0, "rgba(255, 43, 214, 0.12)");
    glow.addColorStop(0.52, "rgba(34, 247, 255, 0.08)");
    glow.addColorStop(1, "rgba(183, 255, 42, 0.07)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    drawGrid(time);
    drawNodes(time);

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / Math.max(window.innerWidth, 1);
    pointer.y = event.clientY / Math.max(window.innerHeight, 1);
  });

  resize();
  requestAnimationFrame(frame);
})();
