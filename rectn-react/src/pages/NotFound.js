import { useEffect } from "react";
import "./page.scss";

const NotFound = () => {
  useEffect(() => {
    document.title = "REC TN ‣ Page Not Found";
  });

  return (
    <div className="container">
      <h1>404 - Not Found</h1>
    </div>
  );
};

export default NotFound;
