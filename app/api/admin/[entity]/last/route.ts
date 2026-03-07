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
    
    // Находим последний элемент (с максимальным id)
    const lastItem = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    if (lastItem.length === 0) {
      return NextResponse.json(
        { error: 'Нет элементов для удаления' },
        { status: 404 }
      );
    }
    
    const itemToDelete = lastItem[0];
    await collection.deleteOne({ id: itemToDelete.id });
    
    const entityNames = {
      kittens: 'Котенок',
      adults: 'Взрослый кот',
      graduates: 'Выпускник',
      posts: 'Пост',
      articles: 'Статья'
    };
    
    return NextResponse.json({ 
      success: true,
      message: `${entityNames[entity as keyof typeof entityNames] || 'Элемент'} удален`
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении' },
      { status: 500 }
    );
  }
}