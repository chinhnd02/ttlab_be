import { Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../../common/constants'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pw: string): Promise<any> {
        const user = await this.userService.findOne(email);
        // const isMatch = await bcrypt.compare(pw, user.pass);
        if (!user) {
            return null;
        }


        if (user?.password !== pw) {
            throw new UnauthorizedException('Login Failure!');
        }

        const payload = {
            sub: user._id,
            name: user.name,
            email: user.email,
        }

        const access_token = await this.jwtService.signAsync(payload)
        const refresh_token = await this.jwtService.signAsync(payload)
        const expiresIn = await this.jwtService.signAsync(payload, {
            expiresIn: jwtConstants.expiresIn
        })

        // return {
        //     accessToken: await this.jwtService.signAsync(payload),
        // }
        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expiresIn
        }

    }

    async refreshToken(token) {
        try {
            const tk = await this.jwtService.verify(token, {
                secret: jwtConstants.secret,
            });
            const access_token = await this.jwtService.signAsync(tk, {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.expiresIn
            })
            return {
                access_token: access_token,
                expiresIn: jwtConstants.expiresIn,
            }
        }

        catch (error) {
            throw new UnauthorizedException("Login Again")
        }
    }

}