import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateRoleDto, Role} from "@app/common";
import {UpdateRoleDto} from "@app/common/dto/rolesDto/update_role.dto";

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private readonly roleRepository: typeof Role) {
    }

    async createRole(createRoleDto: CreateRoleDto) {
        if (createRoleDto.value === 'SUPERUSER') {
            const superuser_role = await this.roleRepository.create(createRoleDto);
            await this.roleRepository.create({value: 'USER', description: 'Пользователь'});
            await this.roleRepository.create({value: 'ADMIN', description: 'Администратор'});
            return superuser_role;
        }
        const existing_role = await this.getRoleByValue(createRoleDto.value);

        if (!existing_role) {
            return await this.roleRepository.create(createRoleDto);
        }
        throw new HttpException("Такая роль уже существует", HttpStatus.BAD_REQUEST)
    }

    async getAllRoles() {
        return await this.roleRepository.findAll({
            include: {
                all: true
            }
        });
    }

    async getRoleByValue(value: string) {
        return await this.roleRepository.findOne({
            where: {
                value: value
            }
        });
    }

    async getRoleById(id: number) {
        return await this.roleRepository.findByPk(id);
    }

    async updateRole(updateRoleDto: UpdateRoleDto, id: number) {
        return await this.roleRepository.update({...updateRoleDto}, {
            where: {
                id
            }
        });
    }

    async deleteRole(id: number) {
        return await this.roleRepository.destroy({
            where: {
                id
            }
        });
    }
}
