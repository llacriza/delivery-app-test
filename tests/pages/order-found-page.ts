import { AuthorizedPage } from './authorized-page'
import { Locator, Page } from '@playwright/test'

export class OrderFoundPage extends AuthorizedPage {
  readonly uselessInput : Locator
  readonly displayedOrderName : Locator
  readonly displayedOrderPhone : Locator
  readonly displayedOrderComment: Locator
  readonly orderStatusOpen : Locator
  readonly orderStatusDelivered : Locator

  constructor(page: Page) {
    super(page)
    this.uselessInput = page.getByTestId('useless-input')
    this.displayedOrderName = page.getByTestId('order-item-0').locator('span')
    this.displayedOrderPhone = page.getByTestId('order-item-1').locator('span')
    this.displayedOrderComment = page.getByTestId('order-item-2').locator('span')
    this.orderStatusOpen = page.getByText('OPEN')
    this.orderStatusDelivered = page.getByText('DELIVERED', {exact: true})
  }
}