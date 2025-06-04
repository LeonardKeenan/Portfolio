import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'text-purple-400' : 'text-white';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md px-6 py-4 flex justify-between items-center text-white">
      <div className="font-bold text-xl">Leonard Keenan</div>
      <div className="flex space-x-6 text-lg">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/projects" className={isActive('/projects')}>Projects</Link>
        <Link to="/experience" className={isActive('/experience')}>Experience</Link>
        <Link to="/contact" className={isActive('/contact')}>Contact</Link>
      </div>
    </nav>
  );
}
