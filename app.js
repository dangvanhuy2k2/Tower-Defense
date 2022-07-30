import waypoints from "./waypoint.js";
import placementTilesData from "./placementTilesData.js";
import { checkCollisionArc, checkMouseCollision } from "./ultil.js";
import PlacementTile from "./classes/PlacementTile.js";
import Building from "./classes/Building.js";
import Enemy from "./classes/Enemy.js";
import Projectile from "./classes/Projectile.js";
import Explosion from "./classes/Explosion.js";

window.addEventListener("load", () => {
  /* @type {HTMLCanvasElement} */
  const canvas = document.querySelector("canvas");
  const c = canvas.getContext("2d");

  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  canvas.width = 1280;
  canvas.height = 768;
  const gameMap = document.getElementById("gameMap");
  let enemyCount = 3;
  let timerSpawnEnemy = 500;
  let timerIdSpawnEnemy = null;
  let gameHearts = 10;
  let coins = 100;
  document.getElementById("coins").innerText = coins;

  const placementTilesData2D = [];

  for (let i = 0; i < placementTilesData.length; i += 20) {
    placementTilesData2D.push(placementTilesData.slice(i, i + 20));
  }

  const placementTiles = [];

  placementTilesData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 14)
        placementTiles.push(new PlacementTile({ x: x * 64, y: y * 64 }));
    });
  });

  const handlePlacementTiles = () => {
    placementTiles.forEach((placementTile) => placementTile.update());
  };

  const mouse = {
    x: undefined,
    y: undefined,
  };

  const canvasPosition = canvas.getBoundingClientRect();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
  });

  const buildings = [];
  window.addEventListener("click", (e) => {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;

    for (let i = 0; i < placementTiles.length; ++i) {
      if (
        checkMouseCollision(mouse, placementTiles[i]) &&
        coins - 50 >= 0 &&
        placementTiles[i].isEmpty
      ) {
        placementTiles[i].isEmpty = false;
        coins -= 50;
        document.getElementById("coins").innerText = coins;
        buildings.push(
          new Building({ x: placementTiles[i].x, y: placementTiles[i].y })
        );
        buildings.sort((a, b) => a.y - b.y);
      }
    }
  });

  let explosions = [];

  const handleExplosion = () => {
    explosions.forEach((explosion) => {
      explosion.update(c);
    });

    explosions = explosions.filter((explosion) => !explosion.markForDeletion);
  };

  let enemies = [];

  const spawnEnemies = (spawnNumber) => {
    for (let i = 1; i < spawnNumber + 1; ++i) {
      const xOffset = i * 100;

      enemies.push(
        new Enemy({
          x: waypoints[0].x - xOffset,
          y: waypoints[0].y,
        })
      );
    }

    enemyCount += 2;
  };

  spawnEnemies(enemyCount);

  const handleBuildings = () => {
    buildings.forEach((building) => {
      building.update(c, mouse);

      building.projectiles.forEach((projectile) => {
        projectile.update(c);

        //check collision
        if (checkCollisionArc(projectile, projectile.enemy)) {
          projectile.enemy.health -= 20;

          explosions.push(new Explosion(projectile.enemy));

          if (projectile.enemy.health <= 0)
            projectile.enemy.markForDeletion = true;
          projectile.markForDeletion = true;
        }
      });

      building.projectiles = building.projectiles.filter(
        (projectile) => !projectile.markForDeletion
      );

      const enemyAttack = enemies.find((enemy) => {
        const xDistance = enemy.x - building.center.x;
        const yDistance = enemy.y - building.center.y;

        const distance = Math.sqrt(
          xDistance * xDistance + yDistance * yDistance
        );

        return distance < enemy.radius + building.radius;
      });

      if (enemyAttack && building.isAttacking) {
        building.target = enemyAttack;
        building.isAttacking = false;
      }
    });
  };

  const handleDisplayText = () => {
    document.getElementById("hearts").innerText = gameHearts;
  };

  const handleEnemies = () => {
    enemies.forEach((enemy) => {
      enemy.update(c);
      if (enemy.x - enemy.radius > canvas.width) {
        enemy.markForDeletion = true;
        --gameHearts;
      }
    });
    enemies = enemies.filter((enemy) => {
      if (enemy.health <= 0) {
        coins += 25;
        enemy.markForDeletion = true;
        document.getElementById("coins").innerText = coins;
      }
      return !enemy.markForDeletion;
    });
  };

  const animate = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(gameMap, 0, 0, canvas.width, canvas.height);
    handleDisplayText();

    placementTiles.forEach((placementTile) => placementTile.update(c, mouse));
    handleEnemies();
    handleBuildings();
    handleExplosion();

    if (!timerIdSpawnEnemy && enemies.length === 0) {
      timerIdSpawnEnemy = setTimeout(
        () => spawnEnemies(enemyCount),
        timerSpawnEnemy
      );
    }
    if (gameHearts) requestAnimationFrame(animate);
    else {
      document.getElementById("gameOver").style.display = "flex";
    }
  };

  animate();
});
