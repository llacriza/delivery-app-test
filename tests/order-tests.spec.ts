import {test, expect, request, Route} from '@playwright/test';

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'


test.skip('auth', async ({page}) => {
    await page.context().addInitScript(() => {
        localStorage.setItem('jwt', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5paWxiIiwiZXhwIjoxNzMzMzMwNjAxLCJpYXQiOjE3MzMzMTI2MDF9._rB-ct1j96oYya8B95Yrvm4c3hp3iWMrWiUq1GWFE_yPWWvfLkHZBFbIDx7BMyBMBYENES7QMVgJLxxTxOyWMw')
    })
    await page.goto('https://fe-delivery.tallinn-learning.ee/');
    await expect(page.getByText("Status")).toBeVisible()
    await page.getByTestId('createOrder-button').click()
});

test.skip('auth api', async ({page,request}) => {
    const requestBody = {"username":"daniilb","password":"pwd4V7wYbfT2n"}
    const response = await request.post(`${serviceURL}${loginPath}`, {
        data: requestBody,
    })
    const jwtToken = await response.text()
    console.log(jwtToken)

    await page.goto('https://fe-delivery.tallinn-learning.ee/')
    await page.evaluate((token) => {
        localStorage.setItem('jwt', token);
    }, jwtToken.toString());

    await page.reload();
    const storedToken = await page.evaluate(() => localStorage.getItem('jwt'));
    console.log("from storage: "+storedToken)
    await page.getByTestId('createOrder-button').click()
});

test.skip('Create order with mock api', async ({page}) => {
    await page.context().addInitScript(() => {
        localStorage.setItem('jwt', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5paWxiIiwiZXhwIjoxNzMzMzMwNjAxLCJpYXQiOjE3MzMzMTI2MDF9._rB-ct1j96oYya8B95Yrvm4c3hp3iWMrWiUq1GWFE_yPWWvfLkHZBFbIDx7BMyBMBYENES7QMVgJLxxTxOyWMw')
    })

    await page.route('**/orders', async (route : Route) =>{
        if (route.request().method()==='POST'){
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body : JSON.stringify({
                    "status": "OPEN",
                    "courierId": null,
                    "customerName": "asd",
                    "customerPhone": "123423123123",
                    "comment": "asd",
                    "id": 2945
                })
            })
        }else {
            await route.continue()
        }
    })
    await page.goto('https://fe-delivery.tallinn-learning.ee/');
    await page.getByTestId('username-input').fill("testName")
    await page.getByTestId('phone-input').fill("89084563322")
    await page.getByTestId('comment-input').fill("TestComment")
    await page.getByTestId('createOrder-button').click()

    await expect(page.getByTestId('orderSuccessfullyCreated-popup-close-button')).toBeVisible()
});

test.skip('Get OPEN order with mock api', async ({page}) => {
    await page.context().addInitScript(() => {
        localStorage.setItem('jwt', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5paWxiIiwiZXhwIjoxNzMzMzMwNjAxLCJpYXQiOjE3MzMzMTI2MDF9._rB-ct1j96oYya8B95Yrvm4c3hp3iWMrWiUq1GWFE_yPWWvfLkHZBFbIDx7BMyBMBYENES7QMVgJLxxTxOyWMw')
    })

    await page.route('**/orders/*', async (route : Route) =>{
        if (route.request().method()==='GET'){
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body : JSON.stringify({
                    "status": "OPEN",
                    "courierId": null,
                    "customerName": "rqwr",
                    "customerPhone": "+37124806687",
                    "comment": "234234234",
                    "id": 2947
                })
            })
        }else {
            await route.continue()
        }
    })
    await page.goto('https://fe-delivery.tallinn-learning.ee/');
    await page.getByTestId('openStatusPopup-button').click()
    await page.getByTestId('searchOrder-input').fill("2947")
    await page.getByTestId('searchOrder-submitButton').click()

    await expect(page.getByTestId('useless-input')).toBeVisible()
    await expect(page.getByText('OPEN')).toHaveCSS("background-color", "rgb(253, 204, 0)")

});

test.skip('Get DELIVERED order with mock api', async ({page}) => {
    await page.context().addInitScript(() => {
        localStorage.setItem('jwt', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5paWxiIiwiZXhwIjoxNzMzMzMwNjAxLCJpYXQiOjE3MzMzMTI2MDF9._rB-ct1j96oYya8B95Yrvm4c3hp3iWMrWiUq1GWFE_yPWWvfLkHZBFbIDx7BMyBMBYENES7QMVgJLxxTxOyWMw')
    })

    await page.route('**/orders/*', async (route : Route) =>{
        if (route.request().method()==='GET'){
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body : JSON.stringify({
                    "status": "DELIVERED",
                    "courierId": null,
                    "customerName": "rqwr",
                    "customerPhone": "+37124806687",
                    "comment": "234234234",
                    "id": 2947
                })
            })
        }else {
            await route.continue()
        }
    })
    await page.goto('https://fe-delivery.tallinn-learning.ee/');
    await page.getByTestId('openStatusPopup-button').click()
    await page.getByTestId('searchOrder-input').fill("2947")
    await page.getByTestId('searchOrder-submitButton').click()

    await expect(page.getByTestId('useless-input')).toBeVisible()
    await expect(page.getByText('DELIVERED', { exact: true })).toHaveCSS("background-color", "rgb(253, 204, 0)")

});

test('Get 500 error with mock api', async ({page}) => {
    await page.context().addInitScript(() => {
        localStorage.setItem('jwt', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5paWxiIiwiZXhwIjoxNzMzMzMwNjAxLCJpYXQiOjE3MzMzMTI2MDF9._rB-ct1j96oYya8B95Yrvm4c3hp3iWMrWiUq1GWFE_yPWWvfLkHZBFbIDx7BMyBMBYENES7QMVgJLxxTxOyWMw')
    })

    await page.route('**/orders/*', async (route : Route) =>{
        if (route.request().method()==='GET'){
            await route.fulfill({
                status: 500,
            })
        }else {
            await route.continue()
        }
    })
    await page.goto('https://fe-delivery.tallinn-learning.ee/');
    await page.getByTestId('openStatusPopup-button').click()
    await page.getByTestId('searchOrder-input').fill("2947")
    await page.getByTestId('searchOrder-submitButton').click()

    await expect(page.getByRole('heading', { name: 'Order not found' })).toBeVisible()

});