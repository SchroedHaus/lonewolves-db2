import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function App() {
    return (
      <>
        <Header />
        <main className="pt-20 px-5 flex flex-col items-center">
          <Outlet />
        </main>
      </>
    );
}