import { Product } from "../../database/schemas/product.schema";

export enum ProductOrderBy {
    ID = 'id',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updatedAt',
}

// export const ProductAttributesForList: (keyof Product)[] = [
//     '_id',
//     'id',
//     'name',
//     'price',
//     'quantity',
//     'description',
//     'image',
//     'createdAt',
//     'updatedAt',

// ];
export const ProductAttributesForList: (keyof Product)[] = [
    '_id',
    'id',
    'name',
    'price',
    'quantity',
    'description',
    'image',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'deletedAt',
    'deletedBy'
];

export const ProductAttributesForDetail: (keyof Product)[] = ['_id',
    'id',
    'name',
    'price',
    'quantity',
    'description',
    'image',
    'createdAt',
    'updatedAt',]