import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

// POST - добавить котенка (уже есть)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const db = await getDB();
    const collection = db.collection('kittens');
    
    // Получаем последний ID
    const lastKitten = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastKitten.length > 0 ? lastKitten[0].id + 1 : 1;
    
    const result = await collection.insertOne({
      id: newId,
      ...data,
      createdAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      id: newId,
      message: 'Котенок добавлен' 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// GET - посмотреть всех котят
export async function GET() {
  try {
    const db = await getDB();
    const collection = db.collection('kittens');
    const kittens = await collection.find({}).sort({ id: -1 }).toArray();
    
    return NextResponse.json({ 
      count: kittens.length,
      kittens: kittens.map(k => ({
        id: k.id,
        name: k.name
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE - удалить последнего котенка
export async function DELETE() {
  try {
    const db = await getDB();
    const collection = db.collection('kittens');
    
    // Находим последнего котенка (с максимальным id)
    const lastKitten = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    if (lastKitten.length === 0) {
      return NextResponse.json(
        { error: 'Нет котят для удаления' },
        { status: 404 }
      );
    }
    
    const kittenToDelete = lastKitten[0];
    
    // Удаляем последнего котенка
    const result = await collection.deleteOne({ id: kittenToDelete.id });
    
    return NextResponse.json({ 
      success: true,
      message: `Котенок ${kittenToDelete.name} (ID: ${kittenToDelete.id}) удален`,
      deletedKitten: {
        id: kittenToDelete.id,
        name: kittenToDelete.name
      }
    });
    
  } catch (error) {
    console.error('Error deleting last kitten:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении' },
      { status: 500 }
    );
  }
}