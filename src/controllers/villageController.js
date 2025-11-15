const { AppError } = require('../middleware/errorHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const villageModel = require('../models/villageModel');
const streakModel = require('../models/streakModel');
const decorationModel = require('../models/decorationModel');
const milestoneModel = require('../models/milestoneModel');
const villageHistoryModel = require('../models/villageHistoryModel');

/**
 * Get user's village state
 */
const getVillageState = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const village = await villageModel.getOrCreateVillageState(userId);
    const streak = await streakModel.getStreakStats(userId);
    const placedDecorations = await decorationModel.getPlacedDecorations(userId);

    const health = await villageModel.calculateVillageHealth(userId);

    if (health !== village.village_health) {
      await villageModel.updateVillageState(userId, { village_health: health });
      village.village_health = health;
    }

    const data = {
      village: {
        id: village.id,
        user_id: village.user_id,
        health: village.village_health,
        happiness: village.village_happiness,
        level: village.village_level,
        experience_points: village.experience_points,
        resources: village.resources,
        total_resources_earned: village.total_resources_earned,
        total_resources_spent: village.total_resources_spent,
        last_updated: village.last_updated,
        created_at: village.created_at,
      },
      streak: {
        current_streak: streak.current_streak,
        longest_streak: streak.longest_streak,
        is_practiced_today: streak.is_practiced_today,
        last_practice_date: streak.last_practice_date,
      },
      decorations: placedDecorations,
    };

    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get available decorations
 */
const getAvailableDecorations = async (req, res, next) => {
  try {
    const { decoration_type, rarity } = req.query;
    const userId = req.user.userId;

    const decorations = await decorationModel.getAvailableDecorations({
      decoration_type,
      rarity,
    });

    const userStats = await milestoneModel.getUserStats(userId);
    const village = await villageModel.getOrCreateVillageState(userId);

    const decorationsWithStatus = decorations.map(decoration => {
      const canAfford = 
        (village.resources.gold || 0) >= (decoration.cost_resources.gold || 0) &&
        (village.resources.gems || 0) >= (decoration.cost_resources.gems || 0) &&
        (village.resources.wood || 0) >= (decoration.cost_resources.wood || 0);

      let isUnlocked = true;
      if (decoration.unlock_requirement) {
        for (const [key, requiredValue] of Object.entries(decoration.unlock_requirement)) {
          if ((userStats[key] || 0) < requiredValue) {
            isUnlocked = false;
            break;
          }
        }
      }

      return {
        ...decoration,
        can_afford: canAfford,
        is_unlocked: isUnlocked,
      };
    });

    sendSuccess(res, decorationsWithStatus);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's owned decorations
 */
const getOwnedDecorations = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const decorations = await decorationModel.getUserDecorations(userId);

    sendSuccess(res, decorations);
  } catch (error) {
    next(error);
  }
};

/**
 * Purchase a decoration
 */
const purchaseDecoration = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id: decorationId } = req.params;

    const decoration = await decorationModel.getDecorationById(decorationId);

    if (!decoration) {
      throw new AppError('Decoration not found', 404);
    }

    if (!decoration.is_active) {
      throw new AppError('Decoration is not available', 400);
    }

    const userStats = await milestoneModel.getUserStats(userId);
    if (decoration.unlock_requirement) {
      for (const [key, requiredValue] of Object.entries(decoration.unlock_requirement)) {
        if ((userStats[key] || 0) < requiredValue) {
          throw new AppError(`Decoration is locked. Requirement: ${key} >= ${requiredValue}`, 403);
        }
      }
    }

    const village = await villageModel.spendResources(userId, decoration.cost_resources);

    const userDecoration = await decorationModel.addDecorationToInventory(userId, decorationId);

    await villageHistoryModel.logVillageEvent(
      userId,
      'decoration_purchased',
      `Purchased ${decoration.name}`,
      {
        decoration_id: decorationId,
        decoration_name: decoration.name,
        cost: decoration.cost_resources,
      }
    );

    sendSuccess(res, {
      decoration: userDecoration,
      village: {
        resources: village.resources,
      },
      message: `Successfully purchased ${decoration.name}`,
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Place a decoration in village
 */
const placeDecoration = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id: decorationId } = req.params;
    const { position_x, position_y } = req.body;

    const placement = await decorationModel.placeDecoration(
      userId,
      decorationId,
      position_x,
      position_y
    );

    const decoration = await decorationModel.getDecorationById(decorationId);

    await villageHistoryModel.logVillageEvent(
      userId,
      'decoration_placed',
      `Placed ${decoration.name} in village`,
      {
        placement_id: placement.id,
        decoration_id: decorationId,
        decoration_name: decoration.name,
        position: { x: position_x, y: position_y },
      }
    );

    sendSuccess(res, placement, 201, 'Decoration placed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a placed decoration
 */
const removePlacedDecoration = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { placementId } = req.params;

    const removed = await decorationModel.removePlacedDecoration(userId, placementId);

    await villageHistoryModel.logVillageEvent(
      userId,
      'decoration_removed',
      'Removed decoration from village',
      {
        placement_id: placementId,
        decoration_id: removed.decoration_id,
      }
    );

    sendSuccess(res, removed, 200, 'Decoration removed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get milestones with progress
 */
const getMilestones = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const milestones = await milestoneModel.getMilestonesWithProgress(userId);

    sendSuccess(res, milestones);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current streak information
 */
const getStreakInfo = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const streak = await streakModel.getStreakStats(userId);

    sendSuccess(res, streak);
  } catch (error) {
    next(error);
  }
};

/**
 * Get village history
 */
const getVillageHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, page_size = 20, event_type } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(page_size, 10);

    if (pageNum < 1 || pageSize < 1 || pageSize > 100) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const offset = (pageNum - 1) * pageSize;

    let history;
    let total;

    if (event_type) {
      history = await villageHistoryModel.getVillageHistoryByType(userId, event_type, pageSize);
      total = history.length;
    } else {
      history = await villageHistoryModel.getVillageHistory(userId, pageSize, offset);
      total = await villageHistoryModel.countVillageHistory(userId);
    }

    sendPaginated(res, history, total, pageNum, pageSize);
  } catch (error) {
    next(error);
  }
};

/**
 * Update village decoration position
 */
const updateDecorationPosition = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { placementId } = req.params;
    const { position_x, position_y } = req.body;

    if (position_x === undefined || position_y === undefined) {
      throw new AppError('Position coordinates are required', 400);
    }

    const updated = await decorationModel.updatePlacementPosition(
      userId,
      placementId,
      position_x,
      position_y
    );

    sendSuccess(res, updated, 200, 'Decoration position updated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVillageState,
  getAvailableDecorations,
  getOwnedDecorations,
  purchaseDecoration,
  placeDecoration,
  removePlacedDecoration,
  getMilestones,
  getStreakInfo,
  getVillageHistory,
  updateDecorationPosition,
};
