import {Test, TestingModule} from '@nestjs/testing';
import {getModelToken} from "@nestjs/sequelize";
import {AwardService} from "../award.service";
import {Award, CreateAwardDto, CreateNominationDto, Film, FilmAwards, Nomination} from "@app/common";


describe('Testing RolesService', () => {
    let service: AwardService;

    let film: Film;
    let nomination: Nomination;
    let award: Award;

    const mockAwardService = {

        createAward: jest.fn((dto: CreateAwardDto) => {
                return {...award, id: 1, name: dto.name, year: dto.year};
            }
        ),
        getOrCreateAward: jest.fn((dto: CreateAwardDto) => {
            return {...award, id: 1, name: dto.name, year: dto.year};
        }),
        getAllAwards: jest.fn(() => []),
        getAwardById: jest.fn((id = 1) => {
            return {...award, id: id}
        }),
        getAwardByNameAndYear: jest.fn((id = 1, name = 'someAwardName"') => {
            return {...award, id: id, name: name}
        }),
        editAward: jest.fn((dto: CreateAwardDto, id = 1) => {
                return {...award, id: 1, name: dto.name, year: dto.year};
            }
        ),
        deleteAward: jest.fn((id = 1) => {
            return true;
        }),
        createNomination: jest.fn((dto: CreateNominationDto) => {
                return {...nomination, id: 1, name: dto.name};
            }
        ),
        getOrCreateNomination: jest.fn((dto: CreateNominationDto) => {
                return {...nomination, id: 1, name: dto.name};
            }
        ),
        getAllNominations: jest.fn(() => []),
        getNominationById: jest.fn((id = 1) => {
            return {...nomination, id: id}
        }),
        getNominationByName: jest.fn((name = 'someName') => {
            return {...nomination, name: name}
        }),
        editNomination: jest.fn((dto: CreateNominationDto, id = 1) => {
                return {...nomination, id: id, name: dto.name};
            }
        ),
        deleteNomination: jest.fn((id = 1) => {
            return true;
        }),
        addFilmAndNominationsForAward: jest.fn((film, dto: CreateNominationDto, nominations=[]) => {
                return {...nomination, name: dto.name};
            }
        )
    }


    const mockAwardRepo = {};

    const mockFilmAwardsRepo = {};

    const mockNominationRepo = {};

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [AwardService,
                {
                    provide: AwardService,
                    useValue: mockAwardService
                },

                {
                    provide: getModelToken(Award),
                    useValue: mockAwardRepo
                },


                {
                    provide: getModelToken(FilmAwards),
                    useValue: mockFilmAwardsRepo
                },


                {
                    provide: getModelToken(Nomination),
                    useValue: mockNominationRepo
                },

            ],
        }).compile();

        service = app.get<AwardService>(AwardService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    it("calling createAward method", () => {
        const spy = jest.spyOn(service, "createAward");
        const dto = {
            name: "someAward",
            year: 2011
        }
        service.createAward(dto);
        expect(spy).toHaveBeenCalledWith(dto);
        expect(spy.mock.results[0].value).toEqual(service.createAward(dto))
    })

    it("calling getOrCreateAward method", () => {
        const spy = jest.spyOn(service, "getOrCreateAward");
        const dto = {
            name: "someAward",
            year: 2011
        }
        service.getOrCreateAward(dto);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getOrCreateAward(dto))
    })

    it("calling getAllAwards method", () => {
        const spy = jest.spyOn(service, "getAllAwards");
        service.getAllAwards();
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getAllAwards())
    })

    it("calling getAwardById method", () => {
        const spy = jest.spyOn(service, "getAwardById");
        const id = 1;
        service.getAwardById(id);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getAwardById(id))
    })

    it("calling getAwardByNameAndYear method", () => {
        const spy = jest.spyOn(service, "getAwardByNameAndYear");
        const name = 'someAwardName'
        const id = 1;
        service.getAwardByNameAndYear(name, id);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getAwardByNameAndYear(name, id))
    })

    it("calling editAward method", () => {
        const spy = jest.spyOn(service, "editAward");
        const id = 1;
        const dto = {
            name: "someAward",
            year: 2011
        };
        service.editAward(dto, id);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.editAward(dto, id));
    })

    it("calling deleteAward method", () => {
        const spy = jest.spyOn(service, "deleteAward");
        const id = 1;
        service.deleteAward(id);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.deleteAward(id));
    })

    it("calling createNomination method", () => {
        const spy = jest.spyOn(service, "createNomination");
        const dto = {
            name: "someNomination"
        };
        service.createNomination(dto);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.createNomination(dto));
    })

    it("calling getOrCreateNomination method", () => {
        const spy = jest.spyOn(service, "getOrCreateNomination");
        const dto = {
            name: "someNomination"
        };
        service.getOrCreateNomination(dto);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getOrCreateNomination(dto));
    })

    it("calling getAllNominations method", () => {
        const spy = jest.spyOn(service, "getAllNominations");
        service.getAllNominations();
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getAllNominations());
    })

    it("calling getNominationById method", () => {
        const spy = jest.spyOn(service, "getNominationById");
        const id = 1;
        service.getNominationById(id);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getNominationById(id));
    })

    it("calling getNominationByName method", () => {
        const spy = jest.spyOn(service, "getNominationByName");
        const name = 'someName';
        service.getNominationByName(name);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.getNominationByName(name));
    })

    it("calling editNomination method", () => {
        const spy = jest.spyOn(service, "editNomination");
        const id = 1;
        const dto = {
            name: "someNomination"
        };
        service.editNomination(dto, id);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.editNomination(dto, id));
    })

    it("calling deleteNomination method", () => {
        const spy = jest.spyOn(service, "deleteNomination");
        const id = 1;
        service.deleteNomination(id);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.deleteNomination(id));
    })

    it("calling addFilmAndNominationsForAward method", () => {
        const spy = jest.spyOn(service, "addFilmAndNominationsForAward");
        const dto = {
            name: "someAward",
            year: 2011
        };
        let film: Film;
        const nominations = [];
        service.addFilmAndNominationsForAward(film, dto, nominations);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.results[0].value).toEqual(service.addFilmAndNominationsForAward(film, dto, nominations));
    })
});