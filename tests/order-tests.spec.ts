import {test, expect,Route} from '@playwright/test';
import {AuthUtils} from "../utils/auth-utils";
import {AuthorizedPage} from "./pages/authorized-page";
import {OrderFoundPage} from "./pages/order-found-page";


test.beforeEach(async ({page,context}) => {
    const authUtils = new AuthUtils
    const token = await authUtils.getToken()
    await context.addInitScript((token) => {
        localStorage.setItem('jwt', token);
    }, token.toString());
})

test.describe('ORDERS', async () => {
    test('auth', async ({page, context}) => {

        const orderPage = new AuthorizedPage(page)
        await page.goto('https://fe-delivery.tallinn-learning.ee/');
        await expect(orderPage.statusButton).toBeVisible()
    });
    test('Create order with mock api', async ({page, context}) => {

        const orderPage = new AuthorizedPage(page)
        await page.route('**/orders', async (route: Route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        "status": "OPEN",
                        "courierId": null,
                        "customerName": "asd",
                        "customerPhone": "123423123123",
                        "comment": "asd",
                        "id": 2945
                    })
                })
            } else {
                await route.continue()
            }
        })
        await page.goto('https://fe-delivery.tallinn-learning.ee/');
        await orderPage.userInputField.fill("testName")
        await orderPage.phoneInputField.fill("89084563322")
        await orderPage.commentInputField.fill("TestComment")
        await orderPage.createOrderButton.click()

        await expect(page.getByTestId('orderSuccessfullyCreated-popup-close-button')).toBeVisible()
    });
    test('Get OPEN order with mock api', async ({page, context}) => {

        const orderPage = new AuthorizedPage(page)
        const orderFoundPage = new OrderFoundPage(page)
        await page.route('**/orders/*', async (route: Route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        "status": "OPEN",
                        "courierId": null,
                        "customerName": "rqwr",
                        "customerPhone": "+37124806687",
                        "comment": "234234234",
                        "id": 2947
                    })
                })
            } else {
                await route.continue()
            }
        })

        await page.goto('https://fe-delivery.tallinn-learning.ee/');
        await orderPage.statusButton.click()
        await orderPage.orderSearchInputField.fill("2947")
        await orderPage.orderSearchPopUpButton.click()
        await expect(orderFoundPage.uselessInput).toBeVisible()
        await expect(orderFoundPage.orderStatusOpen).toHaveCSS("background-color", "rgb(253, 204, 0)")

    });
    test('Get DELIVERED order with mock api', async ({page, context}) => {

        const orderPage = new AuthorizedPage(page)
        const orderFoundPage = new OrderFoundPage(page)
        await page.route('**/orders/*', async (route: Route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        "status": "DELIVERED",
                        "courierId": null,
                        "customerName": "rqwr",
                        "customerPhone": "+37124806687",
                        "comment": "234234234",
                        "id": 2947
                    })
                })
            } else {
                await route.continue()
            }
        })
        await page.goto('https://fe-delivery.tallinn-learning.ee/');
        await orderPage.statusButton.click()
        await orderPage.orderSearchInputField.fill("2947")
        await orderPage.orderSearchPopUpButton.click()
        await expect(orderFoundPage.uselessInput).toBeVisible()
        await expect(orderFoundPage.orderStatusDelivered).toHaveCSS("background-color", "rgb(253, 204, 0)")

    });
    test('Get 500 error with mock api', async ({page, context}) => {

        await page.route('**/orders/*', async (route: Route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 500,
                })
            } else {
                await route.continue()
            }
        })
        await page.goto('https://fe-delivery.tallinn-learning.ee/');
        await page.getByTestId('openStatusPopup-button').click()
        await page.getByTestId('searchOrder-input').fill("2947")
        await page.getByTestId('searchOrder-submitButton').click()

        await expect(page.getByRole('heading', {name: 'Order not found'})).toBeVisible()

    })
})