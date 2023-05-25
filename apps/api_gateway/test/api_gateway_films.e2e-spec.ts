import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AddAwardDto, AddCountryDto, AddGenreDto, AddPersonDto, AddRelatedFilmDto, CreateFilmDto} from "@app/common";


describe('AppController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    const createFilmDto: CreateFilmDto = {
        name: "Scarface",
        originalName: "Scarface",
        poster: "poster",
        trailer: "trailer",
        mpaaRating: "G",
        rating: 2,
        ratingsNumber: 3,
        year: 1983,
        duration: 170,
        description: "the best of the best",
    }
    const mockUser =
        {
            email: 'zup@mail.ru',
            password: '123'
        };

    const addPersonDto: AddPersonDto = {
        name: 'Лесли',
        originalName: 'Lesly',
        photo: 'photo'
    };

    const addGenreDto: AddGenreDto = {
        name: 'boevik'
    };

    const addCountryDto: AddCountryDto = {
        name: 'США',
        englishName: 'USA'
    };

    const addAwardDto: AddAwardDto = {
        name: 'Oscar',
        year: 2019,
        nominations: []
    };

    const addRelatedFilmDto: AddRelatedFilmDto = {
        id: 1
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

    it('/films (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        return request(app.getHttpServer())
            .post('/films')
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(createFilmDto)
            .expect(201)
    });

    it('/films (GET)', async () => {
        return request(app.getHttpServer())
            .get('/films')
            .expect(200)
    });

    it('/films/filter/:filter1 (GET)', async () => {
        return request(app.getHttpServer())
            .get(`/films/filter/${createFilmDto.year}`)
            .expect(200)
    });

    it('/films/filter/:filter1/:filter2 (GET)', async () => {
        return request(app.getHttpServer())
            .get(`/films/filter/boevik/${createFilmDto.year}`)
            .expect(200)
    });

    it('/films/filter/:filter1/:filter2/:filter3 (GET)', async () => {
        return request(app.getHttpServer())
            .get(`/films/filter/boevik/${createFilmDto.year}/USA`)
            .expect(200)
    });

    it('/films/:id (GET)', async () => {
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        console.log(film.body)
        return request(app.getHttpServer())
            .get(`/films/${film.body[0].id}`)
            .expect(200)
    });

    it('/films/:name (GET)', async () => {
        return request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
    });

    it('/films/:id (PUT)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .put(`/films/${film.body[0].id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({...createFilmDto, duration: 190})
            .expect(200)
    });

    it('/films/:id/add/director (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .post(`/films/${film.body[0].id}/add/director`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(addPersonDto)
            .expect(201)
    });

    it('/films/:id/add/writer (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        console.log(film.body[0])
        return request(app.getHttpServer())
            .post(`/films/${film.body[0].id}/add/writer`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(addPersonDto)
            .expect(201)
    });

    //it('/films/:id/add/producer (POST)', async () => {
    //    const loginResponse = await request(app.getHttpServer())
    //        .post('/auth/login')
    //        .send(mockUser)
    //        .expect(201)
    //    const film = await request(app.getHttpServer())
    //        .get(`/films/name/${createFilmDto.name}`)
    //        .expect(200)
    //    return request(app.getHttpServer())
    //        .post(`/films/${film.body[0].id}/add/producer`)
    //        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    //        .send(addPersonDto)
    //        .expect(201)
    //});
//
    //it('/films/:id/add/cinematography (POST)', async () => {
    //    const loginResponse = await request(app.getHttpServer())
    //        .post('/auth/login')
    //        .send(mockUser)
    //        .expect(201)
    //    const film = await request(app.getHttpServer())
    //        .get(`/films/name/${createFilmDto.name}`)
    //        .expect(200)
    //    return request(app.getHttpServer())
    //        .post(`/films/${film.body[0].id}/add/cinematography`)
    //        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    //        .send(addPersonDto)
    //        .expect(201)
    //});
//
    //it('/films/:id/add/musician (POST)', async () => {
    //    const loginResponse = await request(app.getHttpServer())
    //        .post('/auth/login')
    //        .send(mockUser)
    //        .expect(201)
    //    const film = await request(app.getHttpServer())
    //        .get(`/films/name/${createFilmDto.name}`)
    //        .expect(200)
    //    return request(app.getHttpServer())
    //        .post(`/films/${film.body[0].id}/add/musician`)
    //        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    //        .send(addPersonDto)
    //        .expect(201)
    //});
//
    //it('/films/:id/add/designer (POST)', async () => {
    //    const loginResponse = await request(app.getHttpServer())
    //        .post('/auth/login')
    //        .send(mockUser)
    //        .expect(201)
    //    const film = await request(app.getHttpServer())
    //        .get(`/films/name/${createFilmDto.name}`)
    //        .expect(200)
    //    return request(app.getHttpServer())
    //        .post(`/films/${film.body[0].id}/add/designer`)
    //        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    //        .send(addPersonDto)
    //        .expect(201)
    //});
//
    //it('/films/:id/add/editor (POST)', async () => {
    //    const loginResponse = await request(app.getHttpServer())
    //        .post('/auth/login')
    //        .send(mockUser)
    //        .expect(201)
    //    const film = await request(app.getHttpServer())
    //        .get(`/films/name/${createFilmDto.name}`)
    //        .expect(200)
    //    return request(app.getHttpServer())
    //        .post(`/films/${film.body[0].id}/add/editor`)
    //        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    //        .send(addPersonDto)
    //        .expect(201)
    //});
//
    //it('/films/:id/add/genre (POST)', async () => {
    //    const loginResponse = await request(app.getHttpServer())
    //        .post('/auth/login')
    //        .send(mockUser)
    //        .expect(201)
    //    const film = await request(app.getHttpServer())
    //        .get(`/films/name/${createFilmDto.name}`)
    //        .expect(200)
    //    return request(app.getHttpServer())
    //        .post(`/films/${film.body[0].id}/add/genre`)
    //        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    //        .send(addGenreDto)
    //        .expect(201)
    //});

    it('/films/:id/add/country (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .post(`/films/${film.body[0].id}/add/country`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(addCountryDto)
            .expect(201)
    });

    it('/films/:id/add/award (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .post(`/films/${film.body[0].id}/add/award`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(addAwardDto)
            .expect(201)
    });

    it('/films/:id/add/relatedFilm (POST)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .post(`/films/${film.body[0].id}/add/relatedFilm`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send(addRelatedFilmDto)
            .expect(201)
    });

    it('/films/:id/persons (GET)', async () => {
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .get(`/films/${film.body[0].id}/persons `)
            .expect(200)
    });

    it('/films/:id (DELETE)', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(mockUser)
            .expect(201)
        const film = await request(app.getHttpServer())
            .get(`/films/name/${createFilmDto.name}`)
            .expect(200)
        return request(app.getHttpServer())
            .delete(`/films/${film.body[0].id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .expect(200)
    });


})