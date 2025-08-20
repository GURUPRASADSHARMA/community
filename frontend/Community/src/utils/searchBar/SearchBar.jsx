import { Search } from "lucide-react";

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search users..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      
    </div>
  );
}
