import IngredientsInput from "@/components/IngredientsInput";
import Sidebar from "../components/Sidebar";
import FirstLogin from "@/components/FirstLogin";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-grow ml-4">
        <IngredientsInput />
      </div>
    </div>
  );
}
