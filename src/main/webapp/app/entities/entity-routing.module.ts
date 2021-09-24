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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
