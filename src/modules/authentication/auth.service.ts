import { Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../../common/constants'
import { ExceptionHandler } from 'winston';
import { User } from '../../database/schemas/user.schema';
import { parseDate } from '@/plugins/dayjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pw: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (!user.email) {
            throw new UnauthorizedException('Sai Email')
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('Tài khoản đã bị xóa');

        }

        // if (user?.password !== pw) {

        //     throw new UnauthorizedException('Sai password');
        // }

        const matchPassword = await bcrypt.compare(pw, user.password)
        if (!matchPassword) {
            console.log(pw);
            console.log(user.password);
            console.log(matchPassword);
            throw new UnauthorizedException('Sai Password');
        }


        const payload = {
            sub: user._id,
            name: user.name,
            email: user.email,
            role: user.roles
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
        const refresh_expiresIn = jwtConstants.refresh_expiresIn
        const role = user.roles
        const avatar = user.avatar

        // return {
        //     accessToken: await this.jwtService.signAsync(payload),
        // }
        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expiresIn,
            refreshExpiresIn: refresh_expiresIn,
            role: role,
            avatar: avatar
        }

    }

    async refreshToken(token) {
        try {

            const { sub, name, email, role } = await this.jwtService.verify(token, {
                secret: jwtConstants.secret
            })

            const payload = {
                sub, name, email, role
            };

            const newAccessToken = await this.jwtService.signAsync(payload, {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.expiresIn,
            });

            const newRefreshToken = await this.jwtService.signAsync(payload, {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.refresh_expiresIn
            })
            const expiresIn = jwtConstants.expiresIn
            const refresh_expiresIn = jwtConstants.refresh_expiresIn
            return {
                newAccessToken: newAccessToken,
                newRefreshToken: newRefreshToken,
                expiresIn: expiresIn,
                refreshExpiresIn: refresh_expiresIn,
            }
        } catch (e) {
            throw new UnauthorizedException('Dang nhap lai')
        }


    }

    async verifyToken(token: string) {
        try {
            return await jwt.verify(token, jwtConstants.secret);
        } catch (error) {
            return null;
        }
    }


    // async refreshToken(refreshtoken) {
    //     try {
    //         const { data } = await this.jwtService.verify(refreshtoken, {
    //             secret: jwtConstants.secret,
    //         });
    //         const access_token = await this.jwtService.signAsync(
    //             { data },
    //             {
    //                 secret: jwtConstants.secret,
    //                 expiresIn: jwtConstants.expiresIn,
    //             },
    //         );
    //         const refresh_token = await this.jwtService.signAsync(
    //             { data },
    //             {
    //                 secret: jwtConstants.secret,
    //                 expiresIn: jwtConstants.refresh_expiresIn,
    //             },
    //         );
    //         return {
    //             data: {
    //                 accessToken: access_token,
    //                 expiresIn: jwtConstants.expiresIn,
    //                 refresh_token: refresh_token,
    //                 refresh_expiresIn: jwtConstants.refresh_expiresIn,
    //                 profile: {
    //                     role: data.role,
    //                 }
    //             }
    //         }
    //     } catch (e) {
    //         throw new UnauthorizedException("Hết phiên đăng nhập. vui lòng đăng nhập lại");
    //     }
    // }

}