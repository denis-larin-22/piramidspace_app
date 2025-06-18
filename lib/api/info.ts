import { BASE_URL } from "./base-url";

// Get the current exchange rate (dollars)
// !!!!!!!!  THERE IS CYRILLIC IN THE BACKEND ANSWER - result object !!!!!!!
interface IRateObject {
    дата: string,
    наименование: string,
    "курс, грн.": string
}

export async function getExchangeDollarRate() {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/getCourse`);
        if (!response.ok) {
            throw new Error(`Exchange Dollar ERROR! HTTP error! status: ${response.status} `);
        }
        const rateObject = await response.json() as IRateObject; // IMPORTANT ↓↓↓↓
        // ↓↓↓ THE OBJECT HAS THE APPROACH ↓↓↓
        // { "дата": "2025-05-15",
        //   "наименование": "доллар",
        //   "курс, грн.": "41.60"
        // }
        return rateObject["курс, грн."]
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Get the balance by login
// !!!!!!!!  THERE IS CYRILLIC IN THE BACKEND ANSWER - result object !!!!!!!
interface IBalanceObject {
    логин: string,
    "баланс, дол.": number
}

export async function getBalanceByLogin(login: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/getBalance?login=${login}`);
        if (!response.ok) {
            throw new Error(`Get Balance ERROR! HTTP error! status: ${response.status} `);
        }
        const balanceObject = await response.json() as IBalanceObject; // IMPORTANT ↓↓↓↓
        // ↓↓↓ THE OBJECT HAS THE APPROACH ↓↓↓
        // {
        //   "логин": "test@test",
        //   "баланс, дол.": -115.93
        // }
        return balanceObject["баланс, дол."];
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}