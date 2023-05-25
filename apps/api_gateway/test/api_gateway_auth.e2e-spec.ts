import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;


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
    it('/auth/login (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    //it('/auth/logout (GET)', async () => {
    //    const loginResponse = await request(app.getHttpServer())
    //        .post('/auth/login')
    //        .send(mockUser)
    //        .expect(201)
    //    return request(app.getHttpServer())
    //        .get('/auth/logout')
    //        .send(loginResponse.headers)
    //        .expect(200)
    //})
})

