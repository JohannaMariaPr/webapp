import { Link, useNavigate } from "react-router";
import SearchBar from "./SearchBar";

// header used at the top of allhikes, saved, hike detail and active hike.

export default function Header({
  title,
  description,
  showSearch = false,
  showFilter = true,
  searchValue = "",
  onSearchChange = () => {},
  showProfile = true,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <header className={`bg-background px-6 pb-4 pt-5 text-ink ${className}`}>
      {/* right padding leaves room for the menu button  */}
      <div className="mb-3 flex items-center justify-between pr-12 min-[761px]:pr-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="grid size-8 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {showProfile && (
          <Link
            to="/profile"
            aria-label="Profile"
            className="grid size-8 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
            </svg>
          </Link>
        )}
      </div>

      <h1 className="text-[clamp(1.75rem,8vw,2.8125rem)] font-bold uppercase leading-tight">
        {title}
      </h1>
      {/* line-clamp-2: more than 2 lines of text are cut with "..." */}
      <p className="mt-1 line-clamp-2 max-w-md text-[clamp(1rem,3.8vw,1.3125rem)] leading-snug min-[761px]:max-w-none">
        {description}
      </p>

      {showSearch && (
        <div className="mt-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <SearchBar value={searchValue} onChange={onSearchChange} />
          </div>
          {showFilter && (
            <button
              type="button"
              aria-label="Filters"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-ink/40 text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
                <circle cx="15" cy="8" r="2" />
                <circle cx="9" cy="16" r="2" />
              </svg>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
