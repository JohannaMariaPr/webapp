// Props passed into the reusable search bar
// Value stores the current search text, onChange updates that value in the parent component
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      {/* Controlled search input, value comes from the parent component, and every change is sent back through onChange. */}
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search hike, painting, artist, or location..."
        className="w-full rounded-full border border-[#673C33] bg-[#FFF8F3] px-4 py-2.5 pr-11 text-sm text-[#673C33] placeholder:text-[#673C33] focus:outline-none focus:ring-2 focus:ring-[#879FD0]"
      />

      {/* Decorative search icon, pointer-events-none prevents it from blocking clicks on the input. */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#673C33]">
        ⌕
      </span>
    </div>
  );
}
