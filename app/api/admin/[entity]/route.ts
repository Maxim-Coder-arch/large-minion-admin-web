import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

// GET - получить все элементы
export async function GET(
  request: Request,
  { params }: { params: { entity: string } }
) {
  try {
    const { entity } = await params;
    const db = await getDB();
    const items = await db.collection(entity).find().sort({ id: -1 }).toArray();
    
    return NextResponse.json({ 
      success: true,
      count: items.length,
      items 
    });
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
    
    // Получаем последний ID
    const lastItem = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const newId = lastItem.length > 0 ? lastItem[0].id + 1 : 1;
    
    const data = await request.json();
    console.log('📦 Data:', data);
    
    // Добавляем ID к данным
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