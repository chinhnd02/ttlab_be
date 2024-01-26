import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '120s' },
        }),

    ],
    providers: [
        AuthService,
        // {
        //     provide: APP_GUARD,
        //     useClass: AuthGuard
        // }

    ],
    controllers: [AuthController],
    exports: [AuthService]

})
export class AuthModule { }