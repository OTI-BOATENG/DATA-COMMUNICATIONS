const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.querySelector(".back-to-top");
const themeToggle = document.querySelector(".theme-toggle");
const scrollProgress = document.querySelector(".scroll-progress");
const topicSearch = document.querySelector("#topic-search");
const countElements = document.querySelectorAll("[data-count]");
const copyLink = document.querySelector(".copy-link");
const footerClock = document.querySelector("#footer-clock");
const loader = document.querySelector(".loader");
const printPage = document.querySelector(".print-page");
const focusMode = document.querySelector(".focus-mode");
const quizSubmit = document.querySelector(".quiz-submit");
const quizResult = document.querySelector(".quiz-result");
const quizScorebar = document.querySelector(".quiz-scorebar span");
const learnedProgress = document.querySelector(".learned-progress");
const certificateYear = document.querySelector(".certificate-year");
const revealElements = document.querySelectorAll(".reveal");

const currentYearEl = document.getElementById("current-year");
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

if (certificateYear) {
    certificateYear.textContent = new Date().getFullYear();
}

const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
};

const toggleBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 500);
};

window.addEventListener("load", () => {
    setTimeout(() => {
        loader?.classList.add("loaded");
    }, 450);
    updateScrollProgress();
    toggleBackToTop();
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
}

const updateThemeLabel = () => {
    if (!themeToggle) return;
    const isLight = document.body.classList.contains("light-theme");
    themeToggle.innerHTML = `<i class="fa-solid ${isLight ? "fa-moon" : "fa-sun"}"></i>`;
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
};

updateThemeLabel();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-theme");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        updateThemeLabel();
    });
}

if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navList.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

links.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        navList?.classList.remove("open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
});

document.querySelectorAll(".quick-jumps a").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

document.querySelectorAll(".toc-grid a, .footer a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

if (copyLink) {
    copyLink.addEventListener("click", async () => {
        const liveLink = window.location.href;

        try {
            await navigator.clipboard.writeText(liveLink);
            copyLink.textContent = "Link Copied";
        } catch {
            copyLink.textContent = "Copy Failed";
        }

        setTimeout(() => {
            copyLink.textContent = "Copy Live Link";
        }, 1800);
    });
}

if (printPage) {
    printPage.addEventListener("click", () => window.print());
}

if (focusMode) {
    focusMode.addEventListener("click", () => {
        const isFocused = document.body.classList.toggle("focus-reading");
        focusMode.setAttribute("aria-pressed", String(isFocused));
        focusMode.textContent = isFocused ? "Normal View" : "Focus Mode";
    });
}

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const panel = trigger.nextElementSibling;
        const icon = trigger.querySelector(".accordion-icon");
        const isOpen = panel.classList.toggle("open");

        trigger.setAttribute("aria-expanded", String(isOpen));
        icon.textContent = isOpen ? "-" : "+";
    });
});

document.querySelectorAll(".flip-card").forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(card.classList.contains("is-flipped")));
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            card.classList.toggle("is-flipped");
            card.setAttribute("aria-pressed", String(card.classList.contains("is-flipped")));
        }
    });

    const title = card.querySelector("h3")?.textContent || "topic";
    const back = card.querySelector(".flip-card-back");
    const learnedKey = `learned:${title}`;
    const learnedButton = document.createElement("button");
    learnedButton.type = "button";
    learnedButton.className = "learned-btn";
    learnedButton.textContent = localStorage.getItem(learnedKey) === "true" ? "Learned" : "Mark as learned";

    if (localStorage.getItem(learnedKey) === "true") {
        card.classList.add("learned");
    }

    learnedButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const isLearned = !card.classList.contains("learned");
        card.classList.toggle("learned", isLearned);
        localStorage.setItem(learnedKey, String(isLearned));
        learnedButton.textContent = isLearned ? "Learned" : "Mark as learned";
        updateLearnedProgress();
    });

    back.appendChild(learnedButton);
});

const updateLearnedProgress = () => {
    const cards = document.querySelectorAll(".flip-card");
    const learnedCount = document.querySelectorAll(".flip-card.learned").length;

    if (learnedProgress) {
        learnedProgress.textContent = `${learnedCount} of ${cards.length} topics marked learned`;
    }
};

document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", updateLearnedProgress);
});

updateLearnedProgress();

const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
}[character]));

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resetSearchHighlights = () => {
    document.querySelectorAll("[data-search-text]").forEach((element) => {
        element.textContent = element.dataset.searchText;
    });
};

const highlightSearchTerm = (card, searchTerm) => {
    if (!searchTerm) {
        return;
    }

    const pattern = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");

    card.querySelectorAll("h3, p").forEach((element) => {
        if (!element.dataset.searchText) {
            element.dataset.searchText = element.textContent;
        }

        const originalText = element.dataset.searchText;
        element.innerHTML = escapeHtml(originalText).replace(pattern, "<mark class=\"search-highlight\">$1</mark>");
    });
};

if (topicSearch) {
    topicSearch.addEventListener("input", () => {
        const searchTerm = topicSearch.value.trim().toLowerCase();
        resetSearchHighlights();

        document.querySelectorAll(".flip-card").forEach((card) => {
            const text = card.textContent.toLowerCase();
            const isHidden = searchTerm !== "" && !text.includes(searchTerm);

            card.classList.toggle("hidden-topic", isHidden);

            if (!isHidden) {
                highlightSearchTerm(card, searchTerm);
            }
        });
    });
}

const animateCount = (element) => {
    const target = Number(element.dataset.count);
    let start = null;
    element.textContent = '0';

    const update = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const duration = 900;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(progress * target);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);
};

const countObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.45 }
);

countElements.forEach((element) => {
    element.textContent = '0';
    countObserver.observe(element);
});

const initializeCardScrollers = () => {
    document.querySelectorAll('.flip-card-face').forEach((face) => {
        if (face.querySelector('.scroll-container')) return;

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';

        while (face.firstChild) {
            scrollContainer.appendChild(face.firstChild);
        }

        face.appendChild(scrollContainer);

        const controls = document.createElement('div');
        controls.className = 'scroll-controls';
        controls.innerHTML = '<button type="button" class="scroll-up" aria-label="Scroll up">▲</button><button type="button" class="scroll-down" aria-label="Scroll down">▼</button>';
        face.appendChild(controls);

        const upButton = controls.querySelector('.scroll-up');
        const downButton = controls.querySelector('.scroll-down');

        upButton.addEventListener('click', () => {
            scrollContainer.scrollBy({ top: -110, behavior: 'smooth' });
        });

        downButton.addEventListener('click', () => {
            scrollContainer.scrollBy({ top: 110, behavior: 'smooth' });
        });
    });
};

initializeCardScrollers();

if (quizSubmit && quizResult) {
    quizSubmit.addEventListener("click", () => {
        const answers = ["q1", "q2", "q3"];
        const score = answers.reduce((total, name) => {
            const selected = document.querySelector(`input[name="${name}"]:checked`);
            return total + (selected?.value === "correct" ? 1 : 0);
        }, 0);

        document.querySelectorAll(".quiz-card label").forEach((label) => {
            const input = label.querySelector("input");
            label.classList.remove("correct-answer", "wrong-answer");

            if (input?.value === "correct") {
                label.classList.add("correct-answer");
            }

            if (input?.checked && input.value !== "correct") {
                label.classList.add("wrong-answer");
            }
        });

        const percent = Math.round((score / answers.length) * 100);
        const message = score === answers.length
            ? "Excellent work. You understand the key ideas."
            : score >= 2
                ? "Good effort. Review the highlighted answers and try again."
                : "Keep studying the sections above, then try again.";

        if (quizScorebar) {
            quizScorebar.style.width = `${percent}%`;
        }
        quizResult.textContent = `You scored ${score} out of ${answers.length} (${percent}%). ${message}`;
    });
}


const activeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            links.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
    }
);

sections.forEach((section) => activeObserver.observe(section));

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.14
    }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
    updateScrollProgress();
    toggleBackToTop();
});

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

const updateFooterClock = () => {
    if (!footerClock) return;
    const now = new Date();
    footerClock.textContent = now.toLocaleString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

updateFooterClock();
setInterval(updateFooterClock, 60000);
