import Select from "react-select";

// Styled to match the VectorCart design system tokens — this is the
// ONE place dropdown styling lives, so every dropdown in the app stays
// visually consistent by using this component instead of native <select>.
const customStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "12px",
    borderColor: state.isFocused ? "#6366F1" : "#E2E8F0",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(99,102,241,0.15)" : "none",
    minHeight: "46px",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "#94A3B8" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 30px -10px rgba(99,102,241,0.25)",
    zIndex: 50,
  }),
  menuList: (base) => ({ ...base, padding: "4px" }),
  option: (base, state) => ({
    ...base,
    borderRadius: "8px",
    backgroundColor: state.isSelected ? "#6366F1" : state.isFocused ? "#EEF2FF" : "transparent",
    color: state.isSelected ? "white" : "#1E1B4B",
    fontSize: "0.875rem",
    padding: "9px 12px",
    cursor: "pointer",
  }),
  placeholder: (base) => ({ ...base, color: "#94A3B8" }),
  singleValue: (base) => ({ ...base, color: "#1E1B4B" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "#94A3B8" }),
  input: (base) => ({ ...base, color: "#1E1B4B" }),
};

// value/onChange work with plain values (string/number), not react-select's
// {value, label} objects — so call sites don't need to change how they
// already handle their state, same as a native <select>.
export default function SearchableSelect({
  options, value, onChange, placeholder = "Select…", isClearable = false, isDisabled = false,
}) {
  const selected = options.find((o) => String(o.value) === String(value)) || null;

  return (
    <Select
      options={options}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      placeholder={placeholder}
      isClearable={isClearable}
      isDisabled={isDisabled}
      styles={customStyles}
      classNamePrefix="vc-select"
    />
  );
}