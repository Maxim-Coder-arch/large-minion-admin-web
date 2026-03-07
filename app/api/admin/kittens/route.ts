import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

// GET - посмотреть всех котят
export async function GET() {
  try {
    console.log('📋 GET запрос получен');
    
    const db = await getDB();
    const collection = db.collection('kittens');
    
    // Получаем всех котят, сортируем по id (новые сверху)
    const kittens = await collection
      .find({})
      .sort({ id: -1 })
      .toArray();
    
    console.log(`✅ Найдено котят: ${kittens.length}`);
    
    return NextResponse.json({ 
      success: true,
      count: kittens.length,
      kittens: kittens.map(k => ({
        id: k.id,
        name: k.name,
        description: k.description,
        image: k.image,
        age: k.age,
        gender: k.gender,
        litter: k.litter,
        mother: k.mother,
        father: k.father
      }))
    });
    
  } catch (error) {
    console.error('❌ GET Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка котят' },
      { status: 500 }
    );
  }
}

// POST - добавить котенка (твой существующий код)
export async function POST(request: Request) {
  try {
    console.log('📝 POST запрос получен');
    
    const db = await getDB();
    const collection = db.collection('kittens');
    
    // Получаем последний ID
    const lastKitten = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const newId = lastKitten.length > 0 ? lastKitten[0].id + 1 : 1;
    console.log(`🆕 Новый ID: ${newId}`);
    
    const data = await request.json();
    
    // Проверяем обязательные поля
    if (!data.name || !data.image) {
      return NextResponse.json(
        { error: 'Имя и фото обязательны' },
        { status: 400 }
      );
    }
    
    const kittenDoc = {
      id: newId,
      name: data.name,
      description: data.description || '',
      image: data.image,
      litter: data.litter || '',
      age: data.age || '',
      gender: data.gender || 'male',
      mother: {
        name: data.mother?.name || '',
        image: data.mother?.image || ''
      },
      father: {
        name: data.father?.name || '',
        image: data.father?.image || ''
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(kittenDoc);
    console.log(`✅ Котенок добавлен с ID: ${newId}`);
    
    return NextResponse.json({ 
      success: true, 
      id: newId,
      message: 'Котенок успешно добавлен'
    });
    
  } catch (error) {
    console.error('❌ POST Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании котенка' },
      { status: 500 }
    );
  }
}

// DELETE - удалить последнего котенка
export async function DELETE() {
  try {
    console.log('🗑️ DELETE запрос получен');
    
    const db = await getDB();
    const collection = db.collection('kittens');
    
    // Находим последнего котенка (с максимальным id)
    const lastKitten = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    if (lastKitten.length === 0) {
      console.log('❌ Нет котят для удаления');
      return NextResponse.json(
        { error: 'Нет котят для удаления' },
        { status: 404 }
      );
    }
    
    const kittenToDelete = lastKitten[0];
    console.log(`🔍 Найден котенок для удаления: ${kittenToDelete.name} (ID: ${kittenToDelete.id})`);
    
    // Удаляем
    const result = await collection.deleteOne({ id: kittenToDelete.id });
    console.log(`✅ Результат удаления:`, result);
    
    return NextResponse.json({ 
      success: true,
      message: `Котенок ${kittenToDelete.name} удален`,
      deletedKitten: {
        id: kittenToDelete.id,
        name: kittenToDelete.name
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