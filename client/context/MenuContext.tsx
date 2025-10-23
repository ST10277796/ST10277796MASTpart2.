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
    name: "Classic Cheeseburger",
    description:
      "Juicy beef patty with melted cheddar, lettuce, tomato, pickles, and special sauce on a toasted bun",
    price: 185,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    name: "Grilled Ribeye Steak",
    description:
      "12oz premium ribeye steak with garlic butter, served with mashed potatoes and grilled vegetables",
    price: 385,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "3",
    name: "Southern Fried Chicken",
    description:
      "Crispy, golden-fried chicken pieces with buttermilk batter, served with coleslaw and cornbread",
    price: 235,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cda1ec?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "4",
    name: "BBQ Pulled Pork Sandwich",
    description:
      "Slow-cooked pulled pork smothered in smoky BBQ sauce, served on a brioche bun with pickles",
    price: 195,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "5",
    name: "Buffalo Wings",
    description:
      "Spicy buffalo sauce coated chicken wings served with celery, carrots, and blue cheese dip",
    price: 155,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1585518419759-5b5edd65538d?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: true,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "6",
    name: "Loaded Nachos",
    description:
      "Crispy tortilla chips piled with seasoned beef, melted cheese, jalapeños, sour cream, and salsa",
    price: 165,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1599599810741-a63ce3b0f75b?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "7",
    name: "Mac & Cheese",
    description:
      "Creamy three-cheese macaroni pasta with breadcrumb topping, baked until golden",
    price: 145,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "8",
    name: "New England Clam Chowder",
    description:
      "Creamy chowder loaded with tender clams, potatoes, and celery, served with oyster crackers",
    price: 135,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1547592166-7aae4d755744?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "9",
    name: "New York Cheesecake",
    description:
      "Rich and creamy cheesecake with a graham cracker crust, topped with fresh berries",
    price: 125,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1610312513545-c56a2b8c35af?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "10",
    name: "Apple Pie à la Mode",
    description:
      "Classic American apple pie with warm spiced apples and a flaky crust, served with vanilla ice cream",
    price: 115,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1599599810694-2202dbf0db0d?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "11",
    name: "Chocolate Fudge Brownies",
    description:
      "Dense, fudgy chocolate brownies served warm with a scoop of vanilla ice cream",
    price: 95,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "12",
    name: "Classic Chocolate Chip Cookies",
    description:
      "Warm, buttery chocolate chip cookies with melting chocolate chunks, perfect with cold milk",
    price: 55,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    isVegan: false,
    isGlutenFree: false,
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
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
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
        : [...prev, itemId],
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
