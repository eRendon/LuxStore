export interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number
  imageUrl: string
  tag?: 'Best Seller' | 'Sale'
  salePercentage?: number
  isFavorite: boolean
}