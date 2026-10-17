import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">Financial Asset Manager</div>
        <nav className="menu">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/assets" end>Assets</NavLink>
          <NavLink to="/assets/add">Add Asset</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
