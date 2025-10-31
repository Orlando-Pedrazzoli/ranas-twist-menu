const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

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
    type: {
      type: String,
      enum: ['popular', 'chef-special', 'new'],
    },
    priority: Number,
    validUntil: Date,
  }],
  available: Boolean,
  displayOrder: Number,
});

const Category = mongoose.model('Category', CategorySchema);
const Dish = mongoose.model('Dish', DishSchema);

const fixOrphanedDishes = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado!\n');

    // Buscar todas as categorias
    const categories = await Category.find({}).sort({ order: 1 });
    console.log('📂 Categorias disponíveis:');
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name.pt} (${cat._id})`);
    });

    // Buscar todos os pratos
    const dishes = await Dish.find({}).populate('category');
    console.log(`\n📊 Total de pratos encontrados: ${dishes.length}`);

    // Categoria padrão (primeira categoria ou "Entradas")
    const defaultCategory = categories.find(c => c.slug === 'entradas') || categories[0];
    console.log(`\n🎯 Categoria padrão para pratos órfãos: ${defaultCategory.name.pt}\n`);

    let orphanedCount = 0;
    let updatedCount = 0;

    for (const dish of dishes) {
      // Verificar se a categoria existe
      if (!dish.category) {
        orphanedCount++;
        console.log(`❌ Prato órfão encontrado: ${dish.name.pt}`);
        
        // Tentar adivinhar a categoria baseado no nome ou descrição
        let suggestedCategory = defaultCategory;
        
        const dishNameLower = dish.name.pt.toLowerCase();
        const dishDescLower = dish.description.pt.toLowerCase();
        
        // Lógica para sugerir categoria
        if (dishNameLower.includes('samosa') || dishNameLower.includes('tikk')) {
          suggestedCategory = categories.find(c => c.slug === 'entradas') || defaultCategory;
        } else if (dishNameLower.includes('naan') || dishNameLower.includes('pão')) {
          suggestedCategory = categories.find(c => c.slug === 'pao-indiano') || defaultCategory;
        } else if (dishNameLower.includes('chicken') && dishNameLower.includes('curry')) {
          suggestedCategory = categories.find(c => c.slug === 'chicken-curry') || defaultCategory;
        } else if (dishNameLower.includes('lamb') || dishNameLower.includes('cordeiro') || dishNameLower.includes('borrego')) {
          suggestedCategory = categories.find(c => c.slug === 'lamb-curry') || defaultCategory;
        } else if (dishNameLower.includes('tandoor') || dishNameLower.includes('kebab')) {
          suggestedCategory = categories.find(c => c.slug === 'tandoori-grills') || defaultCategory;
        } else if (dishNameLower.includes('prawn') || dishNameLower.includes('camarão')) {
          suggestedCategory = categories.find(c => c.slug === 'prawns-curry') || defaultCategory;
        } else if (dishNameLower.includes('palak') || dishNameLower.includes('paneer') || dishDescLower.includes('vegetariano') || dish.dietaryInfo?.vegetarian) {
          suggestedCategory = categories.find(c => c.slug === 'veg-curry') || defaultCategory;
        } else if (dishNameLower.includes('biryani')) {
          suggestedCategory = categories.find(c => c.slug === 'biryani') || defaultCategory;
        } else if (dishNameLower.includes('butter chicken') || dishNameLower.includes('chicken')) {
          suggestedCategory = categories.find(c => c.slug === 'chicken-curry') || defaultCategory;
        }
        
        // Atualizar o prato com a nova categoria
        dish.category = suggestedCategory._id;
        await dish.save();
        updatedCount++;
        console.log(`   ✅ Atualizado com categoria: ${suggestedCategory.name.pt}`);
      }
    }

    console.log('\n📈 Resumo da operação:');
    console.log(`   Total de pratos: ${dishes.length}`);
    console.log(`   Pratos órfãos encontrados: ${orphanedCount}`);
    console.log(`   Pratos atualizados: ${updatedCount}`);
    console.log('\n🎉 Correção concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Conexão fechada');
  }
};

fixOrphanedDishes();