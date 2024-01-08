const mongoose = require('mongoose');

const appsSchema = new mongoose.Schema({

  check_out_note: {
    type: String,
    required: true,
  },
  cart_page_note: {
    type: String,
    required: true,
  },
  app_maintenance: {
    type: Boolean,
    default: false,
  },
  product_service_policy: [],
  android_version: {
    type: String,
    default: '0.0.0',
  },
  app_current_version: {
    type: String,
    default: '0.0.0',
  },
  force_update: {
    type: Boolean,
    default: false,
  },
  is_popup: {
    type: Boolean,
    default: false,
  },
  popup_image: {
    type: String,
    default: '',
  },
  offer_banner: {
    type: String,
    default: '',
  },
  offer_text: {
    type: String,
    default: '',
  },
});

const AppSettings = mongoose.model('AppSettings', appsSchema);
module.exports = AppSettings;
