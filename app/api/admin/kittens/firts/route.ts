import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

export async function DELETE() {
  try {
    console.log('🗑️ Удаление ПЕРВОГО котенка');
    
    const db = await getDB();
    const collection = db.collection('kittens');
    
    // Находим первого котенка (с минимальным id)
    const firstKitten = await collection
      .find({})
      .sort({ id: 1 })  // 1 = по возрастанию (первый)
      .limit(1)
      .toArray();
    
    if (firstKitten.length === 0) {
      return NextResponse.json(
        { error: 'Нет котят для удаления' },
        { status: 404 }
      );
    }
    
    const kittenToDelete = firstKitten[0];
    console.log(`🔍 Первый котенок: ${kittenToDelete.name} (ID: ${kittenToDelete.id})`);
    
    const result = await collection.deleteOne({ id: kittenToDelete.id });
    
    return NextResponse.json({ 
      success: true,
      message: `Первый котенок ${kittenToDelete.name} удален`,
      deletedKitten: {
        id: kittenToDelete.id,
        name: kittenToDelete.name
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