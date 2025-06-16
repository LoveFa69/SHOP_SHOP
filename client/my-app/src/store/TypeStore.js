import { makeAutoObservable } from 'mobx';
import { createType, fetchTypes } from '../http/productAPI';

export default class TypeStore {
  constructor() {
    this._types = []; // Всегда инициализируем массив
    this._loading = false;
    this._error = null;
    makeAutoObservable(this);
  }

  async createType(name) {
    try {
      this._loading = true;
      const type = await createType({ name });
      this._types.push(type);
      return type;
    } catch (e) {
      this._error = e.response?.data?.message || e.message;
      throw e;
    } finally {
      this._loading = false;
    }
  }

  async fetchTypes() {
    try {
      this._loading = true;
      const types = await fetchTypes();
      this._types = types || []; // Гарантируем, что будет массив
    } catch (e) {
      this._error = e.message;
      this._types = []; // При ошибке сбрасываем к пустому массиву
    } finally {
      this._loading = false;
    }
  }

  get types() {
    return this._types || []; // Дублируем защиту на уровне геттера
  }

  get isLoading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }
}