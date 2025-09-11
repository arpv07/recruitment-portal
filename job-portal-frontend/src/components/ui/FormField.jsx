
const FormField = ({ label, type, name, value, onChange, placeholder, required = true, readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-800 focus:border-blue-800 transition duration-150 ${readOnly ? 'bg-gray-100' : ''}`}
            required={required} readOnly={readOnly}
        />
    </div>
);

export default FormField
