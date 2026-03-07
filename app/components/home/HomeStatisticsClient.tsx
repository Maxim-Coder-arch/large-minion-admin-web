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

  const dropdownItems = {
    "Добавить": [
      { label: "Добавить котят", href: "/add/kitten" },
      { label: "Добавить взрослых", href: "/add/adult" },
      { label: "Добавить выпускников", href: "/add/graduate" },
      { label: "Добавить посты", href: "/admin/posts/new" },
      { label: "Добавить статьи", href: "/admin/articles/new" }
    ],
    "Удалить": [
      { label: "Удалить котят", action: "delete-kittens" },
      { label: "Удалить взрослых", action: "delete-adults" },
      { label: "Удалить выпускников", action: "delete-graduates" },
      { label: "Удалить посты", action: "delete-posts" },
      { label: "Удалить статьи", action: "delete-articles" }
    ],
    "Изменить": [
      { label: "Изменить котят", href: "/admin/kittens" },
      { label: "Изменить взрослых", href: "/admin/adults" },
      { label: "Изменить выпускников", href: "/admin/graduates" },
      { label: "Изменить посты", href: "/admin/posts" },
      { label: "Изменить статьи", href: "/admin/articles" }
    ],
    "Очистить все данные": [
      { label: "Очистить всех котят", action: "clear-kittens", danger: true },
      { label: "Очистить всех взрослых", action: "clear-adults", danger: true },
      { label: "Очистить всех выпускников", action: "clear-graduates", danger: true },
      { label: "Очистить все посты", action: "clear-posts", danger: true },
      { label: "Очистить все статьи", action: "clear-articles", danger: true }
    ]
  };

  const handleAction = (action: string) => {
  
    setActiveDropdown(null);
  };

  const toggleDropdown = (buttonLabel: string) => {
    setActiveDropdown(activeDropdown === buttonLabel ? null : buttonLabel);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const buttonsData = [
    {
      label: "Добавить",
    },
    {
      label: "Удалить",
    },
    {
      label: "Изменить",
    },
    {
      label: "Очистить все данные",
    },
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
                <button 
                  onClick={() => toggleDropdown(item.label)}
                >
                  {item.label}
                </button>
                
                {activeDropdown === item.label && (
                  <>
                    <div className="dropdown-overlay" onClick={handleClickOutside} />
                    <div className="dropdown-menu">
                      {dropdownItems[item.label as keyof typeof dropdownItems].map((dropdownItem) => (
                        dropdownItem.href ? (
                          <Link 
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className={`dropdown-item ${dropdownItem.danger ? 'danger' : ''}`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ) : (
                          <button
                            key={dropdownItem.label}
                            className={`dropdown-item ${dropdownItem.danger ? 'danger' : ''}`}
                            onClick={() => handleAction(dropdownItem.action || '')}
                          >
                            {dropdownItem.label}
                          </button>
                        )
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