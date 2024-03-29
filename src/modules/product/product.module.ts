import { Product, ProductSchema } from "../../database/schemas/product.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./controller/product.controller";
import { ProductService } from "./service/product.service";
import { ProductRepository } from "./product.repository";
// import { MulterModule } from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },]),
        // MulterModule.register({
        //     dest: './uploads',
        // }),
    ],
    controllers: [ProductController],
    providers: [
        ProductService,
        ProductRepository,
        CloudinaryService
    ],
    exports: [ProductRepository]
})

export class ProductModule { }