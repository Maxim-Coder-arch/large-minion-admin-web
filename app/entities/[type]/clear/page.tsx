import { getDB } from '@/lib/db/mongodb';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ClearAllButton from '@/app/components/admin/ClearAllButton';
import "../../../styles/clear-page/clearPage.scss";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    type: string;
  };
}

const entityNames = {
  kittens: { ru: 'котят', single: 'котенка' },
  adults: { ru: 'взрослых котов', single: 'взрослого кота' },
  graduates: { ru: 'выпускников', single: 'выпускника' },
  posts: { ru: 'постов', single: 'пост' },
  articles: { ru: 'статей', single: 'статью' }
};

export default async function ClearEntityPage({ params }: PageProps) {
  const { type } = await params;
  const db = await getDB();
  const collection = db.collection(type);
  
  const count = await collection.countDocuments();
  
  const recentItems = await collection
    .find({})
    .sort(type === 'articles' ? { index: -1 } : { id: -1 })
    .limit(5)
    .toArray();

  const entityInfo = entityNames[type as keyof typeof entityNames] || { 
    ru: type, 
    single: type 
  };

  return (
    <div className="universal-styling">
      <div className="clear-entity-page">
        <div className="page-header">
          <h1>Очистка данных: {entityInfo.ru}</h1>
          <Link href={`/entities/${type}`} className="back-button">
            ← Назад к списку
          </Link>
        </div>

        <div className="warning-card">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h2>Внимание! Это опасное действие</h2>
            <p>
              Вы собираетесь удалить <strong>все {entityInfo.ru}</strong> из базы данных.
              Всего записей: <strong>{count}</strong>
            </p>
            <p className="warning-text">
              Это действие нельзя отменить! Все данные будут безвозвратно удалены.
            </p>
          </div>
        </div>

        {recentItems.length > 0 && (
          <div className="recent-items">
            <h3>Последние записи (будут удалены):</h3>
            <div className="items-list">
              {recentItems.map((item) => (
                <div key={item._id.toString()} className="item-preview">
                  <span className="item-name">
                    {item.name || item.title || 'Без названия'}
                  </span>
                  <span className="item-id">
                    {type === 'articles' ? `index: ${item.index}` : `id: ${item.id}`}
                  </span>
                </div>
              ))}
              {count > 5 && (
                <div className="item-preview more">
                  ... и ещё {count - 5} записей
                </div>
              )}
            </div>
          </div>
        )}

        <div className="action-section">
          <ClearAllButton 
            entityType={type}
            entityName={entityInfo.ru}
            count={count}
          />
        </div>
      </div>
    </div>
  );
}