import { INPUT_TEXT_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { UserOrderBy } from './user.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { CommonListQuery } from '../../common/interfaces';
import { IsEmail, MinLength } from 'class-validator';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();



export class CreateUserDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User name',
    })
    @JoiValidate(Joi.string().trim().min(10).max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        default: '123123'
    })
    @JoiValidate(Joi.string()
        .regex(/^\S*$/)
        .regex(/^[^\p{So}]+$/u)
        .trim().min(8).max(INPUT_TEXT_MAX_LENGTH)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
        .message('Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái in hoa và một số.')
        .required())
    password: string;


    @ApiProperty({
        type: String,
        default: 'user@gmail.com'
    })
    @IsEmail()
    @JoiValidate(Joi.string().email().message('Email không hợp lệ!').trim().max(INPUT_TEXT_MAX_LENGTH).required())
    email: string;

    @ApiProperty({
        type: Date,
        default: '2002-08-08'
    })
    @JoiValidate(Joi.date()
        .min(new Date('1900-01-01'))
        .max(new Date(`${currentYear}-${currentMonth}-${currentDay}`))
        .required())
    birthday: Date;

    @ApiProperty({
        type: Number,
        default: 0
    })
    @JoiValidate(Joi.number().positive().min(9).required())
    phone: number;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'avatar',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    avatar?: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'avatar',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    roles?: string;



}

export class UpdateUserDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        minLength: PASSWORD_MIN_LENGTH
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    password: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
    })
    @JoiValidate(Joi.string().email().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    email: string;

    @ApiProperty({
        type: Date,
    })
    @JoiValidate(Joi.date().required())
    birthday: Date

    @ApiProperty({
        type: Number,
    })
    @JoiValidate(Joi.number().required())
    phone: number;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'avatar',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    avatar?: string;
}

export class GetUserListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: UserOrderBy,
        description: 'Which field used to sort',
        default: UserOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(UserOrderBy))
            .optional(),
    )
    orderBy?: UserOrderBy;


    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    name?: string;

    @ApiProperty({
        type: String,
        minLength: PASSWORD_MIN_LENGTH
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    password?: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    email?: string;

    @ApiProperty({
        type: Date,
    })
    @JoiValidate(Joi.date().optional())
    birthday?: Date

    @ApiProperty({
        type: Number,
    })
    @JoiValidate(Joi.number().optional())
    phone?: number;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'avatar',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    avatar?: string;
}
