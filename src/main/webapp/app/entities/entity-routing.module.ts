import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'usuario',
        data: { pageTitle: 'javanikoCalendarApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'workspace',
        data: { pageTitle: 'javanikoCalendarApp.workspace.home.title' },
        loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule),
      },
      {
        path: 'proyect',
        data: { pageTitle: 'javanikoCalendarApp.proyect.home.title' },
        loadChildren: () => import('./proyect/proyect.module').then(m => m.ProyectModule),
      },
      {
        path: 'sprint',
        data: { pageTitle: 'javanikoCalendarApp.sprint.home.title' },
        loadChildren: () => import('./sprint/sprint.module').then(m => m.SprintModule),
      },
      {
        path: 'calendar',
        data: { pageTitle: 'javanikoCalendarApp.calendar.home.title' },
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
      },
      {
        path: 'input',
        data: { pageTitle: 'javanikoCalendarApp.input.home.title' },
        loadChildren: () => import('./input/input.module').then(m => m.InputModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
