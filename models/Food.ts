import { Schema, model, Document } from 'mongoose';

export type CategoryType = 'dumplings' | 'ramens' | 'pastries' | 'stew/soup' | 'fried' | 'cakes' | 'cookies' | 'buns' | 'drinks' | 'other';
export type FlavorType = 'sweet' | 'sour' | 'spicy' | 'salty' | 'tangy' | 'savory';

export interface IFood extends Document {
  product_name: string;
  product_price: number;
  product_description: string;
  img_url: string;
  category_id: CategoryType | string;
  flavor?: FlavorType;
  country_of_origin?: string;
  status: 'active' | 'draft' | 'archived' | 'deleted';
  is_featured?: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const foodSchema = new Schema<IFood>(
  {
    product_name: { type: String, required: true, trim: true },
    product_price: { type: Number, required: true, min: 0 },
    product_description: { type: String, required: true },
    img_url: { type: String, required: true },
    category_id: { 
      type: String, 
      required: true, 
      lowercase: true,
      trim: true 
    },
    flavor: { 
      type: String, 
      enum: ['sweet', 'sour', 'spicy', 'salty', 'tangy', 'savory'],
      lowercase: true,
      trim: true 
    },
    country_of_origin: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived', 'deleted'],
      default: 'active',
    },
    is_featured: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { 
    timestamps: true 
  }
);

// Indexes for super fast searching & filtering
foodSchema.index({ product_name: 'text', product_description: 'text' });
foodSchema.index({ category_id: 1, flavor: 1, country_of_origin: 1, product_price: 1 });

export const Food = model<IFood>('Food', foodSchema);