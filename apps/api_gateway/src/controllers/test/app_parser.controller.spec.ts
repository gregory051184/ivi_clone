import {Test, TestingModule} from "@nestjs/testing";
import {AppParseController} from "../app_parser.controller";
import {AppService} from "../../app.service";
import {RolesGuard} from "@app/common";
import {JwtService} from "@nestjs/jwt";


describe('Testing AppParseController', () => {
    let controller: AppParseController;

    const mockAppService = {
        parseFilms: jest.fn().mockImplementation(query => {}),
        parseOneFilm: jest.fn().mockImplementation(id => {})
    }

    const mockJwtService = {}

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppParseController],
            providers: [
                AppService,
                {
                    provide: AppService,
                    useValue: mockAppService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                }
            ],
            imports: []
        }).compile()

        controller = module.get<AppParseController>(AppParseController);
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    it("calling startParser method", () => {
        const req = {}
        const spy = jest.spyOn(controller, "startParser");
        controller.startParser(req);
        expect(spy).toHaveBeenCalled()
    })

    it("calling parseOneFilm method", () => {
        const id = 1
        const spy = jest.spyOn(controller, "parseOneFilm");
        controller.parseOneFilm(id);
        expect(spy).toHaveBeenCalled()
    })
});