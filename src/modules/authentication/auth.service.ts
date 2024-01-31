import { Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SuccessResponse } from '@/common/helpers/response';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pw: string): Promise<any> {
        const user = await this.userService.findOne(email);
        // const isMatch = await bcrypt.compare(pw, user.pass);
        if (user?.password !== pw) {
            throw new UnauthorizedException();
        }
        // if (isMatch) {

        // }
        const payload = {
            sub: user._id,
            name: user.name,
            email: user.email
        }
        // console.log(isMatch);

        return {
            accessToken: await this.jwtService.signAsync(payload),
        }
        // return SuccessResponse()

    }

}