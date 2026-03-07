import Image from 'next/image';
import { getDB } from '../../lib/db/mongodb';
import "../styles/kitten/kitten.scss";
import Link from 'next/link';
import DeleteLastAdultButton from '../components/admin/DeleteLastAdultButton';
import DeleteFirstAdultButton from '../components/admin/DeleteFirstAdultButton';

export default async function Page() {
  const db = await getDB();
  const kittens = await db.collection('adults').find().toArray();
  const plainKittens = kittens.map(kitten => ({
    ...kitten,
    _id: kitten._id.toString(),
    id: kitten.id
  }));

  return (
    <div className='universal-styling'>
      <div className="kittens-sett">
          <h3>Управление взрослыми</h3>
          <div className="kitten-settings-block">
            <Link href="/add/adult">
              Добавить взрослого
            </Link>
            <DeleteLastAdultButton />
            <DeleteFirstAdultButton />
          </div>

        <div className="kittens-container">
          {plainKittens.map(kitten => (
            <div 
              key={kitten.id}
              className='kitten-card'
            >
              <div className="image-wrapper">
                <Image 
                  src={kitten.portait}
                  alt={kitten.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className="data-kitten">
                <h3>{kitten.name}</h3>
                <span>{kitten.description}</span>
              </div>
            </div> 
          ))}
        </div>
      </div>
    </div>
  );
}