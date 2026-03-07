'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HomeStatisticsClientProps {
  AllData: {label: string, value: number}[];
  pointData: {
    label: string;
    value: any[];
  }[];
}

export default function HomeStatisticsClient({ AllData, pointData }: HomeStatisticsClientProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Все пункты меню теперь только ссылки
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
      { label: "Котят", href: "/admin/kittens/clear" },
      { label: "Взрослых", href: "/admin/adults/clear" },
      { label: "Выпускников", href: "/admin/graduates/clear" },
      { label: "Посты", href: "/admin/posts/clear" },
      { label: "Статьи", href: "/admin/articles/clear" }
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
                {data.value.map((pet: any, petIndex: number) => (
                  <div className="pet-card-area" key={pet._id || petIndex}>
                    <div className="image-wrapper-area">
                      <Image 
                        src={pet.image || pet.portait || '/default-cat.jpg'}
                        alt={pet.name || pet.title || 'pet'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="area-overflow">
                      <h4>{pet.name || pet.title}</h4>
                      <span>{pet.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}