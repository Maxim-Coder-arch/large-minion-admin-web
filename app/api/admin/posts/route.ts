import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db/mongodb';

// GET - получить все посты
export async function GET() {
  try {
    const db = await getDB();
    const collection = db.collection('posts');
    
    const posts = await collection
      .find({})
      .sort({ id: -1 })
      .toArray();
    
    return NextResponse.json({ 
      success: true,
      count: posts.length,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        image: post.image,
        urlToVk: post.urlToVk
      }))
    });
    
  } catch (error) {
    console.error('❌ GET Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка постов' },
      { status: 500 }
    );
  }
}

// POST - добавить пост
export async function POST(request: Request) {
  try {
    const db = await getDB();
    const collection = db.collection('posts');
    
    // Получаем последний ID
    const lastPost = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const newId = lastPost.length > 0 ? lastPost[0].id + 1 : 1;
    const data = await request.json();
    
    // Проверяем обязательные поля
    if (!data.title || !data.image || !data.urlToVk) {
      return NextResponse.json(
        { error: 'Заголовок, фото и ссылка на ВК обязательны' },
        { status: 400 }
      );
    }
    
    const postDoc = {
      id: newId,
      title: data.title,
      description: data.description || '',
      image: data.image,
      urlToVk: data.urlToVk,
    };
    
    await collection.insertOne(postDoc);
    
    return NextResponse.json({ 
      success: true, 
      id: newId,
      message: 'Пост успешно добавлен'
    });
    
  } catch (error) {
    console.error('❌ POST Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении поста' },
      { status: 500 }
    );
  }
}

// DELETE - удалить последний пост
export async function DELETE() {
  try {
    console.log('🗑️ Удаление последнего поста');
    
    const db = await getDB();
    const collection = db.collection('posts');
    
    const lastPost = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    if (lastPost.length === 0) {
      return NextResponse.json(
        { error: 'Нет постов для удаления' },
        { status: 404 }
      );
    }
    
    const postToDelete = lastPost[0];
    
    const result = await collection.deleteOne({ id: postToDelete.id });
    
    return NextResponse.json({ 
      success: true,
      message: `Пост "${postToDelete.title}" удален`,
      deletedPost: {
        id: postToDelete.id,
        title: postToDelete.title
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