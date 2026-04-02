import React, { useState, useEffect } from "react";

function App() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // ==================== EFFECT 8: Fetch Data ====================
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      console.log("📡 Effect 8: Fetching posts");

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        if (isMounted) {
          setPosts(data);
          setLoading(false);
        }

      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      console.log("🧹 Cleanup: Cancelling data fetch");
      isMounted = false;
    };
  }, []);

  // ==================== EFFECT 9: Debounced Search ====================
  useEffect(() => {
    console.log(`🔍 Effect 9: Debouncing search: "${searchTerm}"`);

    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // 🔹 Filtered Posts
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(debouncedTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>API + Debounced Search</h1>

      {/* 🔹 Search */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />

      {/* 🔹 Status */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔹 Posts */}
      <div>
        {filteredPosts.map(post => (
          <div key={post.id} style={styles.card}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>

      <p style={styles.info}>
        👉 API fetch with cleanup + debounced search (performance optimized)
      </p>

      <p style={styles.note}>
        Open console to see logs 👀
      </p>
    </div>
  );
}

// 🎨 Styling
const styles = {
  container: {
    textAlign: "center",
    marginTop: "40px",
    fontFamily: "Arial"
  },
  input: {
    padding: "10px",
    width: "250px",
    marginBottom: "20px"
  },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    margin: "10px auto",
    width: "300px"
  },
  info: {
    marginTop: "20px",
    color: "green"
  },
  note: {
    color: "gray"
  }
};

export default App;