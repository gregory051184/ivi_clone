import {Test, TestingModule} from "@nestjs/testing";
import {JwtService} from "@nestjs/jwt";
import {AppReviewController} from "../app_review.controller";


describe('Testing AppReviewController', () => {
    let controller: AppReviewController;


    const mockReviewClient = {
    };

    const mockJwtService = {
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppReviewController],
            providers: [

                {
                    provide: 'REVIEW',
                    useValue: mockReviewClient
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                }

            ],
            imports: []
        }).compile()

        controller = module.get<AppReviewController>(AppReviewController);
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    it("calling addReview method", () => {
        let req;
        const dto = {
            title: "comment",
            text: "Bad comment"
        };
        const filmId = 1;
        const spy = jest.spyOn(controller, "addReview");
        controller.addReview(dto, req, filmId);
        expect(spy).toHaveBeenCalled()
    })

    it("calling getAllReviews method", () => {
        const spy = jest.spyOn(controller, "getAllReviews");
        controller.getAllReviews();
        expect(spy).toHaveBeenCalled()
    })

    it("calling addChildReview method", () => {
        let req;
        const dto = {
            title: "comment",
            text: "Bad comment"
        };
        const filmId = 1;
        const parentId = 1;
        const spy = jest.spyOn(controller, "addChildReview");
        controller.addChildReview(dto, req, filmId, parentId);
        expect(spy).toHaveBeenCalled()
    })

    it("calling getReview method", () => {
        const id = 1;
        const spy = jest.spyOn(controller, "getReview");
        controller.getReview(id);
        expect(spy).toHaveBeenCalled()
    })

    it("calling editReview method", () => {
        const dto = {
            title: "comment",
            text: "Bad comment"
        };
        const id = 1;
        const spy = jest.spyOn(controller, "editReview");
        controller.editReview(dto, id);
        expect(spy).toHaveBeenCalled()
    })

    it("calling deleteReview method", () => {
        let request;
        const id = 1;
        const spy = jest.spyOn(controller, "deleteReview");
        controller.deleteReview(id, request);
        expect(spy).toHaveBeenCalledWith(id, request)
    })
});