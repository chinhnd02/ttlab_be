import { BaseController } from "../../../common/base/base.controller";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductService } from "../service/product.service";
import { ApiResponseError, ApiResponseSuccess, SwaggerApiType } from "../../../common/services/swagger.service";
import { createProductSuccessResponseExample, deleteProductSuccessResponseExample, getProductDetailSuccessResponseExample, getProductListSuccessResponseExample, updateProductSuccessResponseExample } from "../product.swagger";
import { CreateProductDto, GetProductListQuery, UpdateProductDto } from "../product.interface";
import { TrimBodyPipe } from "../../../common/pipe/trim.body.pipe";
import { JoiValidationPipe } from "../../../common/pipe/joi.validation.pipe";
import { ErrorResponse, SuccessResponse } from "../../../common/helpers/response";
import { HttpStatus, mongoIdSchema } from "../../../common/constants";
import { toObjectId } from "../../../common/helpers/commonFunctions";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { CloudinaryService } from "../../../modules/cloudinary/cloudinary.service";
import { AuthGuard } from "../../../guard/auth.guard";
import { RolesGuard } from "../../../guard/roles.guard";
// import { CloudinaryService } from "../../../modules/cloudinary/cloudinary.service";

@ApiTags('Product APIs')
@Controller('product')
export class ProductController extends BaseController {
    constructor(
        private readonly productService: ProductService,
        private readonly cloudinaryService: CloudinaryService
    ) {
        super();
    }

    @ApiOperation({ summary: 'Create Product' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(createProductSuccessResponseExample)
    @ApiBody({ type: CreateProductDto })
    @UseInterceptors(FileInterceptor('image'))
    @Post()
    async createProduct(
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CreateProductDto,
        @UploadedFile() image,
    ) {
        try {
            // image.filename
            if (image != null) {
                // const url = ;
                dto.image = await this.cloudinaryService.uploadImage(image);
                // dto.image = await this.cloudinaryService.uploadImage(file)
                // dto.image = this.productService.convertImageToBase64(image.path)
                // console.log(image);
            }

            const result = await this.productService.createProduct(dto);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }

    }

    @ApiOperation({ summary: 'Update Product by id' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(updateProductSuccessResponseExample)
    @ApiBody({ type: UpdateProductDto })
    @UseInterceptors(FileInterceptor('image'))
    @Patch(':id')
    async updateProduct(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: UpdateProductDto,
        @UploadedFile() image,
    ) {
        // console.log(dto);

        try {
            const product = await this.productService.findProductById(toObjectId(id));


            if (!product) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('product.error.notFound', {
                        args: {
                            id,
                        }
                    })
                )
            }
            if (image != null) {
                if (product.image !== '') {
                    this.cloudinaryService.deleteImageByUrl(product.image)
                }
            }
            image != null ? dto.image = await this.cloudinaryService.uploadImage(image) : dto.image = product.image

            const result = await this.productService.updateProduct(
                toObjectId(id),
                dto,
            );
            return new SuccessResponse(result);
        }
        catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Delete Product by id' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(deleteProductSuccessResponseExample)
    @Delete(':id')
    async deleteProduct(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const product = await this.productService.findProductById(toObjectId(id));

            if (!product) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('product.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }

            const result = await this.productService.deleteProduct(toObjectId(id));
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get Product detail by id' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getProductDetailSuccessResponseExample)
    @Get(':id')
    async getUserDetail(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const result = await this.productService.findProductById(toObjectId(id));

            if (!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('product.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get Product list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getProductListSuccessResponseExample)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    async getProductList(
        @Query()
        query: GetProductListQuery,
    ) {
        try {
            const result = await this.productService.findAllAndCountProductByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error)
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            // destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix);
            },
        }),
    }))
    uploadFile(@UploadedFile() file) {
        console.log(file);
        // Handle the uploaded file here
        return { filename: file.filename };
    }








}