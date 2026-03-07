import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

// GET - получить всех взрослых
export async function GET() {
  try {
    const db = await getDB();
    const collection = db.collection('graduates');
    
    const adults = await collection
      .find({})
      .sort({ id: -1 })
      .toArray();
    
    return NextResponse.json({ 
      success: true,
      count: adults.length,
      adults: adults.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        portait: a.portait
      }))
    });
    
  } catch (error) {
    console.error('❌ GET Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка' },
      { status: 500 }
    );
  }
}

// POST - добавить взрослого
export async function POST(request: Request) {
  try {
    const db = await getDB();
    const collection = db.collection('graduates');
    
    const lastAdult = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const newId = lastAdult.length > 0 ? lastAdult[0].id + 1 : 1;
    const data = await request.json();
    
    if (!data.name || !data.portait) {
      return NextResponse.json(
        { error: 'Имя и фото обязательны' },
        { status: 400 }
      );
    }
    
    const adultDoc = {
      id: newId,
      name: data.name,
      description: data.description || '',
      portait: data.portait,
    };
    
    await collection.insertOne(adultDoc);
    
    return NextResponse.json({ 
      success: true, 
      id: newId,
      message: 'Взрослый кот успешно добавлен'
    });
    
  } catch (error) {
    console.error('❌ POST Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении' },
      { status: 500 }
    );
  }
}

// ✅ Добавляем DELETE метод для удаления последнего
export async function DELETE() {
  try {
    console.log('🗑️ Удаление последнего взрослого');
    
    const db = await getDB();
    const collection = db.collection('graduates');
    
    // Находим последнего взрослого (с максимальным id)
    const lastAdult = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    if (lastAdult.length === 0) {
      return NextResponse.json(
        { error: 'Нет взрослых для удаления' },
        { status: 404 }
      );
    }
    
    const adultToDelete = lastAdult[0];
    console.log(`🔍 Найден: ${adultToDelete.name} (ID: ${adultToDelete.id})`);
    
    const result = await collection.deleteOne({ id: adultToDelete.id });
    
    return NextResponse.json({ 
      success: true,
      message: `Взрослый кот ${adultToDelete.name} удален`,
      deletedAdult: {
        id: adultToDelete.id,
        name: adultToDelete.name
      }
    });
    
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении' },
      { status: 500 }
    );
  }
}