export const checkMouseCollision = (mouse, rect) =>
  mouse.x > rect.x &&
  mouse.x < rect.x + rect.width &&
  mouse.y > rect.y &&
  mouse.y < rect.y + rect.height;

export const checkCollisionArc = (arc1, arc2) => {
  const xDistance = arc1.x - arc2.x;
  const yDistance = arc1.y - arc2.y;

  const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

  return distance < arc1.radius + arc2.radius;
};
