import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(title: string) {
  return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
}

export function objectsKeyIntersectionDiff(object1: any, object2: any) {
  const diff: any = {}
  Object.keys(object1).forEach(key => {
   if (object1[key] !== object2[key]) {
     diff[key] = [object1[key], object2[key]];
   }
  })
  if (Object.keys(diff).length === 0)
    return null
  return diff
}