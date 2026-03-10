document.addEventListener("DOMContentLoaded", () => {
  const storiesLinks = document.querySelectorAll("[data-scroll-target='stories']");
  const storiesTitle = document.getElementById("stories-title");

  if (!storiesLinks.length || !storiesTitle) {
    return;
  }

  const handleScroll = (event) => {
    event.preventDefault();
    storiesTitle.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  storiesLinks.forEach((link) => {
    link.addEventListener("click", handleScroll);
  });
});
