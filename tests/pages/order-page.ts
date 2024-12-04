import { Page } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

export class OrderPage extends AuthorizedPage {
  // add more locators here

  constructor(page: Page) {
    super(page)
  }
}
