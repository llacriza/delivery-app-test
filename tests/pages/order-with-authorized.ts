import { AuthorizedPage } from './authorized-page'
import { Page } from '@playwright/test'

export class OrderWithAuthorized extends AuthorizedPage {
  // add more locators here

  constructor(page: Page) {
    super(page)
  }
}
