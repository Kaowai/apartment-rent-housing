import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { AdminComponent } from './admin/admin.component';
import { ExploreComponent } from './explore/explore.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApartmentManagementComponent } from './apartment-management/apartment-management.component';
import { UserComponent } from './user/user.component';
import { AccountComponent } from './account/account.component';
import { FavoriteComponent } from './favorite/favorite.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details',
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
      },
      {
        path: 'apartment-management',
        component: ApartmentManagementComponent,
        title: 'Apartment Management',
      },
      {
        path: 'user',
        component: UserComponent,
        title: 'User',
      },
      {
        path: 'account',
        component: AccountComponent,
        title: 'Account',
      },
    ],
  },
  {
    path: 'explore',
    component: ExploreComponent,
    title: 'Explore',
  },
  {
    path: 'favorite',
    component: FavoriteComponent,
    title: 'Favorite',
  },
];
