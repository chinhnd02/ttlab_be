import { Body, Controller, HttpStatus, Post, HttpCode, UseGuards, Get, Request, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "../../guard/auth.guard";
import { Roles } from "../../roles/roles.decorator";
import { Role } from "../../roles/role.enum";
import { RolesGuard } from "../../guard/roles.guard";
import * as bcrypt from 'bcrypt';
import { User } from "@/database/schemas/user.schema";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @UseGuards(AuthGuard, RolesGuard)
    // @Roles(Role.Admin)
    @Get('profile')
    async getProfile(@Request() req) {
        return req.user
    }

    // @Post('refresh-token')
    // async refreshToken(@Body() refreshToken: string) {
    //     // console.log(signInDto.refreshToken);

    //     return this.authService.refreshToken(refreshToken)
    // }

    // @Post('refresh')
    // async refresh(@Body() body: any) {
    //     return this.authService.refreshToken(body.refresh_token)
    // }


    @Post('refresh')
    async sendRefreshToken(@Body() body: any) {
        try {
            const decodedToken = await this.authService.verifyToken(body.refresh_token);
            if (decodedToken) {
                const newRefreshToken = await this.authService.refreshToken(body.refresh_token);
                return newRefreshToken;
            } else {
                throw new UnauthorizedException('Invalid refresh token');
            }
        } catch (error) {
            console.log(error);
            ;
        }
    }
}