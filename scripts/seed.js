const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const CategorySchema = new mongoose.Schema({
  name: {
    pt: String,
    en: String,
  },
  slug: String,
  order: Number,
  active: Boolean,
});

const DishSchema = new mongoose.Schema({
  name: {
    pt: String,
    en: String,
  },
  description: {
    pt: String,
    en: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  price: Number,
  compareAtPrice: Number,
  images: [{
    url: String,
    cloudinaryId: String,
    isPrimary: Boolean,
  }],
  dietaryInfo: {
    vegetarian: Boolean,
    vegan: Boolean,
    glutenFree: Boolean,
    dairyFree: Boolean,
    halal: Boolean,
  },
  allergens: [String],
  spiceLevel: Number,
  badges: [{
    type: String,
    priority: Number,
  }],
  available: Boolean,
  displayOrder: Number,
});

const Category = mongoose.model('Category', CategorySchema);
const Dish = mongoose.model('Dish', DishSchema);

const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Dish.deleteMany({});

    // Create categories
    const categories = await Category.create([
      {
        name: { pt: 'Entradas', en: 'Starters' },
        slug: 'starters',
        order: 1,
        active: true,
      },
      {
        name: { pt: 'Tandoor', en: 'Tandoor' },
        slug: 'tandoor',
        order: 2,
        active: true,
      },
      {
        name: { pt: 'Caril', en: 'Curry' },
        slug: 'curry',
        order: 3,
        active: true,
      },
      {
        name: { pt: 'Biryani', en: 'Biryani' },
        slug: 'biryani',
        order: 4,
        active: true,
      },
      {
        name: { pt: 'Pães', en: 'Breads' },
        slug: 'breads',
        order: 5,
        active: true,
      },
      {
        name: { pt: 'Bebidas', en: 'Beverages' },
        slug: 'beverages',
        order: 6,
        active: true,
      },
      {
        name: { pt: 'Sobremesas', en: 'Desserts' },
        slug: 'desserts',
        order: 7,
        active: true,
      },
    ]);

    console.log('Categories created:', categories.length);

    // Create sample dishes
    const dishes = [
      // Starters
      {
        name: { 
          pt: 'Samosas Vegetais', 
          en: 'Vegetable Samosas' 
        },
        description: { 
          pt: 'Pastéis crocantes recheados com legumes temperados, servidos com chutney de tamarindo',
          en: 'Crispy pastries filled with spiced vegetables, served with tamarind chutney'
        },
        category: categories[0]._id,
        price: 6.50,
        images: [{
          url: 'https://res.cloudinary.com/demo/image/upload/v1/food/samosa.jpg',
          isPrimary: true,
        }],
        dietaryInfo: {
          vegetarian: true,
          vegan: true,
          halal: true,
        },
        spiceLevel: 1,
        available: true,
        displayOrder: 1,
      },
      {
        name: { 
          pt: 'Allo Tikk Chatt', 
          en: 'Allo Tikk Chatt' 
        },
        description: { 
          pt: 'Bolinhos de batata crocantes com iogurte, chutneys e especiarias - especialidade da casa',
          en: 'Crispy potato patties with yogurt, chutneys and spices - house specialty'
        },
        category: categories[0]._id,
        price: 7.50,
        badges: [{ type: 'popular', priority: 1 }],
        dietaryInfo: {
          vegetarian: true,
          halal: true,
        },
        spiceLevel: 2,
        available: true,
        displayOrder: 2,
      },

      // Tandoor
      {
        name: { 
          pt: 'Chicken Tandoori', 
          en: 'Chicken Tandoori' 
        },
        description: { 
          pt: 'Frango marinado em iogurte e especiarias, grelhado no forno tandoor - prato estrela',
          en: 'Chicken marinated in yogurt and spices, grilled in tandoor oven - signature dish'
        },
        category: categories[1]._id,
        price: 16.90,
        badges: [
          { type: 'chef-special', priority: 1 },
          { type: 'popular', priority: 2 }
        ],
        dietaryInfo: {
          glutenFree: true,
          halal: true,
        },
        allergens: ['dairy'],
        spiceLevel: 2,
        available: true,
        displayOrder: 1,
      },
      {
        name: { 
          pt: 'Seekh Kebab', 
          en: 'Seekh Kebab' 
        },
        description: { 
          pt: 'Espetadas de borrego picado com ervas e especiarias, grelhadas no tandoor',
          en: 'Minced lamb skewers with herbs and spices, grilled in tandoor'
        },
        category: categories[1]._id,
        price: 14.90,
        dietaryInfo: {
          glutenFree: true,
          halal: true,
        },
        spiceLevel: 2,
        available: true,
        displayOrder: 2,
      },

      // Curry
      {
        name: { 
          pt: 'Butter Chicken', 
          en: 'Butter Chicken' 
        },
        description: { 
          pt: 'Frango em molho cremoso de tomate, manteiga e especiarias suaves',
          en: 'Chicken in creamy tomato sauce with butter and mild spices'
        },
        category: categories[2]._id,
        price: 15.90,
        badges: [{ type: 'popular', priority: 1 }],
        dietaryInfo: {
          glutenFree: true,
          halal: true,
        },
        allergens: ['dairy'],
        spiceLevel: 1,
        available: true,
        displayOrder: 1,
      },
      {
        name: { 
          pt: 'Palak Paneer', 
          en: 'Palak Paneer' 
        },
        description: { 
          pt: 'Queijo indiano em molho cremoso de espinafres',
          en: 'Indian cheese in creamy spinach sauce'
        },
        category: categories[2]._id,
        price: 13.90,
        dietaryInfo: {
          vegetarian: true,
          glutenFree: true,
          halal: true,
        },
        allergens: ['dairy'],
        spiceLevel: 1,
        available: true,
        displayOrder: 2,
      },

      // Biryani
      {
        name: { 
          pt: "Rana's Twist Biryani", 
          en: "Rana's Twist Biryani" 
        },
        description: { 
          pt: 'Arroz basmati aromático com frango, especiarias e ervas - receita exclusiva do chef',
          en: 'Aromatic basmati rice with chicken, spices and herbs - chef\'s exclusive recipe'
        },
        category: categories[3]._id,
        price: 18.90,
        compareAtPrice: 22.90,
        badges: [
          { type: 'chef-special', priority: 1 },
          { type: 'popular', priority: 2 }
        ],
        dietaryInfo: {
          glutenFree: true,
          halal: true,
        },
        spiceLevel: 2,
        available: true,
        displayOrder: 1,
      },

      // Breads
      {
        name: { 
          pt: 'Naan com Alho', 
          en: 'Garlic Naan' 
        },
        description: { 
          pt: 'Pão tradicional indiano com alho fresco e coentros',
          en: 'Traditional Indian bread with fresh garlic and coriander'
        },
        category: categories[4]._id,
        price: 3.50,
        dietaryInfo: {
          vegetarian: true,
          halal: true,
        },
        allergens: ['gluten', 'dairy'],
        available: true,
        displayOrder: 1,
      },

      // Beverages
      {
        name: { 
          pt: 'Mango Lassi', 
          en: 'Mango Lassi' 
        },
        description: { 
          pt: 'Bebida refrescante de iogurte com manga',
          en: 'Refreshing yogurt drink with mango'
        },
        category: categories[5]._id,
        price: 4.50,
        dietaryInfo: {
          vegetarian: true,
          glutenFree: true,
        },
        allergens: ['dairy'],
        available: true,
        displayOrder: 1,
      },
      {
        name: { 
          pt: 'Chai Masala', 
          en: 'Masala Chai' 
        },
        description: { 
          pt: 'Chá indiano tradicional com especiarias e leite',
          en: 'Traditional Indian tea with spices and milk'
        },
        category: categories[5]._id,
        price: 3.50,
        dietaryInfo: {
          vegetarian: true,
          glutenFree: true,
        },
        allergens: ['dairy'],
        available: true,
        displayOrder: 2,
      },

      // Desserts
      {
        name: { 
          pt: 'Gulab Jamun', 
          en: 'Gulab Jamun' 
        },
        description: { 
          pt: 'Bolinhos doces em calda de açúcar com cardamomo',
          en: 'Sweet dumplings in sugar syrup with cardamom'
        },
        category: categories[6]._id,
        price: 5.50,
        dietaryInfo: {
          vegetarian: true,
        },
        allergens: ['dairy', 'gluten'],
        available: true,
        displayOrder: 1,
      },
    ];

    await Dish.create(dishes);
    console.log('Dishes created:', dishes.length);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed
connectDB().then(seedData);
