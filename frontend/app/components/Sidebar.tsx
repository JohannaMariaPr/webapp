import { useState } from "react";
import { NavLink } from "react-router";
import logo from "../../images/logo.png";
import menuFooter from "../../images/menufooter.png";

type IconName = "home" | "explore" | "map" | "saved" | "account";

const navigation = [
  { label: "Home", to: "/", icon: "home" as IconName, end: true },
  { label: "Explore", to: "/allhikes", icon: "explore" as IconName },
  { label: "Map", to: "/map", icon: "map" as IconName },
  { label: "Saved", to: "/saved", icon: "saved" as IconName },
  { label: "Account", to: "/404", icon: "account" as IconName },
];

function NavigationIcon({ name }: { name: IconName }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </svg>
    );
  }

  if (name === "explore") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </svg>
    );
  }

  if (name === "map") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    );
  }

  if (name === "saved") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
        <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h9A2.5 2.5 0 0 1 20 4.5V21l-6-4-6 4V6" />
        <path d="M4 6v13l4-2.67" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
      <path d="M4 21v-1.5A3.5 3.5 0 0 1 7.5 16h9a3.5 3.5 0 0 1 3.5 3.5V21" />
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 21h16" />
    </svg>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-menu-button"
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>
        <div className="sidebar-header">
          <img className="sidebar-logo" src={logo} alt="LYSTT" />
          <button
            className="sidebar-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          >
            <span />
            <span />
          </button>
          <h1>Menu</h1>
          <p>Find your hikes, manage saved trails, and personalize your hiking experience.</p>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " sidebar-link--active" : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              <NavigationIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <img
          className="sidebar-footer"
          src={menuFooter}
          alt=""
          aria-hidden="true"
        />
      </aside>
    </>
  );
}
