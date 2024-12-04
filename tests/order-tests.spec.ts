import {test, expect,Route} from '@playwright/test';
import {AuthUtils} from "../utils/auth-utils";
import {AuthorizedPage} from "./pages/authorized-page";
import {OrderFoundPage} from "./pages/order-found-page";


test.beforeEach(async ({context}) => {
    const authUtils = new AuthUtils
    const token = await authUtils.getToken()
    await context.addInitScript((token) => {
        localStorage.setItem('jwt', token);
    }, token.toString());
})

test.describe('ORDERS', async () => {
    test('auth', async ({page}) => {

        const orderPage = new AuthorizedPage(page)
        await page.goto('https://fe-delivery.tallinn-learning.ee/');
        await expect(orderPage.statusButton).toBeVisible()
    });
    test('Create order with mock api', async ({page}) => {

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
    test('Get OPEN order with mock api', async ({page}) => {

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
                        "customerName": "TestName",
                        "customerPhone": "+37124806687",
                        "comment": "TestComment",
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
        await expect.soft(orderFoundPage.uselessInput).toBeVisible()
        await expect.soft(orderFoundPage.orderStatusOpen).toHaveCSS("background-color", "rgb(253, 204, 0)")
        await expect.soft(await orderFoundPage.displayedOrderName.textContent()).toBe("TestName")
        await expect.soft(await orderFoundPage.displayedOrderPhone.textContent()).toBe("+37124806687")
        await expect.soft(await orderFoundPage.displayedOrderComment.textContent()).toBe("TestComment")
    });
    test('Get DELIVERED order with mock api', async ({page}) => {

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
                        "customerName": "TestName",
                        "customerPhone": "+37124806687",
                        "comment": "TestComment",
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
        await expect.soft(orderFoundPage.uselessInput).toBeVisible()
        await expect.soft(orderFoundPage.orderStatusDelivered).toHaveCSS("background-color", "rgb(253, 204, 0)")
        await expect.soft(await orderFoundPage.displayedOrderName.textContent()).toBe("TestName")
        await expect.soft(await orderFoundPage.displayedOrderPhone.textContent()).toBe("+37124806687")
        await expect.soft(await orderFoundPage.displayedOrderComment.textContent()).toBe("TestComment")

    });
    test('Get 500 error with mock api', async ({page}) => {

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