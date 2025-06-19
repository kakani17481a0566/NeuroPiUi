// components/SearchBar.jsx
import PropTypes from "prop-types";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="d-flex justify-content-end mb-3">
      <input
        type="text"
        className="form-control form-control-sm w-auto"
        placeholder="Search students..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
