import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AbcComponentsPage, AbcDeleteDialog, AbcUpdatePage } from './abc.page-object';

const expect = chai.expect;

describe('Abc e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let abcComponentsPage: AbcComponentsPage;
  let abcUpdatePage: AbcUpdatePage;
  let abcDeleteDialog: AbcDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Abcs', async () => {
    await navBarPage.goToEntity('abc');
    abcComponentsPage = new AbcComponentsPage();
    await browser.wait(ec.visibilityOf(abcComponentsPage.title), 5000);
    expect(await abcComponentsPage.getTitle()).to.eq('sampleApp.abc.home.title');
    await browser.wait(ec.or(ec.visibilityOf(abcComponentsPage.entities), ec.visibilityOf(abcComponentsPage.noResult)), 1000);
  });

  it('should load create Abc page', async () => {
    await abcComponentsPage.clickOnCreateButton();
    abcUpdatePage = new AbcUpdatePage();
    expect(await abcUpdatePage.getPageTitle()).to.eq('sampleApp.abc.home.createOrEditLabel');
    await abcUpdatePage.cancel();
  });

  it('should create and save Abcs', async () => {
    const nbButtonsBeforeCreate = await abcComponentsPage.countDeleteButtons();

    await abcComponentsPage.clickOnCreateButton();

    await promise.all([abcUpdatePage.setNameInput('name'), abcUpdatePage.setMyFieldWithValidationInput('myFieldWithValidation')]);

    expect(await abcUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await abcUpdatePage.getMyFieldWithValidationInput()).to.eq(
      'myFieldWithValidation',
      'Expected MyFieldWithValidation value to be equals to myFieldWithValidation'
    );

    await abcUpdatePage.save();
    expect(await abcUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await abcComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Abc', async () => {
    const nbButtonsBeforeDelete = await abcComponentsPage.countDeleteButtons();
    await abcComponentsPage.clickOnLastDeleteButton();

    abcDeleteDialog = new AbcDeleteDialog();
    expect(await abcDeleteDialog.getDialogTitle()).to.eq('sampleApp.abc.delete.question');
    await abcDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(abcComponentsPage.title), 5000);

    expect(await abcComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
