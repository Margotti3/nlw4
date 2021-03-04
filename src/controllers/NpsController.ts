import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    async execute(request: Request, response: Response) {
        const {survey_id} = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveyUser.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promoter = surveyUser.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveyUser.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveyUser.length;

        const calculate = ((promoter - detractor) / totalAnswers) * 100;
        const nps = Number((calculate >= 0 ? calculate : 0).toFixed(2));

        return response.json({
            detractor, 
            promoter,
            passive,
            totalAnswers,
            nps
        });
    }
}

export { NpsController }