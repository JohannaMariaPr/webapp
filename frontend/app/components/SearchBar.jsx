export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search hike, painting, artist, or location..."
        className="
          w-full
          rounded-full
          border border-[#673C33]
          bg-[#FFF8F3]
          px-4 py-2.5 pr-11
          text-sm
          text-[#673C33]
          placeholder:text-[#673C33]
          focus:outline-none
          focus:ring-2
          focus:ring-[#879FD0]
        "
      />

      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#673C33]">
        ⌕
      </span>
    </div>
  );
}