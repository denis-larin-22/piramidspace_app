import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveDataToAcyncStorage(key: string, data: string) {
    try {
        await AsyncStorage.setItem(key, data);
        console.log('Data saved!');
    } catch (e) {
        console.error('Error saving data', e);
    }
};

export async function getDataFromAcyncStorage(key: string) {
    try {
        const data = await AsyncStorage.getItem(key);
        if (data !== null) {
            console.log('Data received!');
            return data;
        } else {
            console.log(`Storage is empty by "${key}" key`);
        }
    } catch (e) {
        console.error('Error reading data', e);
    }
};

export async function removeData(key: string) {
    try {
        await AsyncStorage.removeItem(key);
        console.log('Data removed');
    } catch (e) {
        console.error('Error removing data', e);
    }
};
