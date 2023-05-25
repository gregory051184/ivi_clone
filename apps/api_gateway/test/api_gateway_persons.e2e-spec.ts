import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {CreatePersonDto, CreateProfessionDto, RegistrationDto} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;


    const mockUser =
        {
            email: 'zup@mail.ru',
            password: '123'
        };

    const createPersonDto: CreatePersonDto = {
        name: 'Arnold',
        originalName: 'Arnold',
        photo: 'photo'
    }

    const createProfessionDto: CreateProfessionDto = {
        name: 'Сценарист'
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

    it('/persons (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/persons')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createPersonDto)
            .expect(201)
    });

    it('/persons (GET)', async () => {
        return request(app.getHttpServer())
            .get('/persons')
            .expect(200)
    });

    it('/person/:id (GET)' , async () => {
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/person/${person.body[0].id}`)
            .expect(200)
    });

    it('/person/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .put(`/person/${person.body[0].id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createPersonDto})
            .expect(200)
    });

    it('/persons/search (GET)', async () => {
        return request(app.getHttpServer())
            .get(`/persons/search`)
            .expect(200)
    });


    it('/person/:id/films (GET)', async () => {
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/person/${person.body[0].id}/films`)
            .expect(200)
    });

    it('/professions (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/professions')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createProfessionDto)
            .expect(201)
    });

    it('/person/:id/professions (GET)', async () => {
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/person/${person.body[0].id}/professions `)
            .expect(200)
    });

    it('/person/:id/films/:professionId (GET)', async () => {
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/person/${person.body[0].id}/films/1`)
            .expect(200)
    });

    it('/person/:id/add/profession (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .post(`/person/${person.body[0].id}/add/profession`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createProfessionDto)
            .expect(201)
    });

    it('/professions (GET)', async () => {
        return request(app.getHttpServer())
            .get('/professions')
            .expect(200)
    });

    it('/professions/:id (GET)' , async () => {
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/professions/${person.body[0].professions[0].id}`)
            .expect(200)
    });

    it('/professions/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .put(`/person/${person.body[0].professions[0].id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createProfessionDto, name: 'композитор'})
            .expect(200)
    });

    it('/professions/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .delete(`/professions/${person.body[0].professions[0].id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

    it('/person/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const  person = await request(app.getHttpServer())
            .get(`/persons/search/?name=${createPersonDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .delete(`/person/${person.body[0].id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });

})

