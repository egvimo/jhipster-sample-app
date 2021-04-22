import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'abc',
        data: { pageTitle: 'sampleApp.abc.home.title' },
        loadChildren: () => import('./abc/abc.module').then(m => m.AbcModule),
      },
      {
        path: 'xyz',
        data: { pageTitle: 'sampleApp.xyz.home.title' },
        loadChildren: () => import('./xyz/xyz.module').then(m => m.XyzModule),
      },
      {
        path: 'join-table',
        data: { pageTitle: 'sampleApp.joinTable.home.title' },
        loadChildren: () => import('./join-table/join-table.module').then(m => m.JoinTableModule),
      },
      {
        path: 'join-table-abc-xyz',
        data: { pageTitle: 'sampleApp.joinTableAbcXyz.home.title' },
        loadChildren: () => import('./join-table-abc-xyz/join-table-abc-xyz.module').then(m => m.JoinTableAbcXyzModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
