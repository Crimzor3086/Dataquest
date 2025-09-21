import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { useBlogCategories } from '@/hooks/useBlogManagement';

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const clearFilters = () => {
    setLocalSearch('');
    onSearchChange('');
    onCategoryChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search blog posts..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-blue-700 border-blue-600 text-white placeholder-blue-300"
          />
        </div>
        <Button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Search
        </Button>
      </form>

      {/* Category Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <span className="text-blue-200 text-sm font-medium">Categories:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === '' ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedCategory === '' 
                ? "bg-blue-600 text-white" 
                : "border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-white"
            }`}
            onClick={() => onCategoryChange('')}
          >
            All Posts
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedCategory === category.slug
                  ? "text-white border-0"
                  : "border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-white"
              }`}
              style={{
                backgroundColor: selectedCategory === category.slug ? (category.color || '#1e40af') : 'transparent',
                borderColor: category.color || '#1e40af'
              }}
              onClick={() => onCategoryChange(category.slug)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory) && (
        <div className="flex items-center gap-2">
          <span className="text-blue-200 text-sm">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="bg-blue-700 text-blue-200">
              Search: "{searchQuery}"
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="bg-blue-700 text-blue-200">
              Category: {categories.find(c => c.slug === selectedCategory)?.name}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-400 hover:text-blue-300"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogSearch;