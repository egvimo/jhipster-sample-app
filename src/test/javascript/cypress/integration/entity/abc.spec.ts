import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Abc e2e test', () => {
  const abcPageUrl = '/abc';
  const abcPageUrlPattern = new RegExp('/abc(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const abcSample = { name: 'Ecuador Shoes' };

  let abc: any;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, username, password);
    });
    cy.intercept('GET', '/api/abcs').as('entitiesRequest');
    cy.visit('');
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abcs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abcs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abcs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abcs/${abc.id}`,
      }).then(() => {
        abc = undefined;
      });
    }
  });

  afterEach(() => {
    cy.oauthLogout();
    cy.clearCache();
  });

  it('Abcs menu should load Abcs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc').should('exist');
    cy.url().should('match', abcPageUrlPattern);
  });

  describe('Abc page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abcPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/abc/new$'));
        cy.getEntityCreateUpdateHeading('Abc');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abcPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abcs',
          body: abcSample,
        }).then(({ body }) => {
          abc = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abcs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abcPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abcPageUrlPattern);
      });

      it('edit button click should load edit Abc page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abcPageUrlPattern);
      });

      it('last delete button click should delete instance of Abc', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abcPageUrlPattern);

        abc = undefined;
      });
    });
  });

  describe('new Abc page', () => {
    beforeEach(() => {
      cy.visit(`${abcPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Abc');
    });

    it('should create an instance of Abc', () => {
      cy.get(`[data-cy="name"]`).type('Loan Verde').should('have.value', 'Loan Verde');

      cy.get(`[data-cy="otherField"]`).type('Account Industrial collaborative').should('have.value', 'Account Industrial collaborative');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abcPageUrlPattern);
    });
  });
});
