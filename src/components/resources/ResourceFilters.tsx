import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { useResourceCategories } from '@/hooks/useResourceManagement';

interface ResourceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  types: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  difficulties: string[];
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  types,
  selectedType,
  onTypeChange,
  difficulties,
  selectedDifficulty,
  onDifficultyChange
}) => {
  const resourceTypes = [
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'video', label: 'Videos' },
    { value: 'template', label: 'Templates' },
    { value: 'guide', label: 'Guides' },
    { value: 'tool', label: 'Tools' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('');
    onTypeChange('');
    onDifficultyChange('');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedType || selectedDifficulty;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-blue-700 border-blue-600 text-white placeholder-blue-300"
        />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-blue-200 text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory || 'all'} onValueChange={(value) => onCategoryChange(value === 'all' ? '' : value)}>
            <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 z-50">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-blue-200 text-sm font-medium mb-2 block">Type</label>
          <Select value={selectedType || 'all'} onValueChange={(value) => onTypeChange(value === 'all' ? '' : value)}>
            <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 z-50">
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-blue-200 text-sm font-medium mb-2 block">Difficulty</label>
          <Select value={selectedDifficulty || 'all'} onValueChange={(value) => onDifficultyChange(value === 'all' ? '' : value)}>
            <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 z-50">
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
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
          {selectedType && (
            <Badge variant="secondary" className="bg-blue-700 text-blue-200">
              Type: {types.find(t => t === selectedType)}
            </Badge>
          )}
          {selectedDifficulty && (
            <Badge variant="secondary" className="bg-blue-700 text-blue-200">
              Level: {difficulties.find(d => d === selectedDifficulty)}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-400 hover:text-blue-300"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResourceFilters;