const mediaQuery = window.matchMedia("(min-width: 720px)");

mediaQuery.onchange = (rule) => {
    if (rule.matches && IsSidePanelOpened()) {
        TryCloseSidePanel();
    }
}


document.querySelector(".nav__burger-menu").addEventListener("click", () => {
    TryOpenSidePanel() || TryCloseSidePanel();
});

document.querySelectorAll(".nav__item").forEach((elem) => {
    elem.addEventListener("click", () => {
        if (IsSidePanelOpened) {
            TryCloseSidePanel();
        }
    });
});



function IsSidePanelOpened() {
    return document.querySelector(".nav").classList.contains("nav_side-viewed");
}

function TryOpenSidePanel() {
    const burgerMenu = document.querySelector(".nav__burger-menu");
    const selectedAttribute = "nav__burger-menu_selected";

    if (!IsSidePanelOpened()) {
        burgerMenu.classList.toggle(selectedAttribute);
        document.querySelector(".nav").classList.toggle("nav_side-viewed");
        SlideSidePanel();
        document.querySelector("body").style.overflow = "hidden";
        return true;
    }
    return false;
}

function TryCloseSidePanel() {
    const burgerMenu = document.querySelector(".nav__burger-menu");
    const selectedAttribute = "nav__burger-menu_selected";

    if (IsSidePanelOpened()) {
        burgerMenu.classList.toggle(selectedAttribute);
        document.querySelector(".nav__item-wrapper").removeAttribute("style");
        document.querySelector("body").removeAttribute("style");
        HideSidePanel();
        return true;
    }
    return false;
}

function SlideSidePanel() {
    let panel = document.querySelector(".nav");
    let prop = panel.style.width;
    let width = parseInt(prop);
    if (!width) {
        width = 0;
    }

    width += 4;
    panel.style.width = width + "px";
    if (width < 320) {
        setTimeout(SlideSidePanel, 2);
    }
    else {
        document.querySelector(".nav__item-wrapper").style.display = "flex";
    }
};

function HideSidePanel() {
    let panel = document.querySelector(".nav");
    let prop = panel.style.width;
    let width = parseInt(prop);
    width -= 4;
    panel.style.width = width + "px";
    if (width > 0) {
        setTimeout(HideSidePanel, 2);
    }
    else {
        document.querySelector(".nav").classList.toggle("nav_side-viewed");
        document.querySelector(".nav").removeAttribute("style");
    }
}
