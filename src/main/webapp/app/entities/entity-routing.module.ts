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
        path: 'abc-0',
        data: { pageTitle: 'sampleApp.abc0.home.title' },
        loadChildren: () => import('./abc-0/abc-0.module').then(m => m.Abc0Module),
      },
      {
        path: 'abc-1',
        data: { pageTitle: 'sampleApp.abc1.home.title' },
        loadChildren: () => import('./abc-1/abc-1.module').then(m => m.Abc1Module),
      },
      {
        path: 'abc-2',
        data: { pageTitle: 'sampleApp.abc2.home.title' },
        loadChildren: () => import('./abc-2/abc-2.module').then(m => m.Abc2Module),
      },
      {
        path: 'abc-3',
        data: { pageTitle: 'sampleApp.abc3.home.title' },
        loadChildren: () => import('./abc-3/abc-3.module').then(m => m.Abc3Module),
      },
      {
        path: 'abc-4',
        data: { pageTitle: 'sampleApp.abc4.home.title' },
        loadChildren: () => import('./abc-4/abc-4.module').then(m => m.Abc4Module),
      },
      {
        path: 'abc-5',
        data: { pageTitle: 'sampleApp.abc5.home.title' },
        loadChildren: () => import('./abc-5/abc-5.module').then(m => m.Abc5Module),
      },
      {
        path: 'abc-6',
        data: { pageTitle: 'sampleApp.abc6.home.title' },
        loadChildren: () => import('./abc-6/abc-6.module').then(m => m.Abc6Module),
      },
      {
        path: 'abc-7',
        data: { pageTitle: 'sampleApp.abc7.home.title' },
        loadChildren: () => import('./abc-7/abc-7.module').then(m => m.Abc7Module),
      },
      {
        path: 'abc-8',
        data: { pageTitle: 'sampleApp.abc8.home.title' },
        loadChildren: () => import('./abc-8/abc-8.module').then(m => m.Abc8Module),
      },
      {
        path: 'abc-9',
        data: { pageTitle: 'sampleApp.abc9.home.title' },
        loadChildren: () => import('./abc-9/abc-9.module').then(m => m.Abc9Module),
      },
      {
        path: 'abc-10',
        data: { pageTitle: 'sampleApp.abc10.home.title' },
        loadChildren: () => import('./abc-10/abc-10.module').then(m => m.Abc10Module),
      },
      {
        path: 'abc-11',
        data: { pageTitle: 'sampleApp.abc11.home.title' },
        loadChildren: () => import('./abc-11/abc-11.module').then(m => m.Abc11Module),
      },
      {
        path: 'abc-12',
        data: { pageTitle: 'sampleApp.abc12.home.title' },
        loadChildren: () => import('./abc-12/abc-12.module').then(m => m.Abc12Module),
      },
      {
        path: 'abc-13',
        data: { pageTitle: 'sampleApp.abc13.home.title' },
        loadChildren: () => import('./abc-13/abc-13.module').then(m => m.Abc13Module),
      },
      {
        path: 'abc-14',
        data: { pageTitle: 'sampleApp.abc14.home.title' },
        loadChildren: () => import('./abc-14/abc-14.module').then(m => m.Abc14Module),
      },
      {
        path: 'abc-15',
        data: { pageTitle: 'sampleApp.abc15.home.title' },
        loadChildren: () => import('./abc-15/abc-15.module').then(m => m.Abc15Module),
      },
      {
        path: 'abc-16',
        data: { pageTitle: 'sampleApp.abc16.home.title' },
        loadChildren: () => import('./abc-16/abc-16.module').then(m => m.Abc16Module),
      },
      {
        path: 'abc-17',
        data: { pageTitle: 'sampleApp.abc17.home.title' },
        loadChildren: () => import('./abc-17/abc-17.module').then(m => m.Abc17Module),
      },
      {
        path: 'abc-18',
        data: { pageTitle: 'sampleApp.abc18.home.title' },
        loadChildren: () => import('./abc-18/abc-18.module').then(m => m.Abc18Module),
      },
      {
        path: 'abc-19',
        data: { pageTitle: 'sampleApp.abc19.home.title' },
        loadChildren: () => import('./abc-19/abc-19.module').then(m => m.Abc19Module),
      },
      {
        path: 'abc-20',
        data: { pageTitle: 'sampleApp.abc20.home.title' },
        loadChildren: () => import('./abc-20/abc-20.module').then(m => m.Abc20Module),
      },
      {
        path: 'abc-21',
        data: { pageTitle: 'sampleApp.abc21.home.title' },
        loadChildren: () => import('./abc-21/abc-21.module').then(m => m.Abc21Module),
      },
      {
        path: 'abc-22',
        data: { pageTitle: 'sampleApp.abc22.home.title' },
        loadChildren: () => import('./abc-22/abc-22.module').then(m => m.Abc22Module),
      },
      {
        path: 'abc-23',
        data: { pageTitle: 'sampleApp.abc23.home.title' },
        loadChildren: () => import('./abc-23/abc-23.module').then(m => m.Abc23Module),
      },
      {
        path: 'abc-24',
        data: { pageTitle: 'sampleApp.abc24.home.title' },
        loadChildren: () => import('./abc-24/abc-24.module').then(m => m.Abc24Module),
      },
      {
        path: 'abc-25',
        data: { pageTitle: 'sampleApp.abc25.home.title' },
        loadChildren: () => import('./abc-25/abc-25.module').then(m => m.Abc25Module),
      },
      {
        path: 'abc-26',
        data: { pageTitle: 'sampleApp.abc26.home.title' },
        loadChildren: () => import('./abc-26/abc-26.module').then(m => m.Abc26Module),
      },
      {
        path: 'abc-27',
        data: { pageTitle: 'sampleApp.abc27.home.title' },
        loadChildren: () => import('./abc-27/abc-27.module').then(m => m.Abc27Module),
      },
      {
        path: 'abc-28',
        data: { pageTitle: 'sampleApp.abc28.home.title' },
        loadChildren: () => import('./abc-28/abc-28.module').then(m => m.Abc28Module),
      },
      {
        path: 'abc-29',
        data: { pageTitle: 'sampleApp.abc29.home.title' },
        loadChildren: () => import('./abc-29/abc-29.module').then(m => m.Abc29Module),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
