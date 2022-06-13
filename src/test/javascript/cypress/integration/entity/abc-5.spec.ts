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

describe('Abc5 e2e test', () => {
  const abc5PageUrl = '/abc-5';
  const abc5PageUrlPattern = new RegExp('/abc-5(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc5Sample = { name: 'program' };

  let abc5: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-5-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-5-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-5-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc5) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-5-s/${abc5.id}`,
      }).then(() => {
        abc5 = undefined;
      });
    }
  });

  it('Abc5s menu should load Abc5s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-5');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc5').should('exist');
    cy.url().should('match', abc5PageUrlPattern);
  });

  describe('Abc5 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc5PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc5 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-5/new$'));
        cy.getEntityCreateUpdateHeading('Abc5');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc5PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-5-s',
          body: abc5Sample,
        }).then(({ body }) => {
          abc5 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-5-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc5],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc5PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc5 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc5');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc5PageUrlPattern);
      });

      it('edit button click should load edit Abc5 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc5');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc5PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc5', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc5').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc5PageUrlPattern);

        abc5 = undefined;
      });
    });
  });

  describe('new Abc5 page', () => {
    beforeEach(() => {
      cy.visit(`${abc5PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc5');
    });

    it('should create an instance of Abc5', () => {
      cy.get(`[data-cy="name"]`).type('Loti methodologies withdrawal').should('have.value', 'Loti methodologies withdrawal');

      cy.get(`[data-cy="otherField"]`).type('Oman').should('have.value', 'Oman');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc5 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc5PageUrlPattern);
    });
  });
});
