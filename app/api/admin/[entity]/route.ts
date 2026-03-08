import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

// Функция для транслитерации (только для статей)
function transliterate(text: string): string {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-', ',': '', '.': '', '!': '', '?': '', '"': '', "'": '',
  };
  
  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Функция для генерации уникального slug
async function generateUniqueSlug(collection: any, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await collection.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// GET - получить все элементы
export async function GET(
  request: Request,
  { params }: { params: { entity: string } }
) {
  try {
    const { entity } = await params;
    const db = await getDB();
    
    // Для статей своя сортировка по index
    if (entity === 'articles') {
      const items = await db.collection(entity).find().sort({ index: 1 }).toArray();
      return NextResponse.json({ success: true, count: items.length, items });
    }
    
    // Для всех остальных - по id
    const items = await db.collection(entity).find().sort({ id: -1 }).toArray();
    return NextResponse.json({ success: true, count: items.length, items });
    
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

// POST - добавить элемент
export async function POST(
  request: Request,
  { params }: { params: { entity: string } }
) {
  try {
    const { entity } = await params;
    console.log(`📝 POST /api/admin/entities/${entity}`);
    
    const db = await getDB();
    const collection = db.collection(entity);
    const data = await request.json();
    
    // ОСОБАЯ ЛОГИКА ДЛЯ СТАТЕЙ
    if (entity === 'articles') {
      // Получаем последний index
      const lastArticle = await collection
        .find({})
        .sort({ index: -1 })
        .limit(1)
        .toArray();
      
      const newIndex = lastArticle.length > 0 ? lastArticle[0].index + 1 : 1;
      
      // Генерируем slug
      const baseSlug = transliterate(data.title);
      const uniqueSlug = await generateUniqueSlug(collection, baseSlug);
      
      const articleDoc = {
        index: newIndex,
        title: data.title,
        description: data.description,
        slug: uniqueSlug,
      };
      
      await collection.insertOne(articleDoc);
      
      return NextResponse.json({ 
        success: true, 
        index: newIndex,
        slug: uniqueSlug,
        message: 'Статья добавлена'
      });
    }
    
    // ЛОГИКА ДЛЯ ВСЕХ ОСТАЛЬНЫХ СУЩНОСТЕЙ
    // Получаем последний ID
    const lastItem = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const newId = lastItem.length > 0 ? lastItem[0].id + 1 : 1;
    
    const itemToInsert = {
      id: newId,
      ...data,
      createdAt: new Date()
    };
    
    await collection.insertOne(itemToInsert);
    
    return NextResponse.json({ 
      success: true, 
      id: newId,
      message: 'Элемент добавлен'
    });
    
  } catch (error) {
    console.error('❌ POST Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении' },
      { status: 500 }
    );
  }
}