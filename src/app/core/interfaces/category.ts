export interface Category {
  id?:number,
  name?: string,
  subCategories?:Array<Category>
}
