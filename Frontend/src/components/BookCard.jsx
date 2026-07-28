import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../context/context";


const BookCard = () => {
  const { search } = useContext(SearchContext);

  const [bookData, setBookdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // 🔁 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔄 Reset page + data on new search
  useEffect(() => {
    setPage(1);
    setBookdata([]);
  }, [debouncedSearch]);

  // 📡 Fetch data
  const fetchBooksData = async () => {
    try {
      setLoading(true);

      const url = debouncedSearch
        ? `https://gutendex.com/books?search=${debouncedSearch}&page=${page}`
        : `https://gutendex.com/books?page=${page}`;

      const res = await fetch(url);
      const data = await res.json();

      // 🔥 IMPORTANT: replace vs append
      if (page === 1) {
        setBookdata(data.results || []);
      } else {
        setBookdata((prev) => [...prev, ...(data.results || [])]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Correct trigger
  useEffect(() => {
    fetchBooksData();
  }, [page, debouncedSearch]);

  // 📜 Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // Initial loading
  if (loading && page === 1) {
    return <h1 className="text-center mt-10">Loading...</h1>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
      {bookData.map((book) => {
        return (
          <div
            key={book.id}
            className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between h-full bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div>
              {/* Image */}
              <img
                src={
                  book.formats?.["image/jpeg"] ||
                  "https://placehold.co/200x300"
                }
                alt={book.title}
                className="w-full h-auto max-h-72 object-contain rounded-md mb-3 bg-slate-50"
              />

              {/* Tags */}
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    book.copyright
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {book.copyright ? "Copyrighted" : "Free Book"}
                </span>

                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {book.languages?.join(", ").toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-extrabold text-lg text-slate-900 line-clamp-2 leading-snug">
                {book.title}
              </h1>

              {/* Authors */}
              <p className="text-xs text-indigo-600 mt-1 font-semibold">
                {book.authors && book.authors.length > 0
                  ? book.authors.map((a) => a.name).join(", ")
                  : "Unknown Author"}
              </p>

              {/* Summary */}
              {book.summaries && book.summaries.length > 0 && (
                <div className="mt-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 line-clamp-3 hover:line-clamp-none cursor-pointer transition-all duration-200">
                    {book.summaries[0]}
                  </p>
                  <span className="text-[10px] text-indigo-500 font-medium block mt-1">
                    Hover or tap text to read full summary
                  </span>
                </div>
              )}

              {/* Subjects */}
              <div className="flex flex-wrap gap-1 mt-3">
                {book.subjects?.slice(0, 2).map((subject, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-indigo-50/50 text-indigo-600 px-2 py-0.5 rounded-md font-medium max-w-full truncate"
                  >
                    {subject.split(" -- ")[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] text-slate-400 font-medium">
                  Downloads:{" "}
                  <strong className="text-slate-700 font-semibold">
                    {book.download_count?.toLocaleString()}
                  </strong>
                </span>
              </div>

              {book.formats?.["text/html"] && (
                <a
                  href={book.formats["text/html"]}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm"
                >
                  Read Instantly
                </a>
              )}
            </div>
          </div>
        );
      })}

      {/* 🔄 Loading more indicator */}
      {loading && page > 1 && (
        <p className="text-center col-span-3">Loading more...</p>
      )}
    </div>
  );
};

export default BookCard;