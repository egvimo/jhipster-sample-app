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

describe('Abc16 e2e test', () => {
  const abc16PageUrl = '/abc-16';
  const abc16PageUrlPattern = new RegExp('/abc-16(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const abc16Sample = { name: 'facilitate Kanada' };

  let abc16: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/abc-16-s+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/abc-16-s').as('postEntityRequest');
    cy.intercept('DELETE', '/api/abc-16-s/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (abc16) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/abc-16-s/${abc16.id}`,
      }).then(() => {
        abc16 = undefined;
      });
    }
  });

  it('Abc16s menu should load Abc16s page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('abc-16');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Abc16').should('exist');
    cy.url().should('match', abc16PageUrlPattern);
  });

  describe('Abc16 page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(abc16PageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Abc16 page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/abc-16/new$'));
        cy.getEntityCreateUpdateHeading('Abc16');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc16PageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/abc-16-s',
          body: abc16Sample,
        }).then(({ body }) => {
          abc16 = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/abc-16-s+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [abc16],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(abc16PageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Abc16 page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('abc16');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc16PageUrlPattern);
      });

      it('edit button click should load edit Abc16 page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Abc16');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc16PageUrlPattern);
      });

      it('last delete button click should delete instance of Abc16', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('abc16').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', abc16PageUrlPattern);

        abc16 = undefined;
      });
    });
  });

  describe('new Abc16 page', () => {
    beforeEach(() => {
      cy.visit(`${abc16PageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Abc16');
    });

    it('should create an instance of Abc16', () => {
      cy.get(`[data-cy="name"]`).type('Automotive Mouse').should('have.value', 'Automotive Mouse');

      cy.get(`[data-cy="otherField"]`).type('parse Namibia Frozen').should('have.value', 'parse Namibia Frozen');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        abc16 = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', abc16PageUrlPattern);
    });
  });
});
