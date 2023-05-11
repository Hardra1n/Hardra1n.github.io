export { addInteractivityToCard };


function addInteractivityToCard(card) {
    card.addEventListener("click", () => {
        createWrapperPetCard(card);
        stopScrolling();
    })
}

function createWrapperPetCard(card) {
    let cardCopy = card.cloneNode(true);

    let backgroundElem = document.createElement("div");
    // backgroundEl = backgroundElem;
    backgroundElem.classList.add("pet-card__background");
    backgroundElem.appendChild(cardCopy);
    cardCopy.classList.add("pet-card_modal");

    let infoWrapper = document.createElement("div");
    infoWrapper.classList.add("pet-card__info-wrapper");
    let childNodes = cardCopy.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
        if (childNodes[i].tagName != "IMG") {
            infoWrapper.appendChild(childNodes[i]);
        }
    }

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("pet-card__cancel-button");
    backgroundElem.appendChild(cancelButton);

    cardCopy.appendChild(infoWrapper);
    backgroundElem.addEventListener("click", () => {
        closePetCardModal(backgroundElem);
    });
    cancelButton.addEventListener("click", () => {
        closePetCardModal(backgroundElem);
    })
    cardCopy.addEventListener("click", (event) => {
        event.stopPropagation();
    })
    document.querySelector("body").appendChild(backgroundElem);
}

function closePetCardModal(parentNode) {
    parentNode.remove();
    resumeScrolling();
}

function stopScrolling() {
    document.querySelector("body").style.overflow = "hidden";
}

function resumeScrolling() {
    document.querySelector("body").removeAttribute("style");
}