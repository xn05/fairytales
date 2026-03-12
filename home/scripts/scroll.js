document.addEventListener("DOMContentLoaded", () => {
  const storiesLinks = document.querySelectorAll("[data-scroll-target='stories']");
  const storiesTitle = document.getElementById("stories-title");
  const storiesToggle = document.querySelector(".nav_item_dropdown .nav_button");
  const dropdownWrapper = document.querySelector(".nav_item_dropdown");

  if (storiesLinks.length && storiesTitle) {
    const handleScroll = (event) => {
      event.preventDefault();
      storiesTitle.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    storiesLinks.forEach((link) => {
      link.addEventListener("click", handleScroll);
    });
  }
});
