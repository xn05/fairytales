(function () {
    try {
        if (sessionStorage.getItem("fairytales:entry-transition") === "welcome") {
            document.documentElement.classList.add("from-welcome");
            sessionStorage.removeItem("fairytales:entry-transition");
        }
    } catch {
        // Storage can be unavailable in some browser modes.
    }
})();