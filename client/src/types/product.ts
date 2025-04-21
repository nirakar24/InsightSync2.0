export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  gst: number;
  hsn: string;
  status: 'active' | 'inactive' | 'out-of-stock';
  icon: string;
  trend: number;
  stockAvailable: number;
  needsRestock: boolean;
  popularity: number;
  unit: string;
  brand: string;
  manufacturer: string;
  origin: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  gst: number;
  hsn: string;
  unit: string;
  brand: string;
  manufacturer: string;
  origin: string;
  tags: string[];
  icon?: string;
}

export const indianCategories = [
  "Groceries",
  "Beverages",
  "Personal Care",
  "Home Care",
  "Kitchen Appliances",
  "Electronics",
  "Fashion",
  "Stationery",
  "Health & Wellness",
  "Baby Care",
  "Pet Supplies",
  "Sports & Fitness"
] as const;

export const indianUnits = [
  "kg",
  "g",
  "L",
  "ml",
  "pieces",
  "pack",
  "dozen",
  "box",
  "bundle",
  "pair"
] as const;

export const formatIndianPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}; 