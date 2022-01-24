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

describe('Sprint e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Sprints', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Sprint').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Sprint page', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('sprint');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Sprint page', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Sprint');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Sprint page', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Sprint');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Sprint', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Sprint');

    cy.get(`[data-cy="title"]`).type('asimétrica', { force: true }).invoke('val').should('match', new RegExp('asimétrica'));

    cy.get(`[data-cy="createdAt"]`).type('2021-11-01').should('have.value', '2021-11-01');

    cy.get(`[data-cy="dueOn"]`).type('2021-11-01').should('have.value', '2021-11-01');

    cy.get(`[data-cy="status"]`).select('FAIL');

    cy.get(`[data-cy="description"]`).type('Metal', { force: true }).invoke('val').should('match', new RegExp('Metal'));

    cy.setFieldSelectToLastOfEntity('proyect');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/sprints*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Sprint', () => {
    cy.intercept('GET', '/api/sprints*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/sprints/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('sprint');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('sprint').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/sprints*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('sprint');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
