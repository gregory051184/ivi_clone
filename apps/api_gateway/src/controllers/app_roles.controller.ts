import {Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateRoleDto, Role, Roles, RolesGuard} from "@app/common";


@ApiTags("Роли пользователей")
@Controller("/roles")
export class AppRolesController {
    constructor(@Inject("ROLES") private readonly rolesClient: ClientProxy) {}

    @ApiOperation({summary: "Создать роль. Необходима роль Администратора."})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN", "SUPERUSER")
    @UseGuards(RolesGuard)
    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesClient.send({
            cmd: "create-role"
        }, {
            createRoleDto
        });
    };

    @ApiOperation({summary: "Получить все роли. Необходима роль Администратора."})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN", "SUPERUSER")
    @UseGuards(RolesGuard)
    @Get()
    async getAllRoles() {
        return this.rolesClient.send({
            cmd: "get-all-roles"
        }, {
            });
    };

    @ApiOperation({summary: "Получить роль по id роли. Необходима роль Администратора."})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN", "SUPERUSER")
    @UseGuards(RolesGuard)
    @Get("/:id")
    async getRoleById(@Param("id") id: string) {
        return this.rolesClient.send({
            cmd: "get-role-by-id"
        }, {
                id
            });

    };

    @ApiOperation({summary: "Получить роль по её названию. Необходима роль Администратора."})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN", "SUPERUSER")
    @UseGuards(RolesGuard)
    @Post("/:value")
    async getRoleByValue(@Body() value: string) {
        return this.rolesClient.send({
            cmd: "get-role-by-value"
        }, {
            value
        });
    };

    @ApiOperation({summary: "Изменить роль по id. Необходима роль Администратора."})
    @ApiResponse({status: 200})
    @Roles("ADMIN", "SUPERUSER")
    @UseGuards(RolesGuard)
    @Put("/:id")
    async updateRole(@Param("id") id: any,
                     @Body() createRoleDto: CreateRoleDto) {
        return this.rolesClient.send({
            cmd: "update-role"
        }, {
            createRoleDto,
            id
        });
    };

    @ApiOperation({summary: "Удалить роль по id. Необходима роль Администратора."})
    @ApiResponse({status: 200})
    @Roles("ADMIN", "SUPERUSER")
    @UseGuards(RolesGuard)
    @Delete("/:id")
    async deleteRole(@Param("id") id: any) {
        return this.rolesClient.send({
            cmd: "delete-role"
        }, {
            id
        });
    };
}