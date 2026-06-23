(function () {
    const runes = [
        { id: "moon", label: "☾ Moon" },
        { id: "star", label: "✦ Star" },
        { id: "key", label: "✧ Key" },
    ];

    const sequence = shuffle([...runes]);
    let progress = 0;
    const status = document.getElementById("welcome-status");
    const sequenceLabel = document.getElementById("welcome-sequence");
    const runeContainer = document.getElementById("welcome-runes");
    const enterButton = document.getElementById("enter-site");
    const exitDurationMs = 650;
    let isTransitioning = false;

    function shuffle(items) {
        for (let i = items.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }

    function setButtonState(isOpen) {
        enterButton.classList.toggle("is-disabled", !isOpen);
        enterButton.setAttribute("aria-disabled", String(!isOpen));
        enterButton.tabIndex = isOpen ? 0 : -1;
    }

    function resetPuzzle(message) {
        progress = 0;
        sequenceLabel.textContent = `Order: ${sequence.map((item) => item.label).join(" → ")}`;
        runeButtons.forEach((button) => button.classList.remove("is-active", "is-solved"));
        setButtonState(false);
        if (message) {
            status.textContent = message;
        }
    }

    function beginExitTransition(event) {
        if (isTransitioning || enterButton.classList.contains("is-disabled")) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        isTransitioning = true;
        document.body.classList.add("is-exiting");
        status.textContent = "Entering the storybook...";
        enterButton.setAttribute("aria-disabled", "true");
        enterButton.tabIndex = -1;
        sessionStorage.setItem("fairytales:entry-transition", "welcome");

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.setTimeout(() => {
            window.location.assign(enterButton.getAttribute("href"));
        }, reducedMotion ? 0 : exitDurationMs);
    }

    const runeButtons = sequence
        .slice()
        .sort(() => Math.random() - 0.5)
        .map((rune) => {
            const button = document.createElement("button");
            button.className = "rune_button";
            button.type = "button";
            button.dataset.rune = rune.id;
            button.textContent = rune.label;
            button.addEventListener("click", () => {
                if (isTransitioning) {
                    return;
                }

                const expected = sequence[progress];

                if (rune.id === expected.id) {
                    button.classList.add("is-active");
                    progress += 1;

                    if (progress === sequence.length) {
                        runeButtons.forEach((item) => item.classList.add("is-solved"));
                        status.textContent = "The gate opens. You may enter the fairytale library.";
                        setButtonState(true);
                    } else {
                        status.textContent = `Good. ${sequence.length - progress} charm${sequence.length - progress === 1 ? "" : "s"} left.`;
                    }
                } else {
                    resetPuzzle("The charm fades. Try the order shown above.");
                }
            });
            return button;
        });

    runeButtons.forEach((button) => runeContainer.appendChild(button));
    resetPuzzle("The gate is asleep. Wake it with the correct charm.");
    enterButton.addEventListener("click", beginExitTransition);
})();