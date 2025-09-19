import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ 
  data = [], 
  onFilteredDataChange, 
  onPaginationReset,
  fieldLabels = {
    area: 'Area',
    status: 'Status', 
    projectName: 'Project Name',
    configuration: 'Configuration',
    carpet: 'Carpet',
    pricing: 'Pricing',
    elevation: 'Elevation',
    flatsLifts: 'Flats/Lifts',
    amenities: 'Amenities',
    possession: 'Possession'
  }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Enhanced filter function that supports multi-term search and abbreviations
  const filterData = useCallback((searchValue) => {
    if (!searchValue.trim()) {
      return data;
    }

    // Split search terms by comma, space, or both, and clean up
    const searchTerms = searchValue
      .toLowerCase()
      .split(/[,\s]+/) // Split by comma and/or whitespace
      .map(term => term.trim())
      .filter(term => term.length > 0); // Remove empty terms
    
    if (searchTerms.length === 0) {
      return data;
    }
    
    // Status abbreviation mapping
    const statusAbbreviations = {
      'uc': ['under construction', 'uc'],
      'rtmi': ['ready to move in', 'rtmi'],
      'np': ['nearing possession', 'np']
    };
    
    return data.filter(row => {
      // For each search term, check if it matches any field in the row
      return searchTerms.every(searchTerm => {
        // Check if the search term is a status abbreviation
        const expandedTerms = statusAbbreviations[searchTerm] || [searchTerm];
        
        // Each search term (or its expanded forms) must match at least one field
        return expandedTerms.some(term => {
          return Object.entries(fieldLabels).some(([fieldKey, fieldLabel]) => {
            const fieldValue = row[fieldKey];
            if (fieldValue === null || fieldValue === undefined) return false;
            
            // Convert to string and perform case-insensitive search
            const valueString = String(fieldValue).toLowerCase();
            
            // Special handling for status field to match both abbreviation and full text
            if (fieldKey === 'status' && fieldValue) {
              const statusUpper = String(fieldValue).toUpperCase();
              const statusFull = getStatusText(statusUpper).toLowerCase();
              
              // Check if term matches abbreviation or full status text
              return statusUpper.toLowerCase().includes(term) || 
                     statusFull.includes(term);
            }
            
            return valueString.includes(term);
          });
        });
      });
    });
  }, [data, fieldLabels]);
  
  // Helper function to get full status text (matching the main component)
  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'RTMI':
        return 'Ready to Move In';
      case 'UC':
        return 'Under Construction';
      case 'NP':
        return 'Nearing Possession';
      default:
        return status || 'N/A';
    }
  };

  // Handle search input change with real-time filtering
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    const filtered = filterData(newSearchTerm);
    setFilteredData(filtered);
    
    console.log('🔍 SearchBar Filter:', {
      searchTerm: newSearchTerm,
      originalDataLength: data.length,
      filteredDataLength: filtered.length,
      removedItems: data.length - filtered.length
    });
    
    // Pass filtered data and search term to parent component
    if (onFilteredDataChange) {
      onFilteredDataChange(filtered, newSearchTerm);
    }
  };

  // Reset search functionality
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredData(data);
    
    if (onFilteredDataChange) {
      onFilteredDataChange(data, ''); // Pass empty search term
    }
  };

  // Reset pagination when search term changes
  useEffect(() => {
    if (onPaginationReset) {
      onPaginationReset();
    }
  }, [searchTerm, onPaginationReset]);

  // Update filtered data when source data changes
  useEffect(() => {
    const filtered = filterData(searchTerm);
    setFilteredData(filtered);
    
    if (onFilteredDataChange) {
      onFilteredDataChange(filtered, searchTerm);
    }
  }, [filterData, searchTerm, onFilteredDataChange]);

  // Determine if we're in filtered state
  const isFiltered = searchTerm.trim() !== '';
  const hasResults = filteredData.length > 0;
  const totalRecords = data.length;
  const filteredCount = filteredData.length;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      {/* Search Input Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search multiple terms: e.g., 'SV road, 2 bhk, gym'"
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
          
          {/* Clear Button */}
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Search Results Summary */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Results Counter */}
            <span className="text-sm text-gray-600">
              {isFiltered ? (
                <>
                  <span className="font-medium text-blue-600">{filteredCount}</span>
                  <span> of </span>
                  <span className="font-medium">{totalRecords}</span>
                  <span> records</span>
                </>
              ) : (
                <>
                  <span className="font-medium">{totalRecords}</span>
                  <span> total records</span>
                </>
              )}
            </span>

            {/* Filtered State Badge */}
            {isFiltered && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                hasResults 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hasResults ? 'Filtered' : 'No matches'}
              </span>
            )}
          </div>

          {/* Active Search Indicator */}
          {isFiltered && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                Terms: 
              </span>
              <div className="flex flex-wrap gap-1">
                {searchTerm.toLowerCase().split(/[,\s]+/).map(term => term.trim()).filter(term => term.length > 0).map((term, index) => (
                  <span key={index} className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State Message */}
        {isFiltered && !hasResults && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="text-center">
              <MagnifyingGlassIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No properties found
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Try adjusting your search terms or browse all listings
              </p>
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors duration-200"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Search Tips */}
        {!isFiltered && (
          <div className="mt-3 text-xs text-gray-500 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span>🔍 <strong>Multi-term search:</strong> Use spaces or commas to search multiple criteria</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span>✨ <strong>Examples:</strong></span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">"JP Road, 2bhk"</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">"uc, 3bhk"</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">"rtmi, gym"</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">"np, Lokhandwala"</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span>🏷️ <strong>Status shortcuts:</strong></span>
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">"uc" = Under Construction</span>
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">"rtmi" = Ready to Move In</span>
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">"np" = Nearing Possession</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span>💡 <strong>Search fields:</strong></span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Area</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Status</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Project Name</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Configuration</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Amenities</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">Pricing</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">+ more</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;