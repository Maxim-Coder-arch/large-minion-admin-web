import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

export async function DELETE() {
  try {
    console.log('🗑️ Удаление ПЕРВОГО взрослого');
    
    const db = await getDB();
    const collection = db.collection('graduates');
    
    // Находим первого взрослого (с минимальным id)
    const firstAdult = await collection
      .find({})
      .sort({ id: 1 })  // 1 = по возрастанию (первый)
      .limit(1)
      .toArray();
    
    if (firstAdult.length === 0) {
      return NextResponse.json(
        { error: 'Нет выпускников для удаления' },
        { status: 404 }
      );
    }
    
    const adultToDelete = firstAdult[0];
    console.log(`🔍 Первый выпускник: ${adultToDelete.name} (ID: ${adultToDelete.id})`);
    
    const result = await collection.deleteOne({ id: adultToDelete.id });
    
    return NextResponse.json({ 
      success: true,
      message: `Первый выпускник ${adultToDelete.name} удален`,
      deletedAdult: {
        id: adultToDelete.id,
        name: adultToDelete.name
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении' },
      { status: 500 }
    );
  }
}