import { Application, HTMLText, Container, Graphics } from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ resizeTo: window, backgroundAlpha: 0.0, autoDensity: true, resolution: window.devicePixelRatio});
  app.stage.hitArea = app.screen;
  document.getElementById("pixi-container").appendChild(app.canvas);

  const orangutan = new HTMLText({
    text: "🦧",
    style: { fontSize: 100 }
  });
  orangutan.anchor.set(0.5);
  orangutan.position.set(app.screen.width / 2, app.screen.height / 2);
  orangutan.velocity = { x: 0, y: 0 };
  orangutan.scale.set(0.35);
  app.stage.addChild(orangutan);

  const magnetIcon = new HTMLText({
    text: "🧲",
    style: { fontSize: 100 }
  });
  const lightningIcon = new HTMLText({
    text: "⚡",
    style: { fontSize: 100 },
    position: { x: 0, y: magnetIcon.height },
    visible: false
  });
  
  const magnet = new Container();
  magnet.addChild(magnetIcon);
  magnet.addChild(lightningIcon);
  magnet.scale.set(0.35);
  magnet.pivot.set(magnetIcon.width / 2, magnetIcon.height / 2);
  magnet.position.set(app.screen.width / 2, app.screen.height / 2 - 200);
  magnet.active = false;
  app.stage.addChild(magnet);

  
  
  
  app.stage.eventMode = "static";
  app.stage.on("pointermove", (event) => {
    magnet.position.set(event.global.x, event.global.y);
  });
  app.stage.on("pointerdown", () => {
    magnet.active = true;
    lightningIcon.visible = true;
  });
  app.stage.on("pointerup", () => {
    magnet.active = false;
    lightningIcon.visible = false;
  });




  app.ticker.add((time) => {
    // rotate the magnet so it's always facing the orangutan
    const angle = Math.atan2(orangutan.y - magnet.y, orangutan.x - magnet.x);
    magnet.rotation = angle - Math.PI / 2;

    if (magnet.active) {
      const force = -0.4
      orangutan.velocity.x += Math.cos(angle) * force;
      orangutan.velocity.y += Math.sin(angle) * force;
    }
        // apply some friction so the orangutan slows down over time
    orangutan.velocity.x *= 0.95;
    orangutan.velocity.y *= 0.95;

    orangutan.position.x += orangutan.velocity.x;
    orangutan.position.y += orangutan.velocity.y;

    orangutan.rotation += 0.03 * time.deltaTime;
  });


  window.__PIXI_DEVTOOLS__ = {
    app: app,
  };
})();
