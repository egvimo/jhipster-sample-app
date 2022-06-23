import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'abc-0',
        data: { pageTitle: 'sampleApp.abc0.home.title' },
        loadChildren: () => import('./abc-0/abc-0.module').then(m => m.Abc0Module),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
