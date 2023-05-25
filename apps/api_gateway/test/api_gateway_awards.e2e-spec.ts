import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {
    CreateAwardDto, CreateNominationDto,
} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const createAwardDto: CreateAwardDto = {
        name: 'Oscar',
        year: 2000
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

    it('/awards (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/awards')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createAwardDto)
            .expect(201)
    });

    it('/awards (GET)', async () => {
        return request(app.getHttpServer())
            .get('/awards')
            .expect(200)
    });

    it('/awards/:id (GET)', async () => {
        const award = await request(app.getHttpServer())
            .get('/awards')
            .expect(200)
        const award_id = award.body
            .filter(award => award.name === createAwardDto.name && award.year === createAwardDto.year)
            .map(award => award.id)[0]
        return request(app.getHttpServer())
            .get(`/awards/${award_id}`)
            .expect(200)
    });

    it('/awards/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const award = await request(app.getHttpServer())
            .get('/awards')
        const award_id = award.body
            .filter(award => award.name === createAwardDto.name && award.year === createAwardDto.year)
            .map(award => award.id)[0]
        return request(app.getHttpServer())
            .put(`/awards/${award_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createAwardDto})
            .expect(200)
    });

    it('/awards/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const award = await request(app.getHttpServer())
            .get('/awards')
        const award_id = award.body
            .filter(award => award.name === createAwardDto.name && award.year === createAwardDto.year)
            .map(award => award.id)[0]
        console.log(award_id)
        return request(app.getHttpServer())
            .delete(`/awards/${award_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it('/nominations (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/nominations')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createNominationDto)
            .expect(201)
    });

    it('/nominations (GET)', async () => {
        return request(app.getHttpServer())
            .get('/nominations')
            .expect(200)
    });

    it('/nominations/:id (GET)', async () => {
        const nomination = await request(app.getHttpServer())
            .get('/nominations')
            .expect(200)
        const nomination_id = nomination.body
            .filter(nomination => nomination.name === createNominationDto.name)
            .map(nomination => nomination.id)[0]
        return request(app.getHttpServer())
            .get(`/nominations/${nomination_id}`)
            .expect(200)
    });

    it('/nominations/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const nomination = await request(app.getHttpServer())
            .get('/nominations')
            .expect(200)
        const nomination_id = nomination.body
            .filter(nomination => nomination.name === createNominationDto.name)
            .map(nomination => nomination.id)[0]
        return request(app.getHttpServer())
            .put(`/nominations/${nomination_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createNominationDto})
            .expect(200)
    });

    it('/nominations/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const nomination = await request(app.getHttpServer())
            .get('/nominations')
            .expect(200)
        const nomination_id = nomination.body
            .filter(nomination => nomination.name === createNominationDto.name)
            .map(nomination => nomination.id)[0]
        return request(app.getHttpServer())
            .delete(`/nominations/${nomination_id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });
})