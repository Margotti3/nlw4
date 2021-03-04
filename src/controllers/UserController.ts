import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response){
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatório"),
            email: yup.string().email("Email inválido").required("Email é obrigatório")
        });

        try {
            await schema.validate(request.body, { abortEarly: true });
        } catch (err) {
            throw new AppError(err);
        }

        const userRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await userRepository.findOne({ email});

        if(userAlreadyExists){
            throw new AppError("User already exists");
        }

        const user = userRepository.create({
            name, email
        });

        await userRepository.save(user);

        return response.json(user);
    }
}

export { UserController };