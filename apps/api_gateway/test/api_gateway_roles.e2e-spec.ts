import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {
    CreateCountryDto, CreateNominationDto, CreateRoleDto,
} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const createRoleDto: CreateRoleDto = {
        value: 'STAFF',
        description: 'Персонал'
    };

    const mockUser =
        {
            email: 'zup@mail.ru',
            password: '123'
        };


    beforeEach(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                JwtModule.registerAsync({
                    useFactory: (configService: ConfigService) => ({
                        secret: configService.get("JWT_SECRET"),
                        signOptions: {
                            expiresIn: "24h"
                        },
                    }),
                    inject: [ConfigService],
                }),
            ],
        }).compile();
        jwtService = moduleFixture.get<JwtService>(JwtService);
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('/roles (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/roles')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createRoleDto)
            .expect(201)
    });

    it('/roles (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get('/roles')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it('/roles/:id (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const roles = await request(app.getHttpServer())
            .get('/roles')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        const role_id = roles.body
            .filter(role => role.value === createRoleDto.value)
            .map(role => role.id)[0]
        return request(app.getHttpServer())
            .get(`/roles/${role_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it('/roles/:value (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get(`/roles/${createRoleDto.value}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it('/roles/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const roles = await request(app.getHttpServer())
            .get('/roles')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        const role_id = roles.body
            .filter(role => role.value === createRoleDto.value)
            .map(role => role.id)[0]
        return request(app.getHttpServer())
            .put(`/roles/${role_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createRoleDto})
            .expect(200)
    });

    it('/roles/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const roles = await request(app.getHttpServer())
            .get('/roles')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        const role_id = roles.body
            .filter(role => role.value === createRoleDto.value)
            .map(role => role.id)[0]
        return request(app.getHttpServer())
            .delete(`/roles/${role_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });
})
