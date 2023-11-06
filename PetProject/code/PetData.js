export { Pet, PetCardHtmlWriter, PetListHtmlWriter, PetDataProvider, SliderPetProvider, PaginatorPetProvider, PetService };
import { addInteractivityToCard } from
    "../common.blocks/pet-card.js";

class Pet {
    name;
    img;
    type;
    breed;
    description;
    age;
    inoculations;
    diseases;
    parasites;

    constructor() { }

    info(shortOne = false) {
        if (shortOne) {
            return this.name;
        }
        return this.name + "\n" + this.type + "\n" + this.breed + "\n" + this.description + "\n\n";
    }
}

class PetCardHtmlWriter {
    static addPetCard(perentNode, pet) {
        let newCard = this.createPetCard(pet);
        perentNode.appendChild(newCard);
        return newCard;
    }

    static createPetCard(pet) {
        let cardElement = document.createElement("div");
        cardElement.classList.add("pet-card");
        cardElement.classList.add("pets-list__pet-card");


        let imgElement = document.createElement("img");
        imgElement.classList.add("pet-card__pet-avatar");
        imgElement.src = pet.img;

        let titleElement = document.createElement("span");
        titleElement.classList.add("pet-card__title");
        titleElement.textContent = pet.name;

        let learnButton = document.createElement("button");
        learnButton.classList.add("pet-card__pet-button");
        let learnButton_text = document.createElement("span");
        learnButton_text.classList.add("pet-card__pet-button-text");
        learnButton_text.textContent = "Learn more";
        learnButton.appendChild(learnButton_text);

        let petTypeElement = document.createElement("span");
        petTypeElement.classList.add("pet-card__pet-type");
        petTypeElement.textContent = pet.type + ' - ' + pet.breed;

        let descriptionElement = document.createElement("span");
        descriptionElement.classList.add("pet-card__description");
        descriptionElement.textContent = pet.description;

        let shortInfoList = document.createElement("ul");
        shortInfoList.classList.add("pet-card__short-info-list");

        let shortInfoListProperties = {
            Age: pet.age,
            Inoculations: pet.inoculations,
            Diseases: pet.diseases,
            Parasites: pet.parasites
        };

        for (let property of Object.keys(shortInfoListProperties)) {
            let shortInfoItem = document.createElement("li");
            shortInfoItem.classList.add("pet-card__short-list-item");
            let strongTextItem = document.createElement("strong");
            strongTextItem.textContent = property + ': ';
            shortInfoItem.appendChild(strongTextItem);
            let textItem = document.createElement("span");
            textItem.textContent = shortInfoListProperties[property];
            shortInfoList.appendChild(shortInfoItem);
            shortInfoItem.appendChild(textItem);
        }
        cardElement.appendChild(imgElement);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(petTypeElement);
        cardElement.appendChild(descriptionElement);
        cardElement.appendChild(shortInfoList);
        cardElement.appendChild(learnButton);
        addInteractivityToCard(cardElement);
        return cardElement;
    }
}

class PetListHtmlWriter {
    static createListItem(parentNode) {
        let listItem = document.createElement("li");
        listItem.classList.add("pets-list__list-item");
        parentNode.appendChild(listItem);
        return listItem;
    }
}



class PetDataProvider {
    static async getPetsData() {
        
        const _PET_JSON_LOCATION = "/PetProject/pets.json";

        const request = new Request(_PET_JSON_LOCATION);

        const response = await fetch(request);
        const data = await response.json();

        let pets = [];

        data.forEach(element => {
            let newPet = Object.assign(new Pet(), element);
            pets.push(newPet);
        });
        return pets;
    }
}

class PetService {
    uniquePets = [];


    constructor(uniquePets) {
        this.uniquePets = uniquePets;
    }

    getRandomPet() {
        let randomIndex = Math.floor(Math.random() * this.uniquePets.length);
        return this.uniquePets[randomIndex];
    }

    getUniquePets(amount, blackList = []) {
        if (amount <= 0 || amount + blackList.length > this.uniquePets.length) {
            console.log("Wrong number of randomizing unique pets");
        }
        let uniqueList = [];
        for (let i = 0; i < amount; i++) {
            let petContestent;
            do {
                petContestent = this.getRandomPet();
            }
            while (blackList.includes(petContestent) || uniqueList.includes(petContestent))
            uniqueList.push(petContestent);
        }
        return uniqueList;
    }

    getUniquePetPages(petAmount, pagePetAmount) {
        let petPages = [];
        let prioritizedPets = [];
        let pageNumber = Math.ceil(petAmount / pagePetAmount);

        for (let i = 0; i < pageNumber; i++) {
            let pageCreator = this.createNewPage(pagePetAmount, prioritizedPets);
            petPages.push(pageCreator.pagePets);
            prioritizedPets = pageCreator.newPrioritizedPets;
        }
        return petPages;
    }

    createNewPage(petAmount, prioritizedPets = []) {
        let pagePets = prioritizedPets;
        if (pagePets.length == petAmount) {
            prioritizedPets = [];
        } else {
            prioritizedPets = [...this.uniquePets];
        }

        while (pagePets.length < petAmount) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * prioritizedPets.length);
            }
            while (pagePets.includes(prioritizedPets[randomIndex]))
            pagePets = pagePets.concat(prioritizedPets.splice(randomIndex, 1));
        }


        return {
            pagePets: this.shufflePets(pagePets),
            newPrioritizedPets: prioritizedPets
        };

    }

    shufflePets(pets = []) {
        let shuffledPets = [];
        for (let i = pets.length - 1; i >= 0; i--) {
            let randomIndex = Math.round(Math.random() * i);
            shuffledPets = shuffledPets.concat(pets.splice(randomIndex, 1));
        }
        return shuffledPets;
    }
}

class SliderPetProvider {
    petService;
    petAmount;
    currentPets = [];
    previousPets = [];

    constructor(petService, petAmount) {
        this.petService = petService;
        this.petAmount = petAmount;
        this.currentPets = petService.getUniquePets(this.petAmount);
    }

    chooseNextPets() {
        this.previousPets = this.currentPets;
        this.currentPets = this.petService.getUniquePets(this.petAmount, this.currentPets);
    }

    choosePreviousPets() {
        let buff = this.currentPets;
        this.currentPets = this.previousPets;
        this.previousPets = buff;
    }

    changePetAmount(newAmount) {
        this.petAmount = newAmount;
    }

    toString() {
        let currentPetsStr = '';
        this.currentPets.forEach(pet => { currentPetsStr += pet.info(true) + ' ' });
        let previousPetsStr = '';
        this.previousPets.forEach(pet => { previousPetsStr += pet.info(true) + ' ' });
        return "CURRENT PETS:\n" + currentPetsStr + "\nPREVIOUS PETS\n" + previousPetsStr;
    }

}

class PaginatorPetProvider {
    petService;
    pagePetAmount;
    petAmount;
    pets;

    constructor(petService, pagePetAmount, petAmount = 48) {
        this.petService = petService;
        this.petAmount = petAmount;
        this.changePetAmountPerPage(pagePetAmount);
    }

    changePetAmountPerPage(pagePetAmount) {
        this.pagePetAmount = pagePetAmount;
        this.updatePets();
    }

    updatePets() {
        this.pets = this.petService.getUniquePetPages(this.petAmount, this.pagePetAmount);
    }

    getPets(pageNum) {
        if (this.pets.length >= pageNum && pageNum >= 1) {
            return this.pets[pageNum - 1];
        }
    }

    getPageAmount() {
        return this.pets.length;
    }

    isLastPage(pageNum) {
        return this.pets.length == pageNum;
    }

    toString() {
        let petsStr = '';

        for (let i = 0; i < this.pets.length; i++) {
            petsStr += "PAGE NUM" + i + '\n';
            for (let j = 0; j < this.pets[i].length; j++) {
                petsStr += this.pets[i][j].name + ' ';
            }
            petsStr += '\n';
        }

        return petsStr;
    }
}