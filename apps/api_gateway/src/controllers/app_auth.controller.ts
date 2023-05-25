import {Body, Controller, Get, Inject, Post, Req, Res, UseGuards} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GoogleAuthGuard, LoginGuard, UserLoginDto, VkAuthGuard} from "@app/common";





@ApiTags("Авторизация пользователей")
@Controller("/auth")
export class AppAuthController {
    constructor(@Inject("AUTH") private readonly usersClient: ClientProxy) {};

    @ApiOperation({summary: `Авторизация через email и пароль. В ответ получаете jwt-token, который нужно 
    поместить в заголовки запроса ("Authorization: Bearer jwt-token)`})
    @ApiResponse({status: 200, type: String})
    @UseGuards(LoginGuard)
    @Post("/login")
    async login(@Body() userLoginDto: UserLoginDto, @Res({passthrough: true}) res) {
        return this.usersClient.send({
            cmd: "login"
        }, {
            userLoginDto
        });
    };

    @ApiOperation({summary: "Выход из профиля"})
    @ApiResponse({status: 200})
    @Get("/logout")
    async logout(@Req() req) {
        const headers = req.headers;

        return this.usersClient.send({
            cmd: "logout"
        }, {
            headers
        });
    }

    @ApiOperation({summary: "Авторизация через google(gmail) аккаунт"})
    @ApiResponse({status: 200, type: String})
    @UseGuards(GoogleAuthGuard)
    @Get("google/login")
    googleLogin() {
        return {
            msg: "Google auth - success"
        }
    };

    @ApiOperation({summary: "Авторизация через аккаунт vkontakte"})
    @UseGuards(VkAuthGuard)
    @Get("vk/login")
    vkLogin() {
        return {
            msg: "VK auth - success"
        }
    };

    @UseGuards(GoogleAuthGuard)
    @Get("google/redirect")
    googleRedirect() {
        return {
            msg: "Google auth - success"
        }
    };

    @UseGuards(VkAuthGuard)
    @Get("vk/redirect")
    vkRedirect() {
        return {
            msg: "VK auth - success"
        }
    };
}