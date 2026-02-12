

// Reusable Input Component
const Input = ({ label, type = "text", required }) => (
    <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-600">
    {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
    type={type}
    required={required}
    className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    </div>
    );


    export default Input