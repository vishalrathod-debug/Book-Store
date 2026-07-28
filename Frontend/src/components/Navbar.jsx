import { useContext} from "react";
import { SearchContext } from "../../context/context";

// 1. Accept onSearchSubmit as a prop
const Navbar = () => {
     const { search, setSearch } = useContext(SearchContext);
    
    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex justify-between items-center p-4 bg-slate-900 text-white shadow-md">
            <div className="flex items-center gap-3">
                <img src="./images.png" className="h-10 w-10 object-contain" alt="Logo" />
            </div>
            
            <form onSubmit={handleSearch} className="flex max-w-md w-full">
                <input
                    type="text"
                    placeholder="Search titles or authors..."
                    className="px-4 py-2 w-full rounded-l-xl bg-slate-800 text-slate-100 placeholder-slate-400 outline-none border border-slate-700 focus:border-indigo-500 transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-5 rounded-r-xl font-bold transition shadow-sm">
                    Search
                </button>
            </form>
        </div>
    );
};

export default Navbar;
