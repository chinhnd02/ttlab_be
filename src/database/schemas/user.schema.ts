import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';
import { Role } from '../../roles/role.enum';
import { MinLength } from 'class-validator';
export type UserDocument = SchemaDocument<User>;
@Schema({
    timestamps: true,
    collection: MongoCollection.USERS,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class User extends MongoBaseSchema {
    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: true, type: String, unique: true })
    email: string;
    @Prop({ required: false, default: null, type: Date })
    birthday: Date;
    @Prop({ required: true, type: Number })
    phone: number;
    @Prop({ required: false, type: String })
    avatar: string;

    @Prop({ type: String })
    roles: string;


}

const UserSchema = createSchemaForClass(User);

export { UserSchema };
