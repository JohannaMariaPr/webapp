// Props received from the parent component
// value is the currently selected difficulty, onChange updates the selected value.

interface DifficultyFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}
// Available difficulty options and their matching colours
const difficultyOptions = [
  { label: "Easy", value: "easy", border: "#B2AB2B" },
  { label: "Medium", value: "medium", border: "#F4D68C" },
  { label: "Hard", value: "hard", border: "#D14C18" },
];

export default function DifficultyFilter({
  value,
  onChange,
}: DifficultyFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Create one button for each difficulty option. */}
      {difficultyOptions.map((option) => {
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
            // Use the difficulty colour for the border and fill the button when selected
            style={{
              borderColor: option.border,
              backgroundColor: isSelected ? option.border : "transparent",
            }}
            className={`
              rounded-full
              border
              px-4
              py-2
              text-sm
              transition
              ${isSelected ? "text-white" : "text-[#673C33]"}
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}