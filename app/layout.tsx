import type { Metadata } from "next";
import "./styles/main/main.scss";
import Dashboard from "./components/dashboard/dashboard";
import { ModalProvider } from "./components/modal/ModalContext";
import Loader from "./components/loader/loader";

export const metadata: Metadata = {
  title: "Large Minion | панель управления сайтом",
  description: "Панель управления сайтом Large Minion. Только для админа",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Dashboard />
        <ModalProvider>
          {children}
        </ModalProvider>
        <Loader />
      </body>
    </html>
  );
}
