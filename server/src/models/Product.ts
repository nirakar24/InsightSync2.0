import { Schema, model } from 'mongoose';

export interface IProduct {
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
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  gst: { type: Number, required: true },
  hsn: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out-of-stock'],
    default: 'active'
  },
  icon: { type: String, default: 'inventory_2' },
  trend: { type: Number, default: 0 },
  stockAvailable: { type: Number, default: 0 },
  needsRestock: { type: Boolean, default: false },
  popularity: { type: Number, default: 0 },
  unit: { type: String, required: true },
  brand: { type: String, required: true },
  manufacturer: { type: String, required: true },
  origin: { type: String, required: true },
  tags: [{ type: String }]
}, {
  timestamps: true
});

export const Product = model<IProduct>('Product', productSchema); 