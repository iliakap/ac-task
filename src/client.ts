// Types for Open Library API responses
interface OpenLibraryDoc {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
  }
  
  interface OpenLibrarySearchResponse {
    numFound: number;
    start: number;
    docs: OpenLibraryDoc[];
  }
  
  interface Book {
    id: string;
    title: string;
    authors: string[];
    year?: number;
    coverUrl?: string;
  }
  
  interface SearchOptions {
    limit?: number;
  }
  
  // API Client
  class OpenLibraryClient {
    private baseURL = 'https://openlibrary.org/search.json';
  
    async searchBooks(
      query: string, 
      options: SearchOptions = {}
    ): Promise<Book[]> {
      if (!query.trim()) {
        return [];
      }
  
      const { limit = 10 } = options;
      
      const params = new URLSearchParams({
        title: query,
        limit: limit.toString(),
        fields: 'key,title,author_name,first_publish_year,cover_i',
      });
  
      try {
        const response = await fetch(`${this.baseURL}?${params}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data: OpenLibrarySearchResponse = await response.json();
        
        return this.transformResults(data.docs);
      } catch (error) {
        console.error('Search failed:', error);
        throw error;
      }
    }
  
    private transformResults(docs: OpenLibraryDoc[]): Book[] {
      return docs.map(doc => ({
        id: doc.key,
        title: doc.title,
        authors: doc.author_name || [],
        year: doc.first_publish_year,
        coverUrl: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
          : undefined,
      }));
    }
  }
  
  // Export singleton instance
  export const openLibraryClient = new OpenLibraryClient();
  
  // Export types
  export type { Book, SearchOptions };