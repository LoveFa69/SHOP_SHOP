import { makeAutoObservable } from "mobx";
import { toggleFavorite, fetchFavorites } from '../http/favoritesAPI';
import { toast } from 'react-toastify';

class FavoritesStore {
    favoriteIds = new Set();
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setFavorites(products) {
        const ids = products.map(p => p.id);
        this.favoriteIds = new Set(ids);
    }

    clearFavorites() {
        this.favoriteIds.clear();
    }

    async fetchFavoritesAction() {
        this.isLoading = true;
        try {
            const data = await fetchFavorites();
            this.setFavorites(data);
        } catch (e) {
            console.error("Не удалось загрузить избранное", e);
            // При ошибке (например, 401), очищаем локальные данные
            this.clearFavorites();
        } finally {
            this.isLoading = false;
        }
    }

    async toggleFavoriteAction(productId) {
        try {
            const response = await toggleFavorite(productId);
            // Оптимистичное обновление UI
            if (this.favoriteIds.has(productId)) {
                this.favoriteIds.delete(productId);
            } else {
                this.favoriteIds.add(productId);
            }
            // Обновляем mobx set
            this.favoriteIds = new Set(this.favoriteIds);
            toast.info(response.message);
        } catch (e) {
            toast.error("Ошибка. Попробуйте снова.");
        }
    }

    isFavorite(productId) {
        return this.favoriteIds.has(productId);
    }
}

export default new FavoritesStore();