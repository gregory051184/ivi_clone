import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {
    CreateAwardDto, CreateNominationDto, CreateReviewDto,
} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const createReviewDto: CreateReviewDto = {
        title: 'comment',
        text: 'bad comment'
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

    it('/films/:filmId (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/films/31')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createReviewDto, filmId: 31, userId: 1})
            .expect(201)
    });

    it('/reviews (GET)', async () => {
        return request(app.getHttpServer())
            .get('/reviews')
            .expect(200)
    });

    it('/reviews/:id (GET)', async () => {
        const reviews = await request(app.getHttpServer())
            .get('/reviews')
            .expect(200)
        const review_id = reviews.body
            .filter(review => review.title === createReviewDto.title && review.text === createReviewDto.text)
            .map(review => review.id)[0]
        return request(app.getHttpServer())
            .get(`/reviews/${review_id}`)
            .expect(200)
    });

    it('/reviews/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const reviews = await request(app.getHttpServer())
            .get('/reviews')
            .expect(200)
        const review_id = reviews.body
            .filter(review => review.title === createReviewDto.title && review.text === createReviewDto.text)
            .map(review => review.id)[0]
        return request(app.getHttpServer())
            .put(`/reviews/${review_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createReviewDto})
            .expect(200)
    });

    it('/films/:filmId/review/:parentId (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/films/31/review/1')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createReviewDto, filmId: 31, userId: 1, parentId: 1})
            .expect(201)
    });

    it('/reviews/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const reviews = await request(app.getHttpServer())
            .get('/reviews')
            .expect(200)
        const review_id = reviews.body
            .filter(review => review.title === createReviewDto.title && review.text === createReviewDto.text)
            .map(review => review.id)[0]
        return request(app.getHttpServer())
            .delete(`/reviews/${review_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });
})