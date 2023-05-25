import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {
    CreateCountryDto, CreateGenreDto, CreateNominationDto,
} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const createGenreDto: CreateGenreDto = {
        name: 'драма',
        englishName: 'drama'
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
    it('/genres (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/genres')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createGenreDto)
            .expect(201)
    });

    it('/genres (GET)', async () => {
        return request(app.getHttpServer())
            .get('/genres')
            .expect(200)
    });

    it('/genres/:id (GET)', async () => {
        const genres = await request(app.getHttpServer())
            .get('/genres')
            .expect(200)
        const genre_id = genres.body
            .filter(genre => genre.name === createGenreDto.name)
            .map(genre => genre.id)[0]
        return request(app.getHttpServer())
            .get(`/genres/${genre_id}`)
            .expect(200)
    });

    it('/genres/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const genres = await request(app.getHttpServer())
            .get('/genres')
            .expect(200)
        const genre_id = genres.body
            .filter(genre => genre.name === createGenreDto.name)
            .map(genre => genre.id)[0]
        return request(app.getHttpServer())
            .put(`/genres/${genre_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createGenreDto})
            .expect(200)
    });

    it('/genres/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const genres = await request(app.getHttpServer())
            .get('/genres')
            .expect(200)
        const genre_id = genres.body
            .filter(genre => genre.name === createGenreDto.name)
            .map(genre => genre.id)[0]
        return request(app.getHttpServer())
            .delete(`/genres/${genre_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });
})