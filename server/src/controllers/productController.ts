import { Request, Response } from 'express';
import { Product, IProduct } from '../models/Product';

// Sample Indian products for initial data
const sampleProducts: Partial<IProduct>[] = [
  {
    name: "Tata Premium Tea",
    description: "Premium quality Assam tea leaves",
    category: "Beverages",
    price: 245,
    mrp: 275,
    gst: 5,
    hsn: "0902",
    unit: "500g",
    brand: "Tata Tea",
    manufacturer: "Tata Consumer Products",
    origin: "Assam, India",
    tags: ["tea", "beverages", "daily essentials"],
    icon: "coffee",
    status: "active",
    stockAvailable: 150
  },
  {
    name: "Ashirvaad Atta",
    description: "Superior quality whole wheat flour",
    category: "Groceries",
    price: 355,
    mrp: 375,
    gst: 5,
    hsn: "1101",
    unit: "5kg",
    brand: "Ashirvaad",
    manufacturer: "ITC Limited",
    origin: "Punjab, India",
    tags: ["atta", "wheat", "groceries"],
    icon: "grain",
    status: "active",
    stockAvailable: 200
  },
  {
    name: "Prestige Pressure Cooker",
    description: "Aluminum pressure cooker with safety features",
    category: "Kitchen Appliances",
    price: 1499,
    mrp: 1799,
    gst: 18,
    hsn: "7615",
    unit: "5L",
    brand: "Prestige",
    manufacturer: "TTK Prestige",
    origin: "Karnataka, India",
    tags: ["kitchen", "appliances", "cookware"],
    icon: "cooking",
    status: "active",
    stockAvailable: 45
  }
];

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Error adding product", error });
  }
};

export const initializeSampleProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Sample products initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing sample products:', error);
  }
}; 