import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

const PropertyTableWithSearch = () => {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const recordsPerPage = 10;

  // Load and process property data
  useEffect(() => {
    const loadPropertyData = async () => {
      setLoading(true);
      try {
        console.log('Attempting to fetch /properties.json');
        const response = await fetch('/properties.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        console.log('Successfully loaded property data:', jsonData.length, 'records');
        setRawData(jsonData);
        setProcessedData(jsonData);
        setFilteredData(jsonData);
        setLoading(false);
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
        setProcessedData(sampleData);
        setFilteredData(sampleData);
        setLoading(false);
      }
    };

    loadPropertyData();
  }, []);

  // Handle filtered data change from SearchBar
  const handleFilteredDataChange = (filtered) => {
    setFilteredData(filtered);
    setCurrentPage(1); // Reset pagination
  };

  // Handle pagination reset
  const handlePaginationReset = () => {
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredData.slice(startIndex, endIndex);

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

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'RTMI':
        return 'Ready to Move In';
      case 'UC':
        return 'Under Construction';
      case 'NP':
        return 'New Project';
      default:
        return status || 'N/A';
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
          {/* Debug info */}
          <p className="text-sm text-gray-500 mt-1">
            Loaded {processedData.length} properties
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          data={processedData}
          onFilteredDataChange={handleFilteredDataChange}
          onPaginationReset={handlePaginationReset}
        />

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
                            {getStatusText(row.status)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of{' '}
                      <span className="font-medium">{filteredData.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrentPage = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                              isCurrentPage
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
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