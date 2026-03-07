import Link from "next/link";
import { getDB } from "@/lib/db/mongodb";
import DeleteFirstArticleButton from "../DeleteFirstArticleButton";
import DeleteLastArticleButton from "../DeleteLastArticleButton";

export default async function Page() {
  const db = await getDB();
  const kittens = await db.collection("articles").find().toArray();
  const plainKittens = kittens.map((kitten) => ({
    ...kitten,
    _id: kitten._id.toString(),
    id: kitten.id,
  }));

  return (
    <div className="universal-styling">
      <div className="add-kitten">
        <div className="kittens-sett">
          <h3>Управление статьями</h3>
          <div className="kitten-settings-block">
            <Link href="/add/article">Добавить статью</Link>
            <DeleteLastArticleButton />
            <DeleteFirstArticleButton />
          </div>
          <div className="kittens-container">
            {plainKittens.map((kitten) => (
              <div className="article-card" key={kitten.id}>
                <h4>{kitten.title}</h4>
                <div className="content-wrapper">
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
