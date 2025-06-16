import { makeAutoObservable, reaction } from "mobx";

class BasketStore {
    items = [];

    constructor() {
        makeAutoObservable(this);
        const savedCart = localStorage.getItem('basket');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        reaction(
            () => this.items,
            (items) => localStorage.setItem('basket', JSON.stringify(items)),
            { fireImmediately: true }
        );
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
    }

    updateQuantity(id, newQuantity) {
        if (newQuantity < 1) {
            this.removeItem(id);
            return;
        }
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    
    clearBasket() {
        this.items = [];
    }

    get total() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    }

    get totalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
}

// Экспортируем один экземпляр класса
const basketStore = new BasketStore();
export default basketStore;