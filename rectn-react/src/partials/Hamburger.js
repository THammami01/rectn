const Hamburger = ({handleHamburger}) => {
  return (
    <svg viewBox="0 0 100 80" width="40" height="40" onClick={handleHamburger}>
      <rect y="7" width="100" height="12"></rect>
      <rect y="35" width="100" height="12"></rect>
      <rect y="65" width="100" height="12"></rect>
    </svg>
  );
};

export default Hamburger;
