const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, villageController.getVillageState);

router.get('/decorations', authenticate, villageController.getAvailableDecorations);
router.get('/decorations/owned', authenticate, villageController.getOwnedDecorations);
router.post('/decorations/:id/purchase', authenticate, villageController.purchaseDecoration);
router.post('/decorations/:id/place', authenticate, villageController.placeDecoration);
router.delete('/decorations/placements/:placementId', authenticate, villageController.removePlacedDecoration);
router.put('/decorations/placements/:placementId', authenticate, villageController.updateDecorationPosition);

router.get('/milestones', authenticate, villageController.getMilestones);

router.get('/streak', authenticate, villageController.getStreakInfo);

router.get('/history', authenticate, villageController.getVillageHistory);

module.exports = router;
