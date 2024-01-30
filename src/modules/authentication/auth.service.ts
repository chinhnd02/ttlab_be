import { Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pw: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (user?.pass !== pw) {
            throw new UnauthorizedException();
        }
        // const { pass, ...result } = user;
        const payload = {
            sub: user._id,
            name: user.name,
            email: user.email
        }
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }

}