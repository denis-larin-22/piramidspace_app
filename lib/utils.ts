import { Colors } from "../theme/colors";
import { BASE_URL } from "./api/base-url";
import { IAddressValuesNP, IAddressValuesPrivat } from "./api/orders-screen/address";

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

export function sortArray<T extends string | number>(arr: T[]): T[] {
    return arr.slice().sort((a, b) => {
        if (typeof a === "number" && typeof b === "number") {
            return a - b;
        }
        return String(a).localeCompare(String(b));
    });
}

export const getGreetingUA = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 10) {
        return 'Доброго ранку';
    } else if (hour >= 10 && hour < 17) {
        return 'Доброго дня';
    } else {
        return 'Доброго вечора';
    }
};

// Check input date from user in the SignUp screen
export function isValidDate(dateStr: string): boolean {
    // Поддержка дней и месяцев с 1 или 2 цифрами
    const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
    const match = dateStr.match(dateRegex);

    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const currentYear = new Date().getFullYear();

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year > currentYear) return false;

    // Проверка существования даты
    const dateObj = new Date(year, month - 1, day);
    if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
    ) {
        return false;
    }

    return true;
}

export function isValidPhoneNumber(phone: string): boolean {
    // valid options
    // +380XXXXXXXXX
    // 380XXXXXXXXX
    // 0XXXXXXXXX
    const cleanedPhone = phone.trim();
    const regex = /^(?:\+380|380|0)\d{9}$/;
    return regex.test(cleanedPhone);
}

export function formatPhoneNumberToInternational(phone: string): string {
    const cleanedPhone = phone.trim();

    if (cleanedPhone.startsWith('+380')) {
        return cleanedPhone;
    }

    if (cleanedPhone.startsWith('380')) {
        return `+${cleanedPhone}`;
    }

    // Если начинается с '0'
    return `+380${cleanedPhone.slice(1)}`;
}

// parse group code to cycilic
export function getFormatedOrderType(type: string) {
    if (type === null) return "-";

    switch (type.toLowerCase()) {
        case 'horizontal':
            return 'горизонтальні жалюзі';
        case 'vertical':
            return 'вертикальні жалюзі';
        case 'roler':
            return 'рулонні жалюзі';
        case 'components':
            return 'комплектуючі';
        case 'ads':
            return 'рекламна продукція';
        case 'day':
            return 'день-ніч';
        default:
            return type.toLowerCase();
    }
}

// getting order status\color
export function getFormatedStatus(status: string) {
    switch (status) {
        case 'удален':
            return { formatedStatus: 'видалений', color: '#A2A2A8' };
        case 'у виробництві':
            return { formatedStatus: 'у виробництві', color: '#b4ddb4' };
        case 'изготовлен':
            return { formatedStatus: 'виготовлені', color: '#FFA500' };
        case 'предварительный':
            return { formatedStatus: 'попередній', color: '#5ea1bc' };
        default:
            return { formatedStatus: status, color: '#FFFFFF' };
    }
}


// Addresses
export function formatAddressNP(addressObj: IAddressValuesNP): string {
    return (
        addressObj["доставка способ"] +
        ", " +
        addressObj["город"] +
        ", " +
        addressObj["отделение"]
    );
}

export function formatAddressPrivat(addressObj: IAddressValuesPrivat): string {
    return (
        addressObj["доставка способ"] +
        ", " +
        addressObj["город"] +
        ", " +
        addressObj["street_np"] +
        ", " +
        addressObj["houme_np"] +
        ", " +
        addressObj["appart_np"]
    );
}