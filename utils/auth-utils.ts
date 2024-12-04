import {request} from "@playwright/test";
import {LoginDto} from "../tests/dto/login-dto";
import {PASSWORD, USERNAME} from "../config/env-data";

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'

export class AuthUtils{

    async getToken(){String
        const requestBody = new LoginDto(USERNAME,PASSWORD)
        const requestContext = await request.newContext()
        const response = await requestContext.post(`${serviceURL}${loginPath}`, {
            data: requestBody,
        })
       return  await response.text()
    }

}