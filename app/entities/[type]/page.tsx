import { getDB } from "@/lib/db/mongodb";
import Link from "next/link";
import Image from "next/image";
import "../../styles/kitten/kitten.scss";
import DeleteButton from "../../../cart-explore/DeleteFirstButton";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const entityConfig = {
  kittens: {
    title: "Управление котятами",
    addLink: "/add/kitten",
    addButtonText: "Добавить котенка",
    collection: "kittens",
    imageField: "image",
    nameField: "name",
    showMeta: true,
    showParents: true,
    fields: [
      { key: "litter", label: "Помет" },
      { key: "age", label: "Возраст" },
      {
        key: "gender",
        label: "Пол",
        transform: (v: string) => (v === "male" ? "Мальчик" : "Девочка"),
      },
    ],
  },
  adults: {
    title: "Управление взрослыми",
    addLink: "/add/adult",
    addButtonText: "Добавить взрослого",
    collection: "adults",
    imageField: "portait",
    nameField: "name",
    showMeta: false,
  },
  graduates: {
    title: "Управление выпускниками",
    addLink: "/add/graduate",
    addButtonText: "Добавить выпускника",
    collection: "graduates",
    imageField: "portait",
    nameField: "name",
    showMeta: false,
  },
  posts: {
    title: "Управление постами",
    addLink: "/add/post",
    addButtonText: "Добавить пост",
    collection: "posts",
    imageField: "image",
    nameField: "title",
    showMeta: false,
  },
  articles: {
    title: "Управление статьями",
    addLink: "/add/article",
    addButtonText: "Добавить статью",
    collection: "articles",
    imageField: null,
    nameField: "title",
    showMeta: false,
    isArticle: true,
  },
};

export default async function EntityPage({
  params,
}: {
  params: { type: string };
}) {
  const { type } = await params;
  const config = entityConfig[type as keyof typeof entityConfig];

  if (!config) {
    return <div>Сущность не найдена</div>;
  }

  const db = await getDB();
  const items = await db.collection(config.collection).find().toArray();
  const plainItems = items.map((item) => ({
    ...item,
    _id: item._id.toString(),
    id: item.id,
  }));

  return (
    <div className="universal-styling">
      <div className="add-kitten">
        <div className="kittens-sett">
          <h3>{config.title}</h3>

          <div className="kitten-settings-block">
            <Link href={config.addLink} className="add-button">
              {config.addButtonText}
            </Link>
            <DeleteButton entityType={type} position="first" />
            <DeleteButton entityType={type} position="last" />
          </div>

          <div className="kittens-container">
            {plainItems.map((item) => (
              <div
                key={item.id}
                className={config.isArticle ? "article-card" : "kitten-card"}
              >
                {config.imageField && (
                  <div className="image-wrapper">
                    <Image
                      src={item[config.imageField]}
                      alt={item[config.nameField]}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                <div className="data-kitten">
                  <h3>{item[config.nameField]}</h3>
                  <span>{item.description}</span>
                </div>

                {config.showMeta && (
                  <div className="kitten-meta">
                    {config.fields?.map((field) => (
                      <span key={field.key}>
                        {field.label}:{" "}
                        {field.transform
                          ? field.transform(item[field.key])
                          : item[field.key]}
                      </span>
                    ))}
                  </div>
                )}

                {config.showParents && (
                  <div className="parents-kitten">
                    <div className="parent-generic">
                      <div className="parent-image">
                        <Image
                          src={item.mother?.image || "/default-cat.jpg"}
                          alt={item.mother?.name || "Мама"}
                          fill
                          sizes="50px"
                        />
                      </div>
                      <span>Мама: {item.mother?.name || "Не указана"}</span>
                    </div>

                    <div className="parent-generic">
                      <div className="parent-image">
                        <Image
                          src={item.father?.image || "/default-cat.jpg"}
                          alt={item.father?.name || "Папа"}
                          fill
                          sizes="50px"
                        />
                      </div>
                      <span>Папа: {item.father?.name || "Не указан"}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
