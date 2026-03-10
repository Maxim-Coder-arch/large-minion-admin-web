import { IDashboard } from "@/types/dashboard.type";

export const dashboardData: IDashboard[] = [
  {
    lable: "Главная",
    pageLink: "/",
  },
  {
    lable: "Перейти на основной сайт",
    pageLink: "https://large-minion.vercel.app/",
    blank: true,
  },
  {
    lable: "Google search console (статистика)",
    pageLink: "https://search.google.com/u/2/search-console?resource_id=https%3A%2F%2Flarge-minion.vercel.app%2F",
    blank: true,
  },
  {
    lable: "Котята",
    pageLink: "/entities/kittens",
  },
  {
    lable: "Взрослые",
    pageLink: "/entities/adults",
  },
  {
    lable: "Выпускники",
    pageLink: "/entities/graduates",
  },
  {
    lable: "Посты",
    pageLink: "/entities/posts",
  },
  {
    lable: "Статьи",
    pageLink: "/entities/articles",
  },
  {
    lable: "Добавление котят",
    pageLink: "/add/kitten",
  },
  {
    lable: "Добавление взрослых",
    pageLink: "/add/adult",
  },
  {
    lable: "Добавление выпускников",
    pageLink: "/add/graduate",
  },
  {
    lable: "Добавление постов",
    pageLink: "/add/post",
  },
  {
    lable: "Добавление статей",
    pageLink: "/add/article",
  },
  {
    lable: "Очистка всех данных котят",
    pageLink: "/entities/kittens/clear",
  },
  {
    lable: "Очистка всех данных взрослых",
    pageLink: "/entities/adults/clear",
  },
  {
    lable: "Очистка всех данных выпускников",
    pageLink: "/entities/graduates/clear",
  },
  {
    lable: "Очистка всех данных постов",
    pageLink: "/entities/posts/clear",
  },
  {
    lable: "Очистка всех данных статей",
    pageLink: "/entities/articles/clear",
  },
];