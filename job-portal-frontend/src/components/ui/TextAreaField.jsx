
const TextAreaField = ({ label, name, value, onChange, placeholder, required = false, rows = 4 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-800 focus:border-blue-800 transition duration-150"
        ></textarea>
    </div>
);

export default TextAreaField
