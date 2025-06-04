import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar'; // Adjust path if needed

export default function App() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
