import Link from "next/link";
import "../styles/add-kitten/addKitten.scss";
import "../styles/kitten/kitten.scss";
import Image from "next/image";
import { getDB } from "@/lib/db/mongodb";
import DeleteFirstGraduateButton from "../components/admin/DeleteFirstGraduateButton";
import DeleteLastGraduateButton from "../components/admin/DeleteLastGraduateButton";

export default async function Page() {
  const db = await getDB();
  const kittens = await db.collection('graduates').find().toArray();
  const plainKittens = kittens.map(kitten => ({
    ...kitten,
    _id: kitten._id.toString(),
    id: kitten.id
  }));


  return (
    <div className="universal-styling">
      <div className="add-kitten">
        <div className="kittens-sett">
            <h3>Управление выпускниками</h3>
            <div className="kitten-settings-block">
                <Link href="/add/graduate">
                  Добавить Выпускника
                </Link>
                <DeleteLastGraduateButton />
                <DeleteFirstGraduateButton />
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
    </div>
  );
}