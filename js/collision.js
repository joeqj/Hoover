// A basic AABB check
function testForAABB(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    bounds2.x = bounds2.x - hooverCollisionOffset;
    bounds2.y = bounds2.y + 20;

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds2.width - hooverCollisionWidth > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds2.height - 320 > bounds2.y;
}

// Calculates the results of a collision, object2 = hoover
function collisionResponse(object1, object2) {
    if (!object1 || !object2) {
        return new PIXI.Point(0);
    }
    const vCollision = new PIXI.Point(
        object2.x - object1.x,
        object2.y - object1.y,
    );
    const distance = Math.sqrt(
        (object2.x - object1.x) * (object2.x - object1.x)
        + (object2.y - (object1.y)) * (object2.y - object1.y),
    );
    const vCollisionNorm = new PIXI.Point(
        vCollision.x / distance,
        vCollision.y / distance,
    );
    const vRelativeVelocity = new PIXI.Point(
        object1.acceleration.x - object2.acceleration.x,
        object1.acceleration.y - object2.acceleration.y,
    );
    const speed = vRelativeVelocity.x * vCollisionNorm.x
        + vRelativeVelocity.y * vCollisionNorm.y;
    const impulse = impulsePower * speed / (object1.mass + object2.mass);

    return new PIXI.Point(
        impulse * vCollisionNorm.x,
        impulse * vCollisionNorm.y,
    );
}

// Calculate the distance between two given points
function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.hypot(a, b);
}
