import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {
    CreateCountryDto, CreateNominationDto,
} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const createCountryDto: CreateCountryDto = {
        name: 'США',
        englishName: 'USA'
    };

    const mockUser =
        {
            email: 'zup@mail.ru',
            password: '123'
        };

    const createNominationDto: CreateNominationDto = {
        name: 'someNomination'
    }

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

    it('/countries (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/countries')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createCountryDto)
            .expect(201)
    });

    it('/countries (GET)', async () => {
        return request(app.getHttpServer())
            .get('/countries')
            .expect(200)
    });

    it('/countries/:id (GET)', async () => {
        const countries = await request(app.getHttpServer())
            .get('/countries')
            .expect(200)
        const country_id = countries.body
            .filter(country => country.name === createCountryDto.name)
            .map(country => country.id)[0]
        return request(app.getHttpServer())
            .get(`/countries/${country_id}`)
            .expect(200)
    });

    it('/countries/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const countries = await request(app.getHttpServer())
            .get('/countries')
            .expect(200)
        const country_id = countries.body
            .filter(country => country.name === createCountryDto.name)
            .map(country => country.id)[0]
        return request(app.getHttpServer())
            .put(`/countries/${country_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createCountryDto})
            .expect(200)
    });

    it('/countries/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const countries = await request(app.getHttpServer())
            .get('/countries')
            .expect(200)
        const country_id = countries.body
            .filter(country => country.name === createCountryDto.name)
            .map(country => country.id)[0]
        return request(app.getHttpServer())
            .delete(`/countries/${country_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });
})
