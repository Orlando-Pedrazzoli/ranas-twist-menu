import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema({
  name: {
    pt: { type: String, required: true },
    en: { type: String, required: true },
  },
  description: {
    pt: { type: String, required: true },
    en: { type: String, required: true },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  compareAtPrice: Number,
  images: [{
    url: String,
    cloudinaryId: String,
    thumbnailUrl: String,
    isPrimary: Boolean,
  }],
  dietaryInfo: {
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    dairyFree: { type: Boolean, default: false },
    halal: { type: Boolean, default: true },
  },
  allergens: [String],
  spiceLevel: {
    type: Number,
    min: 0,
    max: 4,
    default: 1,
  },
  badges: [{
    type: {
      type: String,
      enum: ['popular', 'chef-special', 'new'],
    },
    priority: Number,
    validUntil: Date,
  }],
  customizations: [{
    name: {
      pt: String,
      en: String,
    },
    required: Boolean,
    options: [{
      name: {
        pt: String,
        en: String,
      },
      priceModifier: Number,
    }],
  }],
  searchTags: [String],
  displayOrder: {
    type: Number,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for performance
DishSchema.index({ category: 1, displayOrder: 1 });
DishSchema.index({ 
  'name.pt': 'text', 
  'name.en': 'text',
  'description.pt': 'text', 
  'description.en': 'text',
  searchTags: 'text' 
});
DishSchema.index({ 
  'dietaryInfo.vegetarian': 1, 
  'dietaryInfo.vegan': 1,
  'dietaryInfo.glutenFree': 1 
});

export default mongoose.models.Dish || mongoose.model('Dish', DishSchema);
