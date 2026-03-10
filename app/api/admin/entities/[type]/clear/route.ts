import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = await params;
    const db = await getDB();
    const collection = db.collection(type);
    
    const result = await collection.deleteMany({});
    
    return NextResponse.json({ 
      success: true,
      deletedCount: result.deletedCount,
      message: `Удалено ${result.deletedCount} записей`
    });
    
  } catch {
    return NextResponse.json(
      { error: 'Ошибка при очистке' },
      { status: 500 }
    );
  }
}