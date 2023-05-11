import { PetDataProvider, PetService, SliderPetProvider, PetListHtmlWriter, PetCardHtmlWriter, PaginatorPetProvider }
    from "../code/PetData.js";

let sliderHandler = null;
let paginationHandler = null;

window.addEventListener("load", () => {
    let sliderElement = document.querySelector(".pets-list_slider");
    if (sliderElement != null) {
        sliderHandler = new SliderHandler();
    }

    let paginationElement = document.querySelector(".pets-list_paginator");
    if (paginationElement != null) {
        let petsPerPage = null;
        if (mediaMore1270.matches) {
            petsPerPage = 8;
        }
        else if (mediaLess1270More618.matches) {
            petsPerPage = 6;
        }
        else if (mediaLess618.matches) {
            petsPerPage = 4;
        }
        paginationHandler = new PaginationHandler(petsPerPage);

    }
});

// ACTIVE PAGE 
const changingTextEvent = new Event("changeTxt");
let activePageElement = document.querySelector(".our-pets__navigator-paginator_active");
if (activePageElement != null) {
    activePageElement.addEventListener("changeTxt", () => {
        let numberOnElement = activePageElement.textContent;
        let disabledClassName = "our-pets__navigation-paginator_disabled";

        if (numberOnElement == 1) {
            previousPageButton.classList.add(disabledClassName);
            firstPageButton.classList.add(disabledClassName);
        } else {
            previousPageButton.classList.remove(disabledClassName);
            firstPageButton.classList.remove(disabledClassName);
        }

        if (paginationHandler.isLastPage(numberOnElement)) {
            nextPageButton.classList.add(disabledClassName);
            lastPageButton.classList.add(disabledClassName);
        } else {
            nextPageButton.classList.remove(disabledClassName);
            lastPageButton.classList.remove(disabledClassName);
        }
    });
}


// NEXT PAGE BUTTON
let nextPageButton = querySelecorIncludesText(".our-pets__navigation-paginator", ">");
if (nextPageButton != null) {
    nextPageButton.addEventListener("click", () => {
        if (paginationHandler != null) {
            paginationHandler.goToNextPage();
        }
    });
}

// PREVIOUS PAGE BUTTON
let previousPageButton = querySelecorIncludesText(".our-pets__navigation-paginator", "<");
if (previousPageButton != null) {
    previousPageButton.addEventListener("click", () => {
        if (paginationHandler != null) {
            paginationHandler.goToPreviousPage();
        }
    });
}

// FIRST PAGE BUTTON
let firstPageButton = querySelecorIncludesText(".our-pets__navigation-paginator", "<<");
if (firstPageButton != null) {
    firstPageButton.addEventListener("click", () => {
        if (paginationHandler != null) {
            paginationHandler.goToFirstPage();
        }
    });
}

// LAST PAGE BUTTON
let lastPageButton = querySelecorIncludesText(".our-pets__navigation-paginator", ">>");
if (lastPageButton != null) {
    lastPageButton.addEventListener("click", () => {
        if (paginationHandler != null) {
            paginationHandler.goToLastPage();
        }
    });
}


function querySelecorIncludesText(selector, text) {
    let element = null;
    document.querySelectorAll(selector).forEach(elem => {
        if (elem.textContent === text) {
            element = elem;
            return;
        }
    })
    return element;
};

let mediaMore1270 = window.matchMedia("(min-width: 1279px)");
let mediaLess1270More618 = window.matchMedia("(max-width: 1279px) and (min-width: 618px)");
let mediaLess618 = window.matchMedia("(max-width: 618px)");

mediaMore1270.onchange = (rule) => {
    if (rule.matches) {
        paginationHandler.changePetsPerPageAmount(8);
    }
}

mediaLess1270More618.onchange = (rule) => {
    if (rule.matches) {
        paginationHandler.changePetsPerPageAmount(6);
    }
}

mediaLess618.onchange = (rule) => {
    if (rule.matches) {
        paginationHandler.changePetsPerPageAmount(4);
    }
}


class PaginationHandler {
    paginatorPetProvider = null;
    petsOnPage = [];
    petsPerPage = 8;
    currentPage = 1;

    constructor(petsPerPage) {
        PetDataProvider.getPetsData().then((pets) => {
            let service = new PetService(pets);
            this.petsPerPage = petsPerPage;
            this.paginatorPetProvider = new PaginatorPetProvider(service, this.petsPerPage);
            this.updatePage(this.currentPage);
        });
    }

    goToNextPage() {
        this.updatePage(this.currentPage + 1);
    }

    goToPreviousPage() {
        this.updatePage(this.currentPage - 1);
    }

    goToFirstPage() {
        this.updatePage(1);
    }

    goToLastPage() {
        this.updatePage(this.paginatorPetProvider.getPageAmount());
    }

    updatePage(page) {
        this.removeCurrentPetCards();
        this.writePetCards(page);
        this.changeCurrentPage(page);
    }

    changePetsPerPageAmount(petsPerPage) {
        this.petsPerPage = petsPerPage;
        this.paginatorPetProvider.changePetAmountPerPage(petsPerPage);
        let newAmountOfPages = this.paginatorPetProvider.getPageAmount();
        if (this.currentPage > newAmountOfPages) {
            this.currentPage = newAmountOfPages;
        }
        this.updatePage(this.currentPage);
    }

    changeCurrentPage(page) {
        this.currentPage = page;
        document.querySelector(".our-pets__navigator-paginator_active").textContent = page;
        activePageElement.dispatchEvent(changingTextEvent);
    }

    writePetCards(page) {
        let parentNode = document.querySelector(".pets-list__wrapper");
        this.paginatorPetProvider.getPets(page).forEach((pet) => {
            let listItem = PetListHtmlWriter.createListItem(parentNode);
            PetCardHtmlWriter.addPetCard(listItem, pet);
            this.petsOnPage.push(listItem);
        });
    }

    removeCurrentPetCards() {
        for (let i = this.petsOnPage.length - 1; i >= 0; i--) {
            this.petsOnPage[i].remove();
            this.petsOnPage.pop();
        }
    }

    isLastPage() {
        return this.paginatorPetProvider.isLastPage(this.currentPage);
    }
}

let leftButtonArrow = document.querySelector(".pets-list__button-arrow");
if (leftButtonArrow != null) {
    leftButtonArrow.addEventListener("click", () => {
        sliderHandler.slideLeft();
    });
}

let rightButtonArrow = document.querySelector(".pets-list__button-arrow_reversed");
if (rightButtonArrow != null) {
    rightButtonArrow.addEventListener("click", () => {
        sliderHandler.slideRight();
    });
}

class SliderHandler {
    petListItem = [];
    sliderPetProvider = null;
    lastSlide = "";

    constructor(petAmount = 3) {
        PetDataProvider.getPetsData().then((pets) => {
            let service = new PetService(pets);
            this.sliderPetProvider = new SliderPetProvider(service, petAmount);
            this.writeCurrentPetCards();
        });
    }

    slideLeft() {
        if (this.lastSlide == "right") {
            this.sliderPetProvider.choosePreviousPets();
        }
        else {
            this.sliderPetProvider.chooseNextPets();
        }
        this.updateCurrentPetCards("left");
        this.lastSlide = "left";
        return;
    }

    slideRight() {
        if (this.lastSlide == "left") {
            this.sliderPetProvider.choosePreviousPets();
        }
        else {
            this.sliderPetProvider.chooseNextPets();
        }
        this.updateCurrentPetCards("right");
        this.lastSlide = "right";
        return;
    }

    async updateCurrentPetCards(direction) {
        await this.animateRemove(direction);
        this.removeCurrentPetCards();
        this.writeCurrentPetCards();
        await this.animateWrite(direction);
    }

    animateRemove(direction) {
        let currentOffset = 0;
        let offsetMax = direction == "left" ? -110 : 110;
        let offsetStep = direction == "left" ? -2 : 2;
        return new Promise((resolve) => {
            let id = setInterval(() => {
                this.petListItem.forEach((petItem) => {
                    petItem.style.left = currentOffset + '%';
                });
                currentOffset += offsetStep;
                if (currentOffset === offsetMax) {
                    clearInterval(id);
                    resolve();
                    return;
                }
            }, 10);
        });
    }

    animateWrite(direction) {
        let currentOffset = direction == "left" ? 110 : -110;
        let offsetStep = direction == "left" ? -2 : 2;
        return new Promise((resolve) => {
            let id = setInterval(() => {
                this.petListItem.forEach((petItem) => {
                    petItem.style.left = currentOffset + '%';
                });
                currentOffset += offsetStep;
                if (currentOffset == 0) {
                    clearInterval(id);
                    resolve();
                    return;
                }
            }, 10);
        });
    }

    writeCurrentPetCards() {
        this.sliderPetProvider.currentPets.forEach((pet) => {
            let parentNode = document.querySelector(".pets-list__wrapper");
            let listItem = PetListHtmlWriter.createListItem(parentNode);
            PetCardHtmlWriter.addPetCard(listItem, pet);
            this.petListItem.push(listItem);
        })
    }

    removeCurrentPetCards() {
        for (let i = this.petListItem.length - 1; i >= 0; i--) {
            this.petListItem[i].remove();
            this.petListItem.pop();
        }
    }
}
