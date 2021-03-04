import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';

const router = Router();
const userController = new UserController();
const surveyController = new SurveyController();
const surveyUserController = new SendMailController();

router.post('/users', userController.create);
router.post('/survey', surveyController.create);
router.get('/survey', surveyController.show);
router.post('/sendEmail', surveyUserController.execute);

export { router };