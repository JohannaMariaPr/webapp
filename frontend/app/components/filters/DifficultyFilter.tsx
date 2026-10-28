interface DifficultyFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

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
      {difficultyOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onChange(isSelected ? null : option.value)
            }
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