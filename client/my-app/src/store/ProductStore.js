import { makeAutoObservable } from "mobx";
import { fetchProducts, fetchTypes, fetchSpecialProducts } from '../http/productAPI';

export default class ProductStore {
    _types = [];
    _products = [];
    _specialProducts = []; // Состояние для спецпредложений
    _selectedType = {};
    _page = 1;
    _totalCount = 0;
    _limit = 12;
    _loading = false;
    _error = null;
    _searchQuery = '';

    constructor() {
        makeAutoObservable(this);
    }

    // Actions
    setTypes(types) { this._types = types; }
    setProducts(products) { this._products = products; }
    setSpecialProducts(products) { this._specialProducts = products; }
    setSelectedType(type) { this.setPage(1); this._selectedType = type; }
    setPage(page) { this._page = page; }
    setTotalCount(count) { this._totalCount = count; }
    setLoading(loading) { this._loading = loading; }
    setError(error) { this._error = error; }
    setSearchQuery(query) { this.setPage(1); this._searchQuery = query; }

    // Async Actions
    async fetchTypesAction() {
        try {
            const data = await fetchTypes();
            this.setTypes(data);
        } catch (e) {
            console.error('Ошибка загрузки типов', e);
        }
    }

    async fetchProductsAction() {
        this.setLoading(true);
        try {
            const data = await fetchProducts(this._selectedType.id, this._page, this._limit, this._searchQuery);
            this.setProducts(data.rows);
            this.setTotalCount(data.count);
        } catch (e) {
            this.setError('Ошибка загрузки товаров');
        } finally {
            this.setLoading(false);
        }
    }

    async fetchSpecialProductsAction() {
        try {
            const data = await fetchSpecialProducts();
            this.setSpecialProducts(data);
        } catch (e) {
            console.error('Ошибка загрузки спецпредложений', e);
        }
    }

    // Getters
    get types() { return this._types; }
    get products() { return this._products; }
    get specialProducts() { return this._specialProducts; }
    get selectedType() { return this._selectedType; }
    get totalCount() { return this._totalCount; }
    get page() { return this._page; }
    get limit() { return this._limit; }
    get isLoading() { return this._loading; }
    get error() { return this._error; }
    get searchQuery() { return this._searchQuery; }
}