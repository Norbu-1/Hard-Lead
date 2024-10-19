import React, { useState, useEffect, useRef } from "react";
import Loading from "./Loading";

function CatGallery() {
  const [cats, setCats] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Reference to the scrollable container
  const containerRef = useRef(null);

  const fetchData = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=5&page=${page}&order=Desc`
      );
      const data = await response.json();
      setCats((prevCats) => [...prevCats, ...data]);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchData(page);
  }, [page]);

  
  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight - 1 &&
      !loading 
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading]);

  return (
    <div className="outside">
      {loading && (
        <p className="load">
          <Loading />
        </p>
      )}

      {error && <p className="load">{error}</p>}
      
      <div className="column-container" ref={containerRef}>
        {cats.map((cat) => (
          <div key={cat.id} className="card">
            <img src={cat.url} alt="Cat" className="catImg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatGallery;
