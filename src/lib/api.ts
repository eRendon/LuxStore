import type { Product, ProductsResponse } from "./types"

const BASE_URL = "https://dummyjson.com"

export async function getProducts(
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images`
  )
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export async function searchProducts(
  query: string,
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  )
  if (!res.ok) throw new Error("Failed to search products")
  return res.json()
}

export async function getProductsByCategory(
  category: string,
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  )
  if (!res.ok) throw new Error("Failed to fetch products by category")
  return res.json()
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`)
  if (!res.ok) throw new Error("Failed to fetch product")
  return res.json()
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/category-list`)
  if (!res.ok) throw new Error("Failed to fetch categories")
  return res.json()
}
