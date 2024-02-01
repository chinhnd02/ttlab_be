import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Get,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from '../../../common/helpers/response';
import { HttpStatus, mongoIdSchema } from '../../../common/constants';
import {
    CreateUserDto,
    GetUserListQuery,
    UpdateUserDto,
} from '../user.interface';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '../../../common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

import {
    createUserSuccessResponseExample,
    deleteUserSuccessResponseExample,
    getUserDetailSuccessResponseExample,
    getUserListSuccessResponseExample,
    updateUserSuccessResponseExample,
} from '../user.swagger';
import { TrimBodyPipe } from '../../../common/pipe/trim.body.pipe';
import { toObjectId } from '../../../common/helpers/commonFunctions';
import { BaseController } from '../../../common/base/base.controller';
import { JoiValidationPipe } from '../../../common/pipe/joi.validation.pipe';
import { UserService } from '../services/user.service';
import { Roles } from '../../../roles/roles.decorator';
import { Role } from '../../../roles/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';



@ApiTags('User APIs')
@Controller('user')
export class UserController extends BaseController {
    constructor(private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService
    ) {
        super();
    }

    @ApiOperation({ summary: 'Create User' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(createUserSuccessResponseExample)
    @ApiBody({ type: CreateUserDto })
    @UseInterceptors(FileInterceptor('avatar'))
    @Post()
    async createUser(
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CreateUserDto,
        @UploadedFile() avatar,
    ) {
        try {
            // const saltOrRounds = 10;
            // const password = 'random_password';
            // dto.pass = await bcrypt.hash(password, saltOrRounds);

            const emailExists = await this.userService.findOne(dto.email)

            if (emailExists) {
                console.log('Email đã tồn tại');

                return false;
            }
            if (avatar != null) {
                dto.avatar = await this.cloudinaryService.uploadAvatar(avatar);
            }
            const result = await this.userService.createUser(dto);
            return new SuccessResponse(result);

        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Update User by id' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(updateUserSuccessResponseExample)
    @ApiBody({ type: UpdateUserDto })
    @Patch(':id')
    async updateUser(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: UpdateUserDto,
    ) {
        try {
            const user = await this.userService.findUserById(toObjectId(id));
            if (!user) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }

            const result = await this.userService.updateUser(
                toObjectId(id),
                dto,
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Delete User by id' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(deleteUserSuccessResponseExample)
    @Delete(':id')
    async deleteUser(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const user = await this.userService.findUserById(toObjectId(id));

            if (!user) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }

            const result = await this.userService.deleteUser(toObjectId(id));
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get User detail by id' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getUserDetailSuccessResponseExample)
    @Get(':id')
    async getUserDetail(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const result = await this.userService.findUserById(toObjectId(id));

            if (!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
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

    @ApiOperation({ summary: 'Get User list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getUserListSuccessResponseExample)
    @Roles(Role.Admin)
    @Get()
    async getUserList(
        @Query(new JoiValidationPipe())
        query: GetUserListQuery,
    ) {
        try {
            const result =
                await this.userService.findAllAndCountUserByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
