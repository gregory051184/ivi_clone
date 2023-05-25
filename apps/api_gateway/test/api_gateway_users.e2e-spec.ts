import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {RegistrationDto} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const createUserDto: RegistrationDto = {
        email: "ivanov@mail.ru",
        password: "123",
        first_name: "Victor",
        second_name: "Ivanov",
        phone: "89000000066",
        age: 35,
        country: "USA"
    }
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


    it('/users (POST)', async () => {
        return request(app.getHttpServer())
            .post('/users')
            .send(createUserDto)
            .expect(201)
    })

    it(`/users/:id (GET)`, async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const user = await request(app.getHttpServer())
            .get(`/users/email/${createUserDto.email}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/users/${user.body.id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it('/users/email/:email (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get(`/users/email/${createUserDto.email}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    })

    it('/users/phone/:phone (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get(`/users/phone/${createUserDto.phone}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    })

    it('/users/filter/:param1/:param2(GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get(`/users/filter/${createUserDto.age}/${createUserDto.country}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    })

    it('/users/filter/param (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get(`/users/filter/${createUserDto.age}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    })

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

    it('/users/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const user = await request(app.getHttpServer())
            .get(`/users/email/${createUserDto.email}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        return request(app.getHttpServer())
            .put(`/users/${user.body.id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createUserDto, first_name: 'Sergey'})
            .expect(200)
    });

    it('/users/role/:role (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get(`/users/role/USER`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it('/users/role/add (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const user = await request(app.getHttpServer())
            .get(`/users/email/${createUserDto.email}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        return request(app.getHttpServer())
            .post(`/users/role/add`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({userId: user.body.id, value: 'ADMIN'})
            .expect(201)
    });

    it('/users/role/delete (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const user = await request(app.getHttpServer())
            .get(`/users/email/${createUserDto.email}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        return request(app.getHttpServer())
            .post(`/users/role/delete`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({userId: user.body.id, value: 'ADMIN'})
            .expect(201)
    });

    it('/users/:id/reviews (GET)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const user = await request(app.getHttpServer())
            .get(`/users/email/${createUserDto.email}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/users/${user.body.id}/reviews`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it(`/users/:id (DELETE)`, async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const user = await request(app.getHttpServer())
            .get(`/users/email/${createUserDto.email}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
        return request(app.getHttpServer())
            .delete(`/users/${user.body.id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });
});
