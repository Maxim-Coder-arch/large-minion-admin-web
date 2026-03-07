'use client';

import Link from "next/link";
import { dashboardData } from "../../data/data.dashboard";
import { usePathname } from "next/navigation";

export default function Dashboard() {
  const pathname = usePathname();

  return (
    <div className="dash-board">
      <ul>
        {
          dashboardData.map((item, index) => {
            const isActive = item.pageLink === pathname;
            return (
              <Link 
              className={isActive ? "active-link" : ""}
              key={index} 
              href={item.pageLink}
              >{item.lable}</Link>
            )
          })
        }
      </ul>
    </div>
  );
}