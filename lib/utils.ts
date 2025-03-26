import { Colors } from "../theme/colors";

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
}