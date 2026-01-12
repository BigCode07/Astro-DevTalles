export interface FavoritePokemon {
  name: string;
  url: string;
}

const FAVORITES_KEY = 'favorite-pokemons';

export class FavoritesManager {
  static getFavorites(): FavoritePokemon[] {
    if (typeof localStorage === 'undefined') return [];

    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  static isFavorite(name: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.name === name);
  }

  static addFavorite(pokemon: FavoritePokemon): void {
    const favorites = this.getFavorites();

    if (!this.isFavorite(pokemon.name)) {
      favorites.push(pokemon);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

      // Disparar evento personalizado para actualizar UI
      window.dispatchEvent(new CustomEvent('favoritesChanged', {
        detail: { favorites, action: 'add', pokemon }
      }));
    }
  }

  static removeFavorite(name: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(fav => fav.name !== name);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));

    // Disparar evento personalizado para actualizar UI
    window.dispatchEvent(new CustomEvent('favoritesChanged', {
      detail: { favorites: filtered, action: 'remove', name }
    }));
  }

  static toggleFavorite(pokemon: FavoritePokemon): boolean {
    if (this.isFavorite(pokemon.name)) {
      this.removeFavorite(pokemon.name);
      return false;
    } else {
      this.addFavorite(pokemon);
      return true;
    }
  }
}
