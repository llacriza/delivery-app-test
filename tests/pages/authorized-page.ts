import { BasePage } from './base-page'
import { Locator, Page } from '@playwright/test'

export class AuthorizedPage extends BasePage {
  readonly logoutButton: Locator
  readonly statusButton: Locator
  readonly statusSearchInput: Locator
  readonly statusSearchButton: Locator
  readonly statusSearchCloseButton: Locator
  readonly createOrderButton : Locator
  readonly userInputField : Locator
  readonly phoneInputField : Locator
  readonly commentInputField : Locator
  readonly orderSearchInputField : Locator
  readonly orderSearchPopUpButton : Locator

  constructor(page: Page) {
    super(page)
    this.logoutButton = page.getByTestId('logout-button')
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.statusSearchInput = page.getByTestId('searchOrder-input')
    this.statusSearchButton = page.getByTestId('searchOrder-submitButton')
    this.statusSearchCloseButton = page.getByTestId('searchOrder-popup-close-button')
    this.createOrderButton = page.getByTestId('createOrder-button')
    this.userInputField = page.getByTestId('username-input')
    this.phoneInputField = page.getByTestId('phone-input')
    this.commentInputField = page.getByTestId('comment-input')
    this.orderSearchInputField = page.getByTestId('searchOrder-input')
    this.orderSearchPopUpButton = page.getByTestId('searchOrder-submitButton')
  }
}
