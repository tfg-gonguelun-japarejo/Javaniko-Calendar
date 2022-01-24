import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Proyect e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/proyects*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Proyects', () => {
    cy.intercept('GET', '/api/proyects*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Proyect').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Proyect page', () => {
    cy.intercept('GET', '/api/proyects*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('proyect');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Proyect page', () => {
    cy.intercept('GET', '/api/proyects*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Proyect');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Proyect page', () => {
    cy.intercept('GET', '/api/proyects*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Proyect');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Proyect', () => {
    cy.intercept('GET', '/api/proyects*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Proyect');

    cy.get(`[data-cy="name"]`)
      .type('indexing Pound portals', { force: true })
      .invoke('val')
      .should('match', new RegExp('indexing Pound portals'));

    cy.get(`[data-cy="description"]`)
      .type('BalearesXXXXXXXXXXXX', { force: true })
      .invoke('val')
      .should('match', new RegExp('BalearesXXXXXXXXXXXX'));

    cy.get(`[data-cy="createdAt"]`).type('2021-11-01').should('have.value', '2021-11-01');

    cy.get(`[data-cy="isPrivate"]`).should('not.be.checked');
    cy.get(`[data-cy="isPrivate"]`).click().should('be.checked');
    cy.setFieldSelectToLastOfEntity('workspace');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/proyects*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Proyect', () => {
    cy.intercept('GET', '/api/proyects*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/proyects/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('proyect');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('proyect').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/proyects*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('proyect');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
