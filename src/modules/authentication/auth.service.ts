import { Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../../common/constants'
import { ExceptionHandler } from 'winston';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pw: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (!user) {
            return null;
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('Email không tồn tại');

        }

        if (user?.password !== pw) {

            throw new UnauthorizedException('Login Failure!');
        }
        const payload = {
            sub: user._id,
            name: user.name,
            email: user.email,
        }

        const access_token = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.expiresIn
        })
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.refresh_expiresIn
        })
        const expiresIn = jwtConstants.expiresIn

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
            const refresh = await this.jwtService.verify(token, {
                secret: jwtConstants.secret,
            });
            const new_token = await this.jwtService.signAsync(
                refresh, {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.expiresIn,
            }
            )
            const refresh_token = await this.jwtService.signAsync(
                refresh, {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.refresh_expiresIn
            }
            )
            return {
                accessToken: {
                    token: new_token,
                    expriesIn: jwtConstants.expiresIn
                },
                refreshToken: {
                    token: refresh_token,
                    expriesIn: jwtConstants.refresh_expiresIn
                }
            }
        } catch (e) {
            throw new UnauthorizedException('Dang nhap lai')
        }
    }

}