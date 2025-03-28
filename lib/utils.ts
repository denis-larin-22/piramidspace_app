import { Colors } from "../theme/colors";
import { BASE_URL } from "./api";

export function getAvailabilityTextColor(availabilityValue: string) {
    const value = availabilityValue.toLowerCase();

    return value === "в наявності" ?
        Colors.green
        :
        value === "немає" ?
            Colors.red
            :
            Colors.orange
};

export function formatToLowerCase(word: string) {
    return word.split('').map((letter) => {
        return letter.toLowerCase();
    }).join('');
}

// Correct declension of words in countdown timer
export type TimeWords = "дні" | "години" | "хвилини" | "секунди";

const timeDeclensions = {
    "дні": ["день", "дні", "днів"],
    "години": ["година", "години", "годин"],
    "хвилини": ["хвилина", "хвилини", "хвилин"],
    "секунди": ["секунда", "секунди", "секунд"]
};

export function getCorrectTimeDeclension(numberValue: number, word: TimeWords): string {
    const declinationNumberOne = numberValue % 10;
    const declinationNumberTwo = numberValue % 100;

    if (declinationNumberTwo >= 11 && declinationNumberTwo <= 19) {
        return timeDeclensions[word][2]; // "днів", "годин", "хвилин", "секунд"
    } else if (declinationNumberOne === 1) {
        return timeDeclensions[word][0]; // "день", "година", "хвилина", "секунда"
    } else if (declinationNumberOne >= 2 && declinationNumberOne <= 4) {
        return timeDeclensions[word][1]; // "дні", "години", "хвилини", "секунди"
    } else {
        return timeDeclensions[word][2]; // "днів", "годин", "хвилин", "секунд"
    }
};

// Formats url-link of the image coming from the request
export function formatImagePathFromApi(receivedPath: string): string {
    return `${BASE_URL}/storage/${receivedPath}`
};

export function getStringFromNumber(value: number) {
    return (Math.floor(value)).toString()
};

// Make to uppercase first letter
export function capitalizeFirstLetter(word: string | null): string | null {
    // Check if the word is not null and not empty
    if (word === null || word.length === 0) {
        return null; // Empty string if input value is null or empty
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getAvailabilityStatus(availabilityValue: string) {
    let resultValue = availabilityValue;

    switch (availabilityValue) {
        case "In Stock":
            resultValue = "В наявності";
            break;
        case "Low Stock":
            resultValue = "Закінчується";
            break;
        case "Out of Stock":
            resultValue = "Немає";
            break;
        case "Discontinued":
            resultValue = "Виробництво припинено";
            break;
    }

    return resultValue;
};

// Correct declension of words in category details in the main menu of the catalog
export type DetailsWords = "пропозицій" | "кольорів" | "колекцій";

const declensions = {
    "пропозицій": ["пропозиція", "пропозиції", "пропозицій"],
    "кольорів": ["колір", "кольори", "кольорів"],
    "колекцій": ["колекція", "колекції", "колекцій"]
};

export function getCorrectWordDeclension(numberValue: number, word: DetailsWords): string {
    const declinationNumberOne = numberValue % 10;
    const declinationNumberTwo = numberValue % 100;

    if (declinationNumberTwo >= 11 && declinationNumberTwo <= 19) {
        return declensions[word][2]; // "пропозицій", "кольорів", "колекцій"
    } else if (declinationNumberOne === 1) {
        return declensions[word][0]; // "пропозиція", "колір", "колекція"
    } else if (declinationNumberOne >= 2 && declinationNumberOne <= 4) {
        return declensions[word][1]; // "пропозиції", "кольори", "колекції"
    } else {
        return declensions[word][2]; // "пропозицій", "кольорів", "колекцій"
    }
}