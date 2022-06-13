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

describe('Abc13 e2e test', () => {
  const abc13PageUrl = '/abc-13';
  const abc13PageUrlPattern = new RegExp('/abc-13(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc13Sample = { name: 'Mount user magenta' };

  let abc13: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-13-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-13-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-13-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc13) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-13-s/${abc13.id}`,
      }).then(() => {
        abc13 = undefined;
      });
    }
  });

  it('Abc13s menu should load Abc13s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-13');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc13').should('exist');
    cy.url().should('match', abc13PageUrlPattern);
  });

  describe('Abc13 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc13PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc13 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-13/new$'));
        cy.getEntityCreateUpdateHeading('Abc13');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc13PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-13-s',
          body: abc13Sample,
        }).then(({ body }) => {
          abc13 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-13-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc13],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc13PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc13 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc13');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc13PageUrlPattern);
      });

      it('edit button click should load edit Abc13 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc13');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc13PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc13', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc13').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc13PageUrlPattern);

        abc13 = undefined;
      });
    });
  });

  describe('new Abc13 page', () => {
    beforeEach(() => {
      cy.visit(`${abc13PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc13');
    });

    it('should create an instance of Abc13', () => {
      cy.get(`[data-cy="name"]`).type('enterprise Administrator Table').should('have.value', 'enterprise Administrator Table');

      cy.get(`[data-cy="otherField"]`).type('Bedfordshire').should('have.value', 'Bedfordshire');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc13 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc13PageUrlPattern);
    });
  });
});
