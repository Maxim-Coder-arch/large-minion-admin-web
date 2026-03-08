import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { entity: string } }
) {
  try {
    const { entity } = await params;
    const db = await getDB();
    const collection = db.collection(entity);
    
    // Получаем количество до удаления
    const count = await collection.countDocuments();
    
    // Удаляем все документы
    const result = await collection.deleteMany({});
    
    return NextResponse.json({ 
      success: true,
      deletedCount: result.deletedCount,
      message: `Удалено ${result.deletedCount} записей`
    });
    
  } catch (error) {
    console.error('❌ Clear error:', error);
    return NextResponse.json(
      { error: 'Ошибка при очистке' },
      { status: 500 }
    );
  }
}