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

describe('Abc20 e2e test', () => {
  const abc20PageUrl = '/abc-20';
  const abc20PageUrlPattern = new RegExp('/abc-20(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc20Sample = { name: 'Savings' };

  let abc20: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-20-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-20-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-20-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc20) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-20-s/${abc20.id}`,
      }).then(() => {
        abc20 = undefined;
      });
    }
  });

  it('Abc20s menu should load Abc20s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-20');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc20').should('exist');
    cy.url().should('match', abc20PageUrlPattern);
  });

  describe('Abc20 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc20PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc20 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-20/new$'));
        cy.getEntityCreateUpdateHeading('Abc20');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc20PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-20-s',
          body: abc20Sample,
        }).then(({ body }) => {
          abc20 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-20-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc20],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc20PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc20 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc20');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc20PageUrlPattern);
      });

      it('edit button click should load edit Abc20 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc20');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc20PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc20', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc20').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc20PageUrlPattern);

        abc20 = undefined;
      });
    });
  });

  describe('new Abc20 page', () => {
    beforeEach(() => {
      cy.visit(`${abc20PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc20');
    });

    it('should create an instance of Abc20', () => {
      cy.get(`[data-cy="name"]`).type('edge Soap').should('have.value', 'edge Soap');

      cy.get(`[data-cy="otherField"]`).type('Senior').should('have.value', 'Senior');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc20 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc20PageUrlPattern);
    });
  });
});
