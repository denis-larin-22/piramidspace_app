import { BASE_URL } from "./base-url"

export interface IBanner {
    id: number,
    name: string,
    banner_url: string
}

export async function getBanners(): Promise<IBanner[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/jaluji/banners`);
        if (response.ok) {
            const bannersArray = await response.json() as IBanner[];
            return bannersArray;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};