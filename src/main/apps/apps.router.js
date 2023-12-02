const express = require('express');
const apps_router = express.Router();
const appSettingsController = require('./apps.controller');


apps_router.post('/app/settings', appSettingsController.createAppSettings);
apps_router.get('/app/settings', appSettingsController.getAllAppSettings);
apps_router.patch('/app/settings/:id', appSettingsController.updateAppSettings);
apps_router.delete('/app/settings/:id', appSettingsController.deleteAppSettings);

module.exports = apps_router;
