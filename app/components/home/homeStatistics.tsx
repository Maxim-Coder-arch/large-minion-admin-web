import { getDB } from "@/lib/db/mongodb";
import HomeStatisticsClient from './HomeStatisticsClient';

export default async function HomeStatistics() {
  const db = await getDB();
  
  const [
    kittensCount,
    adultsCount,
    graduatesCount,
    postsCount,
    articlesCount
  ] = await Promise.all([
    db.collection('kittens').countDocuments(),
    db.collection('adults').countDocuments(),
    db.collection('graduates').countDocuments(),
    db.collection('posts').countDocuments(),
    db.collection('articles').countDocuments()
  ]);
  
  const totalPets = kittensCount + adultsCount + graduatesCount;
  
  const kittens = await db.collection('kittens').find().toArray();
  const adults = await db.collection('adults').find().toArray();
  const graduates = await db.collection('graduates').find().toArray();
  const posts = await db.collection('posts').find().toArray();

  // Преобразуем ObjectId в строки для клиентского компонента
  const plainKittens = kittens.map(k => ({ ...k, _id: k._id.toString() }));
  const plainAdults = adults.map(a => ({ ...a, _id: a._id.toString() }));
  const plainGraduates = graduates.map(g => ({ ...g, _id: g._id.toString() }));
  const plainPosts = posts.map(p => ({ ...p, _id: p._id.toString() }));

  const AllData: {label: string, value: number}[] = [
    {label: "Питомцев", value: totalPets},
    {label: "Котят", value: kittensCount},
    {label: "Взрослых", value: adultsCount},
    {label: "Выпускников", value: graduatesCount},
    {label: "Постов", value: postsCount},
    {label: "Статей", value: articlesCount}
  ];

  const pointData = [
    {
      label: "Котята",
      value: plainKittens
    },
    {
      label: "Взрослые",
      value: plainAdults
    },
    {
      label: "Выпускники",
      value: plainGraduates
    },
    {
      label: "Посты",
      value: plainPosts
    }
  ];

  return (
    <HomeStatisticsClient 
      AllData={AllData}
      pointData={pointData}
    />
  );
}