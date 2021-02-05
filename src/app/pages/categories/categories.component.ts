import { Category } from './../../core/interfaces/category';
import { AppService } from './../../core/services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  rootCatsItems:Array<Category> = [];
  popupIsOpen:boolean = false;
  addCatForm:FormGroup;
  constructor(private _AppService:AppService) { }

  ngOnInit(): void {
    //Load All Categories
    this.loadCategories();

    //Init FormGroup
    this.addCatForm = new FormGroup({
      rootCatName: new FormControl(null, Validators.required),
      subCatName: new FormControl(null, Validators.required)
    });
  }
  //Load All Categories with nested categories
  loadCategories() {
    this._AppService.getAllCategories().subscribe(items => {
      this.rootCatsItems = items;
    });
  }
  //Add New Category
  addNewCategory() {
    if (this.addCatForm.valid) {
      //create New Category Object
      let categoryInfo:Category = {
        "id": Number(this.rootCatsItems[this.rootCatsItems.length - 1].id) + 1,
        "name": this.rootCatName.value,
        "subCategories":
        [
          {
            "id": 1,
            "name": this.subCatName.value
          }
        ]
      }
      //add new category
      this._AppService.addNewCategory(categoryInfo)
      //reset input
      this.addCatForm.reset({
        rootCatName: null,
        subCatName: null
      });
      //close popup
      this.popupIsOpen = false;
      //Load Categories after adding new category
      this.loadCategories();
    }

  }
  //For *ngFor
  trackBy(index, item:Category) {
    return item.id
  }

  //shortname to get form items
  get rootCatName() {
    return this.addCatForm.get("rootCatName")
  }
  //shortname to get form items
  get subCatName() {
    return this.addCatForm.get("subCatName")
  }

}
