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

describe('Abc7 e2e test', () => {
  const abc7PageUrl = '/abc-7';
  const abc7PageUrlPattern = new RegExp('/abc-7(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc7Sample = { name: 'Cloned' };

  let abc7: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-7-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-7-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-7-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc7) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-7-s/${abc7.id}`,
      }).then(() => {
        abc7 = undefined;
      });
    }
  });

  it('Abc7s menu should load Abc7s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-7');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc7').should('exist');
    cy.url().should('match', abc7PageUrlPattern);
  });

  describe('Abc7 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc7PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc7 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-7/new$'));
        cy.getEntityCreateUpdateHeading('Abc7');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc7PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-7-s',
          body: abc7Sample,
        }).then(({ body }) => {
          abc7 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-7-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc7],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc7PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc7 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc7');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc7PageUrlPattern);
      });

      it('edit button click should load edit Abc7 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc7');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc7PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc7', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc7').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc7PageUrlPattern);

        abc7 = undefined;
      });
    });
  });

  describe('new Abc7 page', () => {
    beforeEach(() => {
      cy.visit(`${abc7PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc7');
    });

    it('should create an instance of Abc7', () => {
      cy.get(`[data-cy="name"]`).type('Intranet Irak Rubber').should('have.value', 'Intranet Irak Rubber');

      cy.get(`[data-cy="otherField"]`).type('reboot transmitting Square').should('have.value', 'reboot transmitting Square');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc7 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc7PageUrlPattern);
    });
  });
});
