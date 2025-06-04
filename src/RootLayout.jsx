import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
