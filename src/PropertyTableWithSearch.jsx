import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './SearchBar';
import { properties } from './data/properties';

const PropertyTableWithSearch = () => {
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const recordsPerPage = 30;

  // Load and process property data
  useEffect(() => {
    const loadPropertyData = () => {
      setLoading(true);
      
      try {
        console.log('Loading property data from imported module...');
        
        if (Array.isArray(properties) && properties.length > 0) {
          console.log('Successfully loaded property data:', {
            dataType: typeof properties,
            isArray: Array.isArray(properties),
            length: properties.length,
            firstItem: properties[0]
          });
          
          setProcessedData(properties);
          setFilteredData(properties);
          setUsingFallbackData(false);
          setLoading(false);
        } else {
          throw new Error('Imported properties data is not a valid array or is empty');
        }
      } catch (error) {
        console.error('Error loading property data:', error);
        
        // Fallback sample data for demonstration
        const sampleData = [
          {
            area: 'JP Road',
            status: 'RTMI',
            projectName: 'Naman Habitat',
            configuration: '2bhk',
            carpet: '769',
            pricing: '3.24cr all in',
            elevation: '2B+4P+15',
            flatsLifts: '4flats/2lifts',
            amenities: 'All Amenities',
            possession: 'Part OC Received'
          },
          {
            area: 'JP Road',
            status: 'UC',
            projectName: 'Alpine Primo',
            configuration: '1bhk',
            carpet: '423',
            pricing: '1.55cr all in',
            elevation: 'G+2P+14',
            flatsLifts: '5flats/2lifts',
            amenities: 'All Amenities',
            possession: 'Dec 2025'
          },
          {
            area: 'Lokhandwala',
            status: 'NP',
            projectName: '72 West',
            configuration: '2bhk',
            carpet: '783',
            pricing: '3.05cr all in',
            elevation: 'G+35',
            flatsLifts: '6flats/5lifts',
            amenities: 'All Amenities',
            possession: 'Dec 2025'
          }
        ];
        
        console.log('Using fallback sample data:', sampleData);
        setUsingFallbackData(true);
        setProcessedData(sampleData);
        setFilteredData(sampleData);
        setLoading(false);
      }
    };

    loadPropertyData();
  }, []);

  // Handle filtered data change from SearchBar
  const handleFilteredDataChange = useCallback((filtered, searchTerm = '') => {
    const isCurrentlySearching = searchTerm.trim() !== '';
    const dataLengthChanged = filtered.length !== filteredData.length;
    const shouldResetPage = isCurrentlySearching || dataLengthChanged;
    
    console.log('📊 Filter Change:', {
      previousDataLength: filteredData.length,
      newDataLength: filtered.length,
      previousCurrentPage: currentPage,
      searchTerm,
      isSearching: isCurrentlySearching,
      willUsePagination: !isCurrentlySearching,
      shouldResetPage,
      dataLengthChanged,
      reason: shouldResetPage ? (isCurrentlySearching ? 'searching' : 'data changed') : 'no reset needed',
      stackTrace: new Error().stack.split('\n').slice(1, 4) // Show where this was called from
    });
    
    setFilteredData(filtered);
    setIsSearching(isCurrentlySearching);
    
    // Only reset pagination if we're actually searching or if the data length changed
    if (shouldResetPage) {
      console.log('⚠️ Resetting currentPage to 1 because:', shouldResetPage ? (isCurrentlySearching ? 'user is searching' : 'data length changed') : 'unknown');
      setCurrentPage(1);
    } else {
      console.log('✅ NOT resetting currentPage, staying on page:', currentPage);
    }
  }, [filteredData.length, currentPage]); // Only depend on filteredData.length and currentPage

  // Handle pagination reset
  const handlePaginationReset = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  const shouldUsePagination = !isSearching;
  const totalPages = shouldUsePagination ? Math.max(1, Math.ceil(filteredData.length / recordsPerPage)) : 1;
  
  // Validate and correct currentPage if needed
  const validCurrentPage = filteredData.length === 0 ? 1 : Math.max(1, Math.min(currentPage, totalPages));
  
  // When searching, show all results; when not searching, use pagination
  const startIndex = shouldUsePagination ? (validCurrentPage - 1) * recordsPerPage : 0;
  const endIndex = shouldUsePagination ? startIndex + recordsPerPage : filteredData.length;
  const currentRecords = filteredData.slice(startIndex, endIndex);
  
  // Debug logging for pagination
  console.log('🔍 Pagination Debug:', {
    isSearching,
    shouldUsePagination,
    originalCurrentPage: currentPage,
    validCurrentPage,
    totalPages,
    filteredDataLength: filteredData.length,
    recordsPerPage,
    startIndex,
    endIndex,
    currentRecordsLength: currentRecords.length,
    isValidPage: validCurrentPage >= 1 && validCurrentPage <= totalPages,
    pageWasCorrected: currentPage !== validCurrentPage,
    showingAllResults: !shouldUsePagination
  });
  
  // Ensure currentPage doesn't exceed totalPages when filteredData changes (only when using pagination)
  useEffect(() => {
    if (shouldUsePagination) {
      const totalPages = Math.ceil(filteredData.length / recordsPerPage);
      const shouldReset = currentPage > totalPages && totalPages > 0;
      
      console.log('🔄 Pagination Boundary Check:', {
        filteredDataLength: filteredData.length,
        currentPage,
        totalPages,
        recordsPerPage,
        shouldReset,
        reason: shouldReset ? 'currentPage > totalPages' : 'within bounds'
      });
      
      if (shouldReset) {
        console.log('⚠️ Resetting page from', currentPage, 'to 1');
        setCurrentPage(1);
      }
    }
  }, [shouldUsePagination, filteredData.length, currentPage, recordsPerPage]);
  
  // Auto-correct the page if it's invalid (only when not searching)
  useEffect(() => {
    if (shouldUsePagination && currentPage !== validCurrentPage && filteredData.length > 0) {
      console.log('⚠️ Auto-correcting page from', currentPage, 'to', validCurrentPage);
      setCurrentPage(validCurrentPage);
    }
  }, [shouldUsePagination, currentPage, validCurrentPage, filteredData.length]);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'RTMI':
        return 'bg-green-100 text-green-800';
      case 'UC':
        return 'bg-yellow-100 text-yellow-800';
      case 'NP':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Andheri West Properties
          </h1>
          <p className="mt-2 text-gray-600">
            Search and browse real estate listings in Andheri West
          </p>
          
          {/* Warning for fallback data */}
          {usingFallbackData && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Using Sample Data
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Unable to load full property database. Showing limited sample data. Check browser console for details.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Debug info */}
          <p className="text-sm text-gray-500 mt-1">
            Loaded {processedData.length} properties {usingFallbackData ? '(sample data)' : ''}
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          data={processedData}
          onFilteredDataChange={handleFilteredDataChange}
          onPaginationReset={handlePaginationReset}
        />

        {/* Search Results Info Banner */}
        {isSearching && filteredData.length > recordsPerPage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Showing all {filteredData.length} search results</span> - Pagination is disabled during search for better viewing experience.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Area
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Project Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Config
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Carpet
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Pricing
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Elevation
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Flats/Lifts
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Amenities
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Possession
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRecords.length > 0 ? (
                    currentRecords.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        {/* Area */}
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {row.area || '-'}
                        </td>
                        
                        {/* Status */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
                            {row.status || 'N/A'}
                          </span>
                        </td>
                        
                        {/* Project Name */}
                        <td className="px-3 py-3 text-sm font-medium text-gray-900">
                          {row.projectName || '-'}
                        </td>
                        
                        {/* Configuration */}
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {row.configuration ? (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                              {row.configuration}
                            </span>
                          ) : '-'}
                        </td>
                        
                        {/* Carpet */}
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {row.carpet || '-'}
                        </td>
                        
                        {/* Pricing */}
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {row.pricing || '-'}
                        </td>
                        
                        {/* Elevation */}
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {row.elevation || '-'}
                        </td>
                        
                        {/* Flats/Lifts */}
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {row.flatsLifts || '-'}
                        </td>
                        
                        {/* Amenities */}
                        <td className="px-3 py-3 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={row.amenities}>
                            {row.amenities || '-'}
                          </div>
                        </td>
                        
                        {/* Possession */}
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {row.possession || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">No properties found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - only show when not searching */}
          {shouldUsePagination && totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      console.log('📱 Previous Button:', { currentPage, newPage, totalPages });
                      setCurrentPage(newPage);
                    }}
                    disabled={validCurrentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      console.log('📱 Next Button:', { currentPage, newPage, totalPages, canGoNext: currentPage < totalPages });
                      setCurrentPage(newPage);
                    }}
                    disabled={validCurrentPage === totalPages || totalPages === 0}
                    className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {isSearching ? (
                        <>
                          Showing all <span className="font-medium">{filteredData.length}</span> search results
                          <span className="text-xs text-green-600 ml-2 font-medium">(No pagination during search)</span>
                        </>
                      ) : (
                        <>
                          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of{' '}
                          <span className="font-medium">{filteredData.length}</span> properties
                          <span className="text-xs text-gray-500 ml-2">(Page {validCurrentPage} of {totalPages})</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => {
                          const newPage = Math.max(1, currentPage - 1);
                          console.log('🔙 Desktop Previous:', { currentPage, newPage, totalPages });
                          setCurrentPage(newPage);
                        }}
                        disabled={validCurrentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      {(() => {
                        const maxVisiblePages = 5;
                        const halfVisible = Math.floor(maxVisiblePages / 2);
                        
                        let startPage = Math.max(1, validCurrentPage - halfVisible);
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        // Adjust startPage if we're near the end
                        if (endPage - startPage < maxVisiblePages - 1) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }
                        
                        const pageNumbers = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(i);
                        }
                        
                        return pageNumbers.map(pageNum => {
                          const isCurrentPage = validCurrentPage === pageNum;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                console.log('🔢 Page Number Click:', { 
                                  clickedPage: pageNum, 
                                  currentPage, 
                                  totalPages,
                                  filteredDataLength: filteredData.length 
                                });
                                setCurrentPage(pageNum);
                              }}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                                isCurrentPage
                                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        });
                      })()} 
                      
                      {/* Show ellipsis and last page if needed */}
                      {totalPages > 5 && validCurrentPage < totalPages - 2 && (
                        <>
                          {validCurrentPage < totalPages - 3 && (
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => {
                          const newPage = Math.min(totalPages, currentPage + 1);
                          console.log('🔜 Desktop Next:', { 
                            currentPage, 
                            newPage, 
                            totalPages, 
                            canGoNext: currentPage < totalPages,
                            filteredDataLength: filteredData.length 
                          });
                          setCurrentPage(newPage);
                        }}
                        disabled={validCurrentPage === totalPages || totalPages === 0}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyTableWithSearch;