const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex items-center">
      <label htmlFor="visible" className="text-lg mr-4 font-medium text-gray-700">{label}</label>
      <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          id="visible"
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          checked={checked}
          onChange={onChange}
          style={{ right: checked ? "0" : "auto" }}
        />
        <label htmlFor="visible" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${checked ? "bg-switch-active border-switch-active" : "bg-switch-inactive"}`}></label>
      </div>
    </div>
  );
  
  export default ToggleSwitch;
  