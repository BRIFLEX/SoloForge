/** Resolve asset paths from any page depth */
window.SF_ASSETS = (function () {
  const path = window.location.pathname;
  const inSubfolder = path.split("/").filter(Boolean).length > 1;
  const base = inSubfolder ? "../assets/images/" : "./assets/images/";
  return function (file) {
    return base + file;
  };
})();
