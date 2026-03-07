import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// Глобальное кеширование для разработки
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // В разработке используем глобальную переменную для сохранения соединения
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // В продакшене создаем новое соединение
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Получить клиент MongoDB
export async function getClient(): Promise<MongoClient> {
  return await clientPromise;
}

// Получить базу данных
export async function getDB(): Promise<Db> {
  const client = await getClient();
  const dbName = process.env.MONGODB_DB || 'LargeMinion';
  return client.db(dbName);
}

// Проверка подключения (для тестов)
export async function testConnection(): Promise<boolean> {
  try {
    const client = await getClient();
    await client.db().command({ ping: 1 });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

// Закрыть соединение (для тестов)
export async function closeConnection(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    const client = await getClient();
    await client.close();
  }
}

// Добавь в конец файла после подключения
if (process.env.NODE_ENV === 'development') {
  import('./ensureIndexes').then(mod => mod.ensureIndexes());
}