import { Document } from 'mongoose';
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
export declare const Food: import("mongoose").Model<IFood, {}, {}, {}, Document<unknown, {}, IFood, {}, import("mongoose").DefaultSchemaOptions> & IFood & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IFood>;
//# sourceMappingURL=Food.d.ts.map