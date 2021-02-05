import { CategoryComponent } from './pages/category/category.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:"", component: CategoriesComponent},
  {path:"category/:rootCatId/:subCatId", component: CategoryComponent},
  {path:"**", redirectTo: "", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
