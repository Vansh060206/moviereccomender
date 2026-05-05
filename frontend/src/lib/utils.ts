import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanMovieTitle(rawTitle: string): { cleanTitle: string; year: string } {
  let year = "";
  const yearMatch = rawTitle.match(/\((\d{4})\)$/);
  if (yearMatch) {
    year = yearMatch[1];
  }
  
  let cleanTitle = rawTitle.replace(/\(\d{4}\)$/, ''); // remove year
  cleanTitle = cleanTitle.replace(/\(.*?\)/g, ''); // remove alternative titles like (a.k.a. ...)
  cleanTitle = cleanTitle.trim();

  // Handle formats like "American President, The" -> "The American President"
  const articleMatch = cleanTitle.match(/^(.*),\s*(The|A|An)$/i);
  if (articleMatch) {
    cleanTitle = `${articleMatch[2]} ${articleMatch[1]}`;
  }
  
  return { cleanTitle, year };
}
