import React, { createContext, useContext, useState, useEffect } from "react";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  date: string; // YYYY-MM-DD format
}

interface MenuContextType {
  items: MenuItem[];
  addItem: (item: Omit<MenuItem, "id">) => void;
  updateItem: (id: string, item: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  getItemsByDate: (date: string) => MenuItem[];
  getItemsByCategory: (category: string) => MenuItem[];
  getAllCategories: () => string[];
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const SAMPLE_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Pan-Seared Duck Breast",
    description:
      "Crispy skin with tender, medium-rare meat served with cherry gastrique and root vegetables",
    price: 45,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    name: "Grilled Seabass",
    description:
      "Fresh Mediterranean seabass with lemon butter, seasonal asparagus, and fingerling potatoes",
    price: 42,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "3",
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with black truffle, parmesan, and sage",
    price: 38,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1579631541615-969e12a19b9d?w=400&h=300&fit=crop",
    isVegan: true,
    isGlutenFree: true,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "4",
    name: "Burrata & Heirloom Tomato",
    description:
      "Fresh burrata cheese with colorful heirloom tomatoes, basil oil, and aged balsamic",
    price: 18,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    isVegan: true,
    isGlutenFree: true,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "5",
    name: "Foie Gras Terrine",
    description: "Silky foie gras with brioche toast and fig compote",
    price: 28,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1605662668310-f22d4e72af19?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "6",
    name: "Chocolate Lava Cake",
    description:
      "Warm dark chocolate cake with molten center, served with vanilla ice cream",
    price: 15,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "7",
    name: "Vegan Tiramisu",
    description:
      "Layered vegan tiramisu with coconut mascarpone and espresso-soaked ladyfingers",
    price: 14,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop",
    isVegan: true,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "8",
    name: "Panna Cotta",
    description: "Silky vanilla panna cotta topped with berry compote",
    price: 12,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1488477181946-6558a6b037e3?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
];

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<MenuItem[]>(SAMPLE_ITEMS);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem("christoffel_menu_items");
    const savedFavorites = localStorage.getItem("christoffel_favorites");

    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch {
        // Keep default items
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch {
        // Keep empty favorites
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("christoffel_menu_items", JSON.stringify(items));
  }, [items]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("christoffel_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setFavorites(favorites.filter((fav) => fav !== id));
  };

  const getItemsByDate = (date: string) => {
    return items.filter((item) => item.date === date);
  };

  const getItemsByCategory = (category: string) => {
    return items.filter((item) => item.category === category);
  };

  const getAllCategories = () => {
    const categories = [...new Set(items.map((item) => item.category))];
    return categories.sort();
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => {
    return favorites.includes(itemId);
  };

  return (
    <MenuContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        getItemsByDate,
        getItemsByCategory,
        getAllCategories,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return context;
};
