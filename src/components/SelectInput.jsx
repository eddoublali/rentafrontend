const SelectInput = ({
    name,
    label,
    value,
    onChange,
    options = [],
    required = false,
    error = false,
    errorMessage = "",
    placeholder = "Select...",
  }) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && errorMessage && (
          <span className="text-sm text-red-500 mt-1">{errorMessage}</span>
        )}
      </div>
    );
  };
  
  export default SelectInput;
  