'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "../../styles/kitten/kitten.scss";

interface HomeStatisticsClientProps {
  AllData: {label: string, value: number}[];
  pointData: {
    label: string;
    value: any[];
  }[];
}

export default function HomeStatisticsClient({ AllData, pointData }: HomeStatisticsClientProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownItems = {
    "Добавить": [
      { label: "Котят", href: "/add/kitten" },
      { label: "Взрослых", href: "/add/adult" },
      { label: "Выпускников", href: "/add/graduate" },
      { label: "Посты", href: "/add/post" },
      { label: "Статьи", href: "/add/article" }
    ],
    "Удалить": [
      { label: "Котят", href: "/entities/kittens" },
      { label: "Взрослых", href: "/entities/adults" },
      { label: "Выпускников", href: "/entities/graduates" },
      { label: "Посты", href: "/entities/posts" },
      { label: "Статьи", href: "/entities/articles" }
    ],
    "Очистить все данные": [
      { label: "Котят", href: "/entities/kittens/clear" },
      { label: "Взрослых", href: "/entities/adults/clear" },
      { label: "Выпускников", href: "/entities/graduates/clear" },
      { label: "Посты", href: "/entities/posts/clear" },
      { label: "Статьи", href: "/entities/articles/clear" }
    ]
  };

  const toggleDropdown = (buttonLabel: string) => {
    setActiveDropdown(activeDropdown === buttonLabel ? null : buttonLabel);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const buttonsData = [
    { label: "Добавить" },
    { label: "Удалить" },
    { label: "Очистить все данные" }
  ];

  const getImageSrc = (item: any, type: string) => {
    if (type === "Посты") {
      return item.image || '/default-post.jpg';
    }
    if (type === "Взрослые" || type === "Выпускники") {
      return item.portait || '/default-cat.jpg';
    }
    return item.image || '/default-cat.jpg';
  };

  const getItemName = (item: any, type: string) => {
    if (type === "Посты") {
      return item.title || 'Без названия';
    }
    if (type === "Статьи") {
      return item.title || 'Без названия';
    }
    return item.name || item.title || 'Без имени';
  };

  const renderCard = (item: any, type: string) => {
    if (type === "Статьи") {
      return (
        <div className="article-card" key={item._id}>
          <div className="data-kitten">
            <h4>{item.title}</h4>
            <span>{item.description?.substring(0, 100)}...</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="pet-card-area" key={item._id}>
        <div className="image-wrapper-area">
          <Image 
            src={getImageSrc(item, type)}
            alt={getItemName(item, type)}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="area-overflow">
          <h4>{getItemName(item, type)}</h4>
          <span>{item.description}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="universal-styling">
      <div className="home-statistics">
        <div className="top-settings">
          <div className="top-board">
            {AllData.map(item => (
              <div className="statistic-generic" key={item.label}>
                <h3>{item.label}</h3>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          
          <div className="buttons-board">
            {buttonsData.map((item) => (
              <div key={item.label} className="button-wrapper">
                <button onClick={() => toggleDropdown(item.label)}>
                  {item.label}
                </button>
                
                {activeDropdown === item.label && (
                  <>
                    <div className="dropdown-overlay" onClick={handleClickOutside} />
                    <div className="dropdown-menu">
                      {dropdownItems[item.label as keyof typeof dropdownItems].map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="dropdown-item"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pets-section">
          {pointData.map((data, index) => (
            <div className="pets-area" key={index}>
              <h3>{data.label}</h3>
              <div className="pets-area-flex">
                {data.value.length > 0 ? (
                  data.value.map((item: any) => renderCard(item, data.label))
                ) : (
                  <div className="empty-state">Нет данных</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}