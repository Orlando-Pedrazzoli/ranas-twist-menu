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

const Category = mongoose.model('Category', CategorySchema);

const newCategories = [
  {
    name: { pt: 'Entradas', en: 'Starters' },
    slug: 'entradas',
    order: 1,
    active: true,
  },
  {
    name: { pt: 'Prato do Dia', en: 'Daily Special' },
    slug: 'prato-do-dia',
    order: 2,
    active: true,
  },
  {
    name: { pt: 'Pão Típico da India', en: 'Indian Bread' },
    slug: 'pao-indiano',
    order: 3,
    active: true,
  },
  {
    name: { pt: 'Chicken Curry', en: 'Chicken Curry' },
    slug: 'chicken-curry',
    order: 4,
    active: true,
  },
  {
    name: { pt: 'Lamb Curry', en: 'Lamb Curry' },
    slug: 'lamb-curry',
    order: 5,
    active: true,
  },
  {
    name: { pt: 'Grelhados no Tandoori', en: 'Tandoori Grills' },
    slug: 'tandoori-grills',
    order: 6,
    active: true,
  },
  {
    name: { pt: 'Prawns Curry', en: 'Prawns Curry' },
    slug: 'prawns-curry',
    order: 7,
    active: true,
  },
  {
    name: { pt: 'Veg Curry', en: 'Veg Curry' },
    slug: 'veg-curry',
    order: 8,
    active: true,
  },
  {
    name: { pt: 'Biryani', en: 'Biryani' },
    slug: 'biryani',
    order: 9,
    active: true,
  },
  {
    name: { pt: 'Extras', en: 'Extras' },
    slug: 'extras',
    order: 10,
    active: true,
  },
];

const updateCategories = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado!\n');

    console.log('🗑️  Removendo categorias antigas...');
    await Category.deleteMany({});
    console.log('✅ Categorias antigas removidas!\n');

    console.log('📝 Criando novas categorias...');
    const created = await Category.insertMany(newCategories);
    
    console.log('✅ Categorias criadas com sucesso!\n');
    console.log('📋 Categorias atualizadas:');
    created.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name.pt} / ${cat.name.en}`);
    });

    console.log('\n🎉 Atualização concluída!');
    console.log('📊 Total de categorias:', created.length);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Conexão fechada');
  }
};

updateCategories();