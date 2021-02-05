import { Product } from './../../core/interfaces/product';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from './../../core/services/app.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  addProductForm:FormGroup;

  popupIsOpen:boolean = false;
  isEditMode:boolean = false;

  products:Array<Product> = [];
  categoryNames:Array<any> = [];//[rootCategory, subCategory]
  deleteItemsList:Array<number> = [];//[productId]
  paginationNumbers:Array<number> = [];// if 2 pages [1, 2]

  rootCatId:string = '';
  subCatId:string = '';

  editProductId:number = null;//change to productId when click edit
  pageNumber:number = 1;//Current Page Number

  constructor(private _AppService:AppService, private _ActivatedRoute:ActivatedRoute, private _Router:Router) { }

  ngOnInit(): void {
    //Get parameter from current URL
    this._ActivatedRoute.paramMap.subscribe(param => {
      this.rootCatId = param.get("rootCatId");
      this.subCatId = param.get("subCatId");
      this.loadProducts();
    });
    //Init New Form
    this.addProductForm = new FormGroup({
      productName: new FormControl(null, Validators.required),
      productPrice: new FormControl(null, Validators.required)
    });
  }

  //Load specific category Products with the active page number (page number 1 by default)
  loadProducts() {
    this._AppService.getProducts(this.rootCatId,this.subCatId, this.pageNumber).subscribe(items => {
      this.products = items;
      //Get Category Name and nested category name to show it on the head
      this.categoryNames = this._AppService.getCategoryName(this.rootCatId, this.subCatId);
      //If the category is not exist that mean there is no products
      if (this.categoryNames.length == 0) {
        this._Router.navigate(["/"]);
      }
      //Get Pagination List numbers
      this.paginationNumbers = this._AppService.getPaginationNumbers(this.rootCatId, this.subCatId);
    });
  }

  //For *ngFor
  trackBy(index, item:Product) {
    return item.id
  }
  //shortname to get form items
  get productName() {
    return this.addProductForm.get("productName");
  }
  //shortname to get form items
  get productPrice() {
    return this.addProductForm.get("productPrice");
  }

  //Add new Product
  addNewProduct() {
    if (this.addProductForm.valid) {
      //Create New Product Info
      let productInfo = {
      "id": Math.round(Math.random() * 50000000),
      "name": this.productName.value,
      "code": "Product Code",
      "price": this.productPrice.value,
      "rootCatId": this.rootCatId,
      "subCatId": this.subCatId
      }
      //add new category
      this._AppService.addNewProduct(productInfo);
      //reset input
      this.addProductForm.reset({
        productName: null,
        productPrice: null
      });
      //close popup
      this.popupIsOpen = false;
      //Load product after changes
      this.loadProducts();
    }
  }
  /**
   * When Click checkbox => add the productId to the deleting list
   * @param e => Event (Input[Checkbox])
   * @param productId
   */
  addToDeleteList(e, productId) {
    //If checkbox is checked
    if (e.target.checked) {
      this.deleteItemsList.push(productId);
    } else {
      //If not checked that mean remove the product id from array
      if (this.deleteItemsList.includes(productId)) {
        this.deleteItemsList = this.deleteItemsList.filter(item => item != productId);
      }
    }
  }
  //When Click delete products button
  deleteProducts() {
    //Trigger the delete function
    this._AppService.deleteProducts(this.deleteItemsList);
    //Clear the delete list
    this.deleteItemsList = [];
    //return to the first page
    this.pageNumber = 1;
    //load products after deleting
    this.loadProducts();
  }
  //Close the popup
  closePopup() {
    this.popupIsOpen = false;
    this.isEditMode = false;
    this.addProductForm.reset();
  }
  //Open the popup
  openPopup(editMode = false, productId = null) {
    this.popupIsOpen = true;
    this.isEditMode = editMode;
    this.editProductId = productId;
    if (editMode == true) {
      this.edit(productId);
    }
  }
  /**
   * Enable edit mode when click edit button
   * @param productId
   */
  edit(productId) {
    let product = this._AppService.getProductById(productId);
    this.productName.setValue(product.name);
    this.productPrice.setValue(product.price);
  }
  //Trigger after edit when user click the save button
  save() {
    this._AppService.saveEditedProduct(this.editProductId, {name: this.productName.value, price: this.productPrice.value});
    this.addProductForm.reset();
    this.popupIsOpen = false;
  }
  //Trigger When click the pagination buttons
  changePage(page) {
    this.pageNumber = page;
    this.loadProducts();
  }
}
