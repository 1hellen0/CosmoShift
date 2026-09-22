import { NavLink, Link } from 'react-router-dom';

const enlaces = [
  { to: '/', etiqueta: 'MISIÓN', end: true },
  { to: '/puntajes', etiqueta: 'PUNTAJES' },
];

export default function Navbar({ nombre }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        COSMOSHIFT<span className="brand-dot">◈</span>
      </Link>
      <div className="navbar-links">
        {enlaces.map((e) => (
          <NavLink
            key={e.to}
            to={e.to}
            end={e.end}
            className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}>
            {e.etiqueta}
          </NavLink>
        ))}
      </div>
      <span className="navbar-user">{nombre || 'ASTRONAUTA'}</span>
    </nav>
  );
}
