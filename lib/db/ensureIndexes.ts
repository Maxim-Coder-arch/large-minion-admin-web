import { getDB } from './mongodb';

export async function ensureIndexes() {
  const db = await getDB();
  const collection = db.collection('kittens');
  
  // Создаем уникальный индекс для поля id
  await collection.createIndex({ id: 1 }, { unique: true });
  
  console.log('✅ Unique index on "id" field created');
}