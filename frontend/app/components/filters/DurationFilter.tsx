// Props received from the parent component.
// value is the currently selected duration, onChange updates the selected value
interface DurationFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

// Available duration options shown as filter buttons
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
      {/* Create one button for each duration option. */}
      {durationOptions.map((option) => {
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