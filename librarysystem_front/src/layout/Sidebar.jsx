import { Link } from "react-router-dom";

export default function Sidebar() {
  const sidebarStyle = {
    display: "flex",
    flexDirection: "column",
    width: "180px",
    padding: "20px",
    gap: "15px",
    backgroundColor: "black",
    color: "white",
    borderRight: "1px solid #ddd",
    height: "100vh",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "white",
    fontSize: "18px",
    padding: "8px 0",
  };

  return (
    <div style={sidebarStyle}>
      <Link to="/" style={linkStyle}>
        도서목록
      </Link>
      <Link to="/add-book" style={linkStyle}>
        도서 추가
      </Link>
    </div>
  );
}
