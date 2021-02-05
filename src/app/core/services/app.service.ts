import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../interfaces/category';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  demoItems =
  {
    //Start Categories
    "categories": [
      //cat (1)
      {
        "id": 1,
        "name": "Sports",
        "subCategories":
        [
          {
            "id": 1,
            "name": "Strength & Weights"
          },
          {
            "id": 2,
            "name": "Men's Sportswear"
          }
        ]
      },
      //cat (2)
      {
        "id": 2,
        "name": "Health & Beauty",
        "subCategories":
        [
          {
            "id": 1,
            "name": "Cosmetics"
          },
          {
            "id": 2,
            "name": "Skin care"
          }
        ]
      },
    ],
    //End Categories
    //Start Products
    "products": [
      {"id": 1, "name": "Classical Head Vinyl Dumbbell Set", "code": "Product Code", "price": 100, "rootCatId": 1, "subCatId": 1},
      {"id": 2, "name": "york Power Dumbbell Set 50 KG", "code": "Product Code", "price": 200, "rootCatId": 1, "subCatId": 1},
      {"id": 3, "name": "adidas Weft knitted Regista 18 Sports Jersey for Men - Bold Blue/White", "code": "Product Code", "price": 150, "rootCatId": 1, "subCatId": 2},
      {"id": 4, "name": "Cybele Nail Polish Lacquer 88 - 8.5ml", "code": "Product Code", "price": 21, "rootCatId": 2, "subCatId": 1},
      {"id": 5, "name": "Johnson's Vita-Rich Smoothies Comforting Body Cream", "code": "Product Code", "price": 21, "rootCatId": 2, "subCatId": 2},
      {"id": 6, "name": "Avene Cicalfate Repair Cream", "code": "Product Code", "price": 230, "rootCatId": 2, "subCatId": 2},
      {"id": 7, "name": "Classical Head Vinyl Dumbbell Set", "code": "Product Code", "price": 100, "rootCatId": 1, "subCatId": 1},
      {"id": 8, "name": "york Power Dumbbell Set 50 KG", "code": "Product Code", "price": 200, "rootCatId": 1, "subCatId": 1},
      {"id": 9, "name": "adidas Weft knitted Regista 18 Sports Jersey for Men - Bold Blue/White", "code": "Product Code", "price": 150, "rootCatId": 1, "subCatId": 2},
      {"id": 10, "name": "Cybele Nail Polish Lacquer 88 - 8.5ml", "code": "Product Code", "price": 21, "rootCatId": 2, "subCatId": 1},
      {"id": 11, "name": "Johnson's Vita-Rich Smoothies Comforting Body Cream", "code": "Product Code", "price": 21, "rootCatId": 2, "subCatId": 2},
      {"id": 12, "name": "Avene Cicalfate Repair Cream", "code": "Product Code", "price": 230, "rootCatId": 2, "subCatId": 2},
    ]
    //End Products
  }
  //All Categories
  categories:BehaviorSubject<Array<Category>> = new BehaviorSubject(null);
  //It Saved the current page products, not all products
  products:BehaviorSubject<Array<Product>> = new BehaviorSubject(null);

  constructor() {
    this.loadAllItems();
  }

  /**
   * Set demoItems to localStorage
   * Demo Items will set into the localStorage if it's the first time opening the site
   * If a user visit the site before, it just will get the localStorage Items
   */
  loadAllItems() {
    if (localStorage.getItem("listItems") == null) {
      localStorage.setItem("listItems", JSON.stringify(this.demoItems));
      this.categories.next(this.demoItems.categories);
    } else {
      this.getLocalStorageItems();
    }
  }

  //Get Data From LocalStorage
  getLocalStorageItems() {
    this.demoItems = JSON.parse(localStorage.getItem("listItems"));
  }
  //Update LocalStorage with new Items
  updateLocalStorageItems() {
    localStorage.setItem("listItems", JSON.stringify(this.demoItems));
  }

  /**
   * Get All Categories included nested categories
   */
  getAllCategories() {
    this.categories.next(this.demoItems.categories);
    return this.categories;
  }
  /**
   * Add New Category
   * @param categoryInfo => object of category information
   */
  addNewCategory(categoryInfo) {
    this.demoItems.categories.push(categoryInfo);
    //Update LocalStorage with new Items
    this.updateLocalStorageItems();
  }

  //return current products categories [rootCategory, subCategory]
  getCategoryName(rootCatId, subCatId) {
    let rootCatDetails = this.demoItems.categories.filter(item => item.id == rootCatId)[0];
    let subCatDetails =  rootCatDetails.subCategories.filter(item => item.id == subCatId)[0];
    if (rootCatDetails && subCatDetails) {
      return [rootCatDetails.name, subCatDetails.name];
    } else {
      return [];
    }
  }

  /**
   * Get All Categories included nested categories
   */
  getProducts(rootCatId, subCatId, pageNumber = 1) {
    let products:Array<Product> = this.demoItems.products.filter(item => item.rootCatId == rootCatId && item.subCatId == subCatId).splice((pageNumber * 3) - 3, pageNumber * 3);
    this.products.next(products);
    return this.products;
  }

  //add new product and update it in localStorage
  addNewProduct(productInfo) {
    this.demoItems.products.push(productInfo);
    this.updateLocalStorageItems();
  }

  //Get the Array without deleted products and then update localStorage
  deleteProducts(productsList) {
    let products = this.demoItems.products.filter(item => !productsList.includes(item.id));
    this.demoItems.products = products;
    this.updateLocalStorageItems();
  }

  //Return Product details by id, it called when click update button
  getProductById(productId) {
    return this.demoItems.products.filter(item => item.id == productId)[0];
  }

  //Update product and then update localStorage
  saveEditedProduct(prodId, productInfo) {
    this.demoItems.products.map(item => {
      if (item.id == prodId) {
        item.name = productInfo.name;
        item.price = productInfo.price;
      }
    });
    this.updateLocalStorageItems();
  }

  /**
   * Return Array of pages, if we have 3 pages it will return [1,2,3]
   * the products on the page is 3 products
   * if the products less than or equal to 3 products will return empty array
   * @param rootCatId
   * @param subCatId
   */
  getPaginationNumbers(rootCatId, subCatId) {
    //Get Current Page Pages
    let allProducts = this.demoItems.products.filter(item => item.rootCatId == rootCatId && item.subCatId == subCatId);
    //Products on a page
    const productPerPage = 3;
    //How Many Pages
    let pagesNumber = 0;
    //Array to save pages like this => [1, 2, 3]
    let pagesArray = [];
    //If products greater than 3 will calculate how many pages
    if (allProducts.length > productPerPage) {
      pagesNumber = Math.ceil(allProducts.length / productPerPage);
      //pagesNumber will return just the number, here will converting to an array
      for (let i = 1; i <= pagesNumber; i++) {
        pagesArray.push(i);
      }
    }
    //Note: If products less than or equal to 3 that mean it's will be One page, so will return an Empty Array []
    return pagesArray;
  }
}
