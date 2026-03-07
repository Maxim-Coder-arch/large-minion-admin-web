import Image from 'next/image';
import { getDB } from '../../lib/db/mongodb';
import "../styles/kitten/kitten.scss";
import Link from 'next/link';
import DeleteLastKittenButton from '../components/admin/DeleteLastKittenButton';
import DeleteFirstKittenButton from './DeleteFirstKittenButton';

export default async function Page() {
  const db = await getDB();
  const kittens = await db.collection('kittens').find().toArray();
  const plainKittens = kittens.map(kitten => ({
    ...kitten,
    _id: kitten._id.toString(),
    id: kitten.id
  }));

  return (
    <div className='universal-styling'>
      <div className="kittens-sett">
          <h3>Управление котятами</h3>
          <div className="kitten-settings-block">
            <Link href="/add/kitten">
              Добавить котенка
            </Link>
            <DeleteLastKittenButton />
            <DeleteFirstKittenButton />
          </div>

        <div className="kittens-container">
          {plainKittens.map(kitten => (
            <div 
              key={kitten.id}
              className='kitten-card'
            >
              <div className="image-wrapper">
                <Image 
                  src={kitten.image}
                  alt={kitten.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className="data-kitten">
                <h3>{kitten.name}</h3>
                <span>{kitten.description}</span>
              </div>
              
              <div className="kitten-meta">
                <span>Помет: {kitten.litter}</span>
                <span>Возраст: {kitten.age}</span>
                <span>{kitten.gender === 'male' ? 'Мальчик' : 'Девочка'}</span>
              </div>
              
              <div className="parents-kitten">
                <div className="parent-generic">
                  <div className="parent-image">
                    <Image 
                      src={kitten.mother?.image || '/default-cat.jpg'}
                      alt={kitten.mother?.name || 'Мама'}
                      fill
                      sizes="50px"
                    />
                  </div>
                  <span>
                    Мама: {kitten.mother?.name || 'Не указана'}
                  </span>
                </div>
                
                <div className="parent-generic">
                  <div className="parent-image">
                    <Image 
                      src={kitten.father?.image || '/default-cat.jpg'}
                      alt={kitten.father?.name || 'Папа'}
                      fill
                      sizes="50px"
                    />
                  </div>
                  <span>
                    Папа: {kitten.father?.name || 'Не указан'}
                  </span>
                </div>
              </div>

            </div> 
            
          ))}
        </div>
      </div>
    </div>
  );
}