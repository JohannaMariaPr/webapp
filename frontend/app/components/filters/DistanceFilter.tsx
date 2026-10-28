interface DistanceFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const distanceOptions = [
  { label: "< 2 km", value: "under-2" },
  { label: "2-5 km", value: "2-5" },
  { label: "5-10 km", value: "5-10" },
  { label: "10-15 km", value: "10-15" },
  { label: "> 15 km", value: "over-15" },
];

export default function DistanceFilter({
  value,
  onChange,
}: DistanceFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {distanceOptions.map((option) => {
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
                  ? "bg-[#673C33] text-white border-[#673C33]"
                  : "bg-transparent text-[#673C33] border-[#673C33]"
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