const FormField = ({ label, type, id, value, onChange, maxLength }) => (
    <div className="flex gap-x-2 items-center">
      <label className="block text-lg font-medium text-gray-700" htmlFor={id}>{label}:</label>
      <input
        className="mt-1 w-3/5 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-2"
        type={type}
        id={id}
        required
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
    </div>
  );
  
  export default FormField;
  