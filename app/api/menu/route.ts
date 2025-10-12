import { NextResponse } from 'next/server';

// Sample data for demo purposes
const sampleDishes = [
  {
    _id: '1',
    name: {
      pt: 'Samosas Vegetais',
      en: 'Vegetable Samosas',
    },
    description: {
      pt: 'Pastéis crocantes recheados com legumes temperados, servidos com chutney de tamarindo',
      en: 'Crispy pastries filled with spiced vegetables, served with tamarind chutney',
    },
    category: '1',
    price: 6.5,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        isPrimary: true,
      },
    ],
    dietaryInfo: {
      vegetarian: true,
      vegan: true,
      halal: true,
    },
    spiceLevel: 1,
    available: true,
    displayOrder: 1,
    badges: [{ type: 'popular' }],
  },
  {
    name: {
      pt: 'Allo Tikk Chatt',
      en: 'Allo Tikk Chatt',
    },
    description: {
      pt: 'Bolinhos de batata crocantes com iogurte, chutneys e especiarias',
      en: 'Crispy potato patties with yogurt, chutneys and spices',
    },
    _id: '2',
    category: '1',
    price: 7.5,
    badges: [{ type: 'popular' }],
    dietaryInfo: {
      vegetarian: true,
      halal: true,
    },
    spiceLevel: 2,
    available: true,
    displayOrder: 2,
  },
  {
    name: {
      pt: 'Chicken Tandoori',
      en: 'Chicken Tandoori',
    },
    description: {
      pt: 'Frango marinado em iogurte e especiarias, grelhado no forno tandoor',
      en: 'Chicken marinated in yogurt and spices, grilled in tandoor oven',
    },
    _id: '3',
    category: '2',
    price: 16.9,
    badges: [{ type: 'chef-special' }, { type: 'popular' }],
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
      pt: 'Butter Chicken',
      en: 'Butter Chicken',
    },
    description: {
      pt: 'Frango em molho cremoso de tomate, manteiga e especiarias suaves',
      en: 'Chicken in creamy tomato sauce with butter and mild spices',
    },
    _id: '4',
    category: '3',
    price: 15.9,
    compareAtPrice: 18.9,
    badges: [{ type: 'popular' }],
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
      en: 'Palak Paneer',
    },
    description: {
      pt: 'Queijo indiano em molho cremoso de espinafres',
      en: 'Indian cheese in creamy spinach sauce',
    },
    _id: '5',
    category: '3',
    price: 13.9,
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
  {
    name: {
      pt: "Rana's Twist Biryani",
      en: "Rana's Twist Biryani",
    },
    description: {
      pt: 'Arroz basmati aromático com frango, especiarias e ervas - receita exclusiva do chef',
      en: "Aromatic basmati rice with chicken, spices and herbs - chef's exclusive recipe",
    },
    _id: '6',
    category: '4',
    price: 18.9,
    compareAtPrice: 22.9,
    badges: [{ type: 'chef-special' }, { type: 'new' }],
    dietaryInfo: {
      glutenFree: true,
      halal: true,
    },
    spiceLevel: 2,
    available: true,
    displayOrder: 1,
  },
];

const sampleCategories = [
  {
    _id: '1',
    name: { pt: 'Entradas', en: 'Starters' },
    slug: 'starters',
    order: 1,
    active: true,
  },
  {
    _id: '2',
    name: { pt: 'Tandoor', en: 'Tandoor' },
    slug: 'tandoor',
    order: 2,
    active: true,
  },
  {
    _id: '3',
    name: { pt: 'Caril', en: 'Curry' },
    slug: 'curry',
    order: 3,
    active: true,
  },
  {
    _id: '4',
    name: { pt: 'Biryani', en: 'Biryani' },
    slug: 'biryani',
    order: 4,
    active: true,
  },
  {
    _id: '5',
    name: { pt: 'Sobremesas', en: 'Desserts' },
    slug: 'desserts',
    order: 5,
    active: true,
  },
];

export async function GET(request: Request) {
  try {
    // In production, this would fetch from MongoDB
    // For now, return sample data
    return NextResponse.json({
      dishes: sampleDishes,
      categories: sampleCategories,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In production, this would save to MongoDB
    // For now, just return success
    return NextResponse.json({
      dish: body,
      success: true,
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json(
      { error: 'Failed to create dish', success: false },
      { status: 500 }
    );
  }
}
