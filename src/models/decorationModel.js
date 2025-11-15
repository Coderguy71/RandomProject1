const { query } = require('../utils/database');

/**
 * Get all available decorations
 */
const getAvailableDecorations = async (filters = {}) => {
  let whereClause = 'WHERE is_active = true';
  const values = [];
  let paramIndex = 1;

  if (filters.decoration_type) {
    whereClause += ` AND decoration_type = $${paramIndex++}`;
    values.push(filters.decoration_type);
  }

  if (filters.rarity) {
    whereClause += ` AND rarity = $${paramIndex++}`;
    values.push(filters.rarity);
  }

  const result = await query(
    `SELECT 
      id,
      name,
      description,
      decoration_type,
      rarity,
      cost_resources,
      unlock_requirement,
      image_url,
      created_at
    FROM village_decorations
    ${whereClause}
    ORDER BY 
      CASE rarity
        WHEN 'common' THEN 1
        WHEN 'uncommon' THEN 2
        WHEN 'rare' THEN 3
        WHEN 'legendary' THEN 4
        ELSE 5
      END,
      name`,
    values
  );

  return result.rows;
};

/**
 * Get decoration by ID
 */
const getDecorationById = async (decorationId) => {
  const result = await query(
    `SELECT 
      id,
      name,
      description,
      decoration_type,
      rarity,
      cost_resources,
      unlock_requirement,
      image_url,
      is_active,
      created_at,
      updated_at
    FROM village_decorations
    WHERE id = $1`,
    [decorationId]
  );

  return result.rows[0];
};

/**
 * Get user's owned decorations
 */
const getUserDecorations = async (userId) => {
  const result = await query(
    `SELECT 
      ud.id,
      ud.user_id,
      ud.decoration_id,
      ud.quantity,
      ud.acquired_at,
      vd.name,
      vd.description,
      vd.decoration_type,
      vd.rarity,
      vd.image_url
    FROM user_decorations ud
    JOIN village_decorations vd ON ud.decoration_id = vd.id
    WHERE ud.user_id = $1 AND ud.quantity > 0
    ORDER BY ud.acquired_at DESC`,
    [userId]
  );

  return result.rows;
};

/**
 * Check if user owns a decoration
 */
const userOwnsDecoration = async (userId, decorationId) => {
  const result = await query(
    `SELECT id, quantity
    FROM user_decorations
    WHERE user_id = $1 AND decoration_id = $2 AND quantity > 0`,
    [userId, decorationId]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Add decoration to user's inventory
 */
const addDecorationToInventory = async (userId, decorationId, quantity = 1) => {
  const existing = await userOwnsDecoration(userId, decorationId);

  if (existing) {
    const result = await query(
      `UPDATE user_decorations
       SET quantity = quantity + $1
       WHERE user_id = $2 AND decoration_id = $3
       RETURNING id, user_id, decoration_id, quantity, acquired_at`,
      [quantity, userId, decorationId]
    );
    return result.rows[0];
  } else {
    const result = await query(
      `INSERT INTO user_decorations (user_id, decoration_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, decoration_id, quantity, acquired_at`,
      [userId, decorationId, quantity]
    );
    return result.rows[0];
  }
};

/**
 * Remove decoration from user's inventory
 */
const removeDecorationFromInventory = async (userId, decorationId, quantity = 1) => {
  const existing = await userOwnsDecoration(userId, decorationId);

  if (!existing) {
    throw new Error('Decoration not found in inventory');
  }

  if (existing.quantity < quantity) {
    throw new Error('Insufficient quantity');
  }

  const result = await query(
    `UPDATE user_decorations
     SET quantity = quantity - $1
     WHERE user_id = $2 AND decoration_id = $3
     RETURNING id, user_id, decoration_id, quantity, acquired_at`,
    [quantity, userId, decorationId]
  );

  return result.rows[0];
};

/**
 * Get user's placed decorations
 */
const getPlacedDecorations = async (userId) => {
  const result = await query(
    `SELECT 
      udp.id,
      udp.user_id,
      udp.decoration_id,
      udp.position_x,
      udp.position_y,
      udp.placed_at,
      vd.name,
      vd.description,
      vd.decoration_type,
      vd.rarity,
      vd.image_url
    FROM user_decoration_placements udp
    JOIN village_decorations vd ON udp.decoration_id = vd.id
    WHERE udp.user_id = $1
    ORDER BY udp.placed_at DESC`,
    [userId]
  );

  return result.rows;
};

/**
 * Place decoration in village
 */
const placeDecoration = async (userId, decorationId, positionX = null, positionY = null) => {
  const owned = await userOwnsDecoration(userId, decorationId);

  if (!owned) {
    throw new Error('User does not own this decoration');
  }

  const result = await query(
    `INSERT INTO user_decoration_placements (user_id, decoration_id, position_x, position_y)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, decoration_id, position_x, position_y, placed_at, updated_at`,
    [userId, decorationId, positionX, positionY]
  );

  return result.rows[0];
};

/**
 * Remove placed decoration
 */
const removePlacedDecoration = async (userId, placementId) => {
  const result = await query(
    `DELETE FROM user_decoration_placements
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, decoration_id`,
    [placementId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Placement not found');
  }

  return result.rows[0];
};

/**
 * Update placement position
 */
const updatePlacementPosition = async (userId, placementId, positionX, positionY) => {
  const result = await query(
    `UPDATE user_decoration_placements
     SET position_x = $1, position_y = $2
     WHERE id = $3 AND user_id = $4
     RETURNING id, user_id, decoration_id, position_x, position_y, placed_at, updated_at`,
    [positionX, positionY, placementId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Placement not found');
  }

  return result.rows[0];
};

module.exports = {
  getAvailableDecorations,
  getDecorationById,
  getUserDecorations,
  userOwnsDecoration,
  addDecorationToInventory,
  removeDecorationFromInventory,
  getPlacedDecorations,
  placeDecoration,
  removePlacedDecoration,
  updatePlacementPosition,
};
