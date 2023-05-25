import {Module} from '@nestjs/common';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {CommonModule, Role, User, UserRoles} from "@app/common";
import {AppService} from "./app.service";
import {AppFilmsController} from "./controllers/app_films.controller";
import {AppAwardsController} from "./controllers/app_awards.controller";
import {AppCountriesController} from "./controllers/app_countries.controller";
import {AppGenresController} from "./controllers/app_genres.controller";
import {AppPersonsController} from "./controllers/app_persons.controller";
import {AppAuthController} from "./controllers/app_auth.controller";
import {AppUsersController} from "./controllers/app_users.controller";
import {AppRolesController} from "./controllers/app_roles.controller";
import {VkStrategy} from "../utils/vkStrategy";
import {GoogleStrategy} from "../utils/googleStrategy";
import {SessionSerializer} from "../utils/sessionSerializer";
import {AppParseController} from "./controllers/app_parser.controller";
import {AppReviewController} from "./controllers/app_review.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigService} from "@nestjs/config";



@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: +configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get('POSTGRES_USER_DB'),
                models: [User, UserRoles, Role],
                autoLoadModels: true,
                synchronize: true
            }),

            inject: [ConfigService],
        }),
        SequelizeModule.forFeature([User]),
        PassportModule.register({session: true}),
        JwtModule.register({
            secret: process.env.JWT_SECRET || "SECRET",
            signOptions: {
                expiresIn: "24h"
            }
        }),
        PassportModule.register({session: true}),
        CommonModule.registerRmq({name: "USERS"}),
        CommonModule.registerRmq({name: "ROLES"}),
        CommonModule.registerRmq({name: "AUTH"}),
        CommonModule.registerRmq({name: "FILM"}),
        CommonModule.registerRmq({name: "COUNTRY"}),
        CommonModule.registerRmq({name: "AWARD"}),
        CommonModule.registerRmq({name: "GENRE"}),
        CommonModule.registerRmq({name: "PERSON"}),
        CommonModule.registerRmq({name: "REVIEW"}),
    ],
    controllers: [AppFilmsController, AppAwardsController, AppCountriesController, AppGenresController,
        AppPersonsController, AppParseController, AppAuthController, AppUsersController, AppRolesController,
        AppReviewController],
    providers: [AppService, VkStrategy, GoogleStrategy, SessionSerializer]
})
export class AppModule {
}
