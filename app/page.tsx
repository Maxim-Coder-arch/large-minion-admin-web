import HomeStatistics from "./components/home/homeStatistics";
import Modal from "./components/modal/modal";

export default function Home() {
  return (
    <> 
      <HomeStatistics />
      <Modal label="Вы уверены, что хотите удалить последнего взрослого?" isActive={true} isReset={true} />
    </>
  );
}
