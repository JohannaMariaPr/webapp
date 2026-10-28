interface DurationFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const durationOptions = [
  { label: "< 1 h", value: "under-1" },
  { label: "1-2 h", value: "1-2" },
  { label: "2-3 h", value: "2-3" },
  { label: "3-4 h", value: "3-4" },
  { label: "> 4 h", value: "over-4" },
];

export default function DurationFilter({
  value,
  onChange,
}: DurationFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {durationOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onChange(isSelected ? null : option.value)
            }
            className={`
              rounded-full
              border
              px-4
              py-2
              text-sm
              transition
              ${
                isSelected
                  ? "bg-[#7C9DD2] text-white border-[#7C9DD2]"
                  : "bg-transparent text-[#673C33] border-[#7C9DD2]"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}