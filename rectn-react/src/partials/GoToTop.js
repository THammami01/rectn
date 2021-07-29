import { useEffect, useState } from "react";
import { IoIosArrowDropup } from "react-icons/io";

const GoToTop = () => {
  const [showGoToTop, toggleShowToTop] = useState(false);

  const handleGoToTopClick = () => {
    window.scrollTo(0, 0);
  };

  const handleScroll = () => {
    if (window.pageYOffset < 655) toggleShowToTop(false);
    else toggleShowToTop(true);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="go-to-top"
      style={{ display: showGoToTop ? "block" : "none" }}
      onClick={handleGoToTopClick}
    >
      <IoIosArrowDropup />
    </div>
  );
};

export default GoToTop;
