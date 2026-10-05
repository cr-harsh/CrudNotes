import React from 'react';

// Top navigation bar showing user details and logout button
function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Notes App</div>
      <div className="navbar-user">
        <span className="user-email">{user?.email}</span>
        <button onClick={onLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
