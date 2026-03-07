import { MongoClient, Db, Collection, Document, ObjectId } from 'mongodb';
import { getDB } from './mongodb';

// Типы для коллекций
export type CollectionName = 'kittens' | 'adults' | 'graduates' | 'posts' | 'articles' | 'users';

// Базовый интерфейс для всех документов
export interface BaseDocument {
  _id?: string | ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Класс для работы с админкой
class AdminDB {
  private db: Db | null = null;
  private collections: Map<CollectionName, Collection<Document>> = new Map();

  // Инициализация подключения
  private async init() {
    if (!this.db) {
      this.db = await getDB();
    }
    return this.db;
  }

  // Получение коллекции
  private async getCollection(name: CollectionName): Promise<Collection<Document>> {
    if (!this.collections.has(name)) {
      const db = await this.init();
      const collection = db.collection(name);
      this.collections.set(name, collection);
    }
    return this.collections.get(name)!;
  }

  // Универсальный метод для обработки ошибок
  private async handleRequest<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('Database operation failed:', error);
      throw new Error(`Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== CREATE ====================

  // Создать один документ
  async create<T extends BaseDocument>(collectionName: CollectionName, data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      
      const doc = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as T;

      const result = await collection.insertOne(doc as Document);
      return { ...doc, _id: result.insertedId } as T;
    });
  }

  // Создать несколько документов
  async createMany<T extends BaseDocument>(collectionName: CollectionName, dataArray: Omit<T, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      
      const docs = dataArray.map(data => ({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as T[];

      const result = await collection.insertMany(docs as Document[]);
      
      return docs.map((doc, index) => ({
        ...doc,
        _id: result.insertedIds[index],
      })) as T[];
    });
  }

  // ==================== READ ====================

  // Получить все документы с пагинацией и сортировкой
  async findAll<T extends BaseDocument>(
    collectionName: CollectionName,
    options?: {
      sort?: { [key: string]: 1 | -1 };
      limit?: number;
      skip?: number;
      filter?: Partial<T>;
    }
  ): Promise<T[]> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      
      let query = collection.find(options?.filter || {});
      
      if (options?.sort) {
        query = query.sort(options.sort);
      }
      if (options?.skip) {
        query = query.skip(options.skip);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const results = await query.toArray();
      return results as T[];
    });
  }

  // Найти по ID
  async findById<T extends BaseDocument>(collectionName: CollectionName, id: string): Promise<T | null> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      
      let objectId: ObjectId;
      try {
        objectId = new ObjectId(id);
      } catch {
        return null;
      }
      
      const result = await collection.findOne({ _id: objectId });
      return result as T | null;
    });
  }

  // Найти по slug
  async findBySlug<T extends BaseDocument>(collectionName: CollectionName, slug: string): Promise<T | null> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      const result = await collection.findOne({ slug });
      return result as T | null;
    });
  }

  // Найти по фильтру
  async findOne<T extends BaseDocument>(collectionName: CollectionName, filter: Partial<T>): Promise<T | null> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      const result = await collection.findOne(filter as Document);
      return result as T | null;
    });
  }

  // ==================== UPDATE ====================

  // Обновить документ
  async update<T extends BaseDocument>(
    collectionName: CollectionName, 
    id: string, 
    data: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T | null> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      
      let objectId: ObjectId;
      try {
        objectId = new ObjectId(id);
      } catch {
        return null;
      }

      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result as T | null;
    });
  }

  // Обновить по фильтру (множественное обновление)
  async updateMany<T extends BaseDocument>(
    collectionName: CollectionName,
    filter: Partial<T>,
    data: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<number> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      const result = await collection.updateMany(
        filter as Document,
        { $set: updateData }
      );

      return result.modifiedCount;
    });
  }

  // ==================== DELETE ====================

  // Удалить документ
  async delete(collectionName: CollectionName, id: string): Promise<boolean> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      
      let objectId: ObjectId;
      try {
        objectId = new ObjectId(id);
      } catch {
        return false;
      }

      const result = await collection.deleteOne({ _id: objectId });
      return result.deletedCount === 1;
    });
  }

  // Удалить по фильтру (множественное удаление)
  async deleteMany<T extends BaseDocument>(collectionName: CollectionName, filter: Partial<T>): Promise<number> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      const result = await collection.deleteMany(filter as Document);
      return result.deletedCount;
    });
  }

  // ==================== UTILS ====================

  // Подсчет документов
  async count<T extends BaseDocument>(collectionName: CollectionName, filter?: Partial<T>): Promise<number> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      return await collection.countDocuments(filter as Document);
    });
  }

  // Проверка существования
  async exists<T extends BaseDocument>(collectionName: CollectionName, filter: Partial<T>): Promise<boolean> {
    return this.handleRequest(async () => {
      const collection = await this.getCollection(collectionName);
      const count = await collection.countDocuments(filter as Document, { limit: 1 });
      return count > 0;
    });
  }

  // Уникальное значение (например, для slug)
  async generateUniqueSlug(collectionName: CollectionName, baseString: string): Promise<string> {
    const slug = baseString
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    let uniqueSlug = slug;
    let counter = 1;

    while (await this.exists(collectionName, { slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}

// Экспортируем единственный экземпляр
export const adminDB = new AdminDB();