import { IDashboard } from "@/types/dashboard.type";

export const dashboardData: IDashboard[] = [
  {
    lable: "Главная",
    pageLink: "/",
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
];