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

describe('Abc28 e2e test', () => {
  const abc28PageUrl = '/abc-28';
  const abc28PageUrlPattern = new RegExp('/abc-28(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc28Sample = { name: 'system hardware' };

  let abc28: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-28-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-28-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-28-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc28) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-28-s/${abc28.id}`,
      }).then(() => {
        abc28 = undefined;
      });
    }
  });

  it('Abc28s menu should load Abc28s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-28');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc28').should('exist');
    cy.url().should('match', abc28PageUrlPattern);
  });

  describe('Abc28 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc28PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc28 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-28/new$'));
        cy.getEntityCreateUpdateHeading('Abc28');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc28PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-28-s',
          body: abc28Sample,
        }).then(({ body }) => {
          abc28 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-28-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc28],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc28PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc28 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc28');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc28PageUrlPattern);
      });

      it('edit button click should load edit Abc28 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc28');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc28PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc28', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc28').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc28PageUrlPattern);

        abc28 = undefined;
      });
    });
  });

  describe('new Abc28 page', () => {
    beforeEach(() => {
      cy.visit(`${abc28PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc28');
    });

    it('should create an instance of Abc28', () => {
      cy.get(`[data-cy="name"]`).type('Consultant Sri USB').should('have.value', 'Consultant Sri USB');

      cy.get(`[data-cy="otherField"]`).type('Hat').should('have.value', 'Hat');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc28 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc28PageUrlPattern);
    });
  });
});
