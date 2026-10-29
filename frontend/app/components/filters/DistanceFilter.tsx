// Props received from the parent component.
// value is the currently selected distance, onChange updates the selected value

interface DistanceFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

// Available distance options shown as filter buttons
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
      {/* Create one button for each distance option. */}
      {distanceOptions.map((option) => {
        // Check if this option is currently selected
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            // Select the option, or remove it if it is already selected
            onClick={() =>
              onChange(isSelected ? null : option.value)
            }
            // Change the button style when the option is selected
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