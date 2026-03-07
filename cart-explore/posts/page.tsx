import Link from "next/link";
import DeleteFirstGraduateButton from "../DeleteFirstGraduateButton";
import DeleteLastGraduateButton from "../DeleteLastGraduateButton";
import Image from "next/image";
import { getDB } from "@/lib/db/mongodb";
import DeleteLastPostButton from "../DeleteLastPostButton";
import DeleteFirstPostButton from "../DeleteFirstPostButton";

export default async function Page() {
  const db = await getDB();
  const kittens = await db.collection("posts").find().toArray();
  const plainKittens = kittens.map((kitten) => ({
    ...kitten,
    _id: kitten._id.toString(),
    id: kitten.id,
  }));

  return (
    <div className="universal-styling">
      <div className="add-kitten">
        <div className="kittens-sett">
          <h3>Управление постами</h3>
          <div className="kitten-settings-block">
            <Link href="/add/post">Добавить пост</Link>
            <DeleteLastPostButton />
            <DeleteFirstPostButton />
          </div>
          <div className="kittens-container">
            {plainKittens.map((kitten) => (
              <div key={kitten.id} className="kitten-card">
                <div className="image-wrapper">
                  <Image
                    src={kitten.image}
                    alt={kitten.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="data-kitten">
                  <h3>{kitten.title}</h3>
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
