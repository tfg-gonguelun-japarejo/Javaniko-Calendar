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

describe('Workspace e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Workspaces', () => {
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Workspace').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Workspace page', () => {
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('workspace');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Workspace page', () => {
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Workspace');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Workspace page', () => {
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Workspace');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Workspace', () => {
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Workspace');

    cy.get(`[data-cy="login"]`).type('navigate AGP', { force: true }).invoke('val').should('match', new RegExp('navigate AGP'));

    cy.get(`[data-cy="repos_url"]`).type('Card América', { force: true }).invoke('val').should('match', new RegExp('Card América'));

    cy.get(`[data-cy="description"]`)
      .type('Auto Queso DirectorX', { force: true })
      .invoke('val')
      .should('match', new RegExp('Auto Queso DirectorX'));

    cy.setFieldSelectToLastOfEntity('usuario');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Workspace', () => {
    cy.intercept('GET', '/api/workspaces*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/workspaces/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('workspace');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('workspace').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/workspaces*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('workspace');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
