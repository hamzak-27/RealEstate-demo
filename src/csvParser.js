// CSV Parser utility for real estate data with hierarchical structure
export const parsePropertyCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = ['area', 'status', 'projectName', 'configuration', 'carpet', 'pricing', 'elevation', 'flatsLifts', 'amenities', 'possession'];
  
  const parsed = [];
  let currentArea = '';
  let currentStatus = '';
  let currentProjectName = '';
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim() === '\r') continue;
    
    // Split by pipe and remove the line number (first column)
    const columns = line.split('|').slice(1);
    
    if (columns.length >= 10) {
      // Extract and clean values
      const rawArea = columns[0] ? columns[0].trim().replace(/\r$/, '') : '';
      const rawStatus = columns[1] ? columns[1].trim().replace(/\r$/, '') : '';
      const rawProjectName = columns[2] ? columns[2].trim().replace(/\r$/, '') : '';
      const rawConfig = columns[3] ? columns[3].trim().replace(/\r$/, '') : '';
      const rawCarpet = columns[4] ? columns[4].trim().replace(/\r$/, '') : '';
      const rawPricing = columns[5] ? columns[5].trim().replace(/\r$/, '') : '';
      const rawElevation = columns[6] ? columns[6].trim().replace(/\r$/, '') : '';
      const rawFlatsLifts = columns[7] ? columns[7].trim().replace(/\r$/, '') : '';
      const rawAmenities = columns[8] ? columns[8].trim().replace(/\r$/, '') : '';
      const rawPossession = columns[9] ? columns[9].trim().replace(/\r$/, '') : '';
      
      // Handle hierarchical data inheritance
      const area = rawArea || currentArea;
      const status = rawStatus || currentStatus;
      const projectName = rawProjectName || currentProjectName;
      
      // Update current values for next iterations
      if (rawArea) currentArea = rawArea;
      if (rawStatus) currentStatus = rawStatus;
      if (rawProjectName) currentProjectName = rawProjectName;
      
      // Only add meaningful records (must have either project name or configuration)
      const hasValidData = projectName || rawConfig;
      const isNotEmptyRow = columns.some(col => col && col.trim() && col.trim() !== '');
      
      if (hasValidData && isNotEmptyRow) {
        const record = {
          area: area || 'N/A',
          status: status || 'N/A',
          projectName: projectName || 'N/A',
          configuration: rawConfig || 'N/A',
          carpet: rawCarpet || 'N/A',
          pricing: rawPricing || 'N/A',
          elevation: rawElevation || 'N/A',
          flatsLifts: rawFlatsLifts || 'N/A',
          amenities: rawAmenities || 'N/A',
          possession: rawPossession || 'N/A'
        };
        
        // Additional cleanup for display
        Object.keys(record).forEach(key => {
          if (record[key] === 'N/A' || record[key] === '' || record[key] === ' ') {
            record[key] = '';
          }
        });
        
        parsed.push(record);
      }
    }
  }
  
  return parsed;
};

// Helper function to get sample data for fallback
export const getSamplePropertyData = () => {
  return [
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
      status: 'RTMI',
      projectName: 'Naman Habitat',
      configuration: '3bhk',
      carpet: '1037',
      pricing: '4.37cr all in',
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
      area: 'JP Road',
      status: 'UC',
      projectName: 'Alpine Primo',
      configuration: '2bhk',
      carpet: '597',
      pricing: '2.23cr all in',
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
    },
    {
      area: 'Lokhandwala',
      status: 'NP',
      projectName: '72 West',
      configuration: '3bhk',
      carpet: '1120',
      pricing: '4.85cr all in',
      elevation: 'G+35',
      flatsLifts: '6flats/5lifts',
      amenities: 'All Amenities',
      possession: 'Dec 2025'
    },
    {
      area: 'DN Nagar',
      status: 'RTMI',
      projectName: 'Platinum Life',
      configuration: '2bhk',
      carpet: '665',
      pricing: '2.99cr',
      elevation: '2B+G+16',
      flatsLifts: '4flats/2lifts',
      amenities: 'All Amenities',
      possession: 'OC Received'
    },
    {
      area: 'DN Nagar',
      status: 'RTMI',
      projectName: 'Platinum Life',
      configuration: '3bhk',
      carpet: '900',
      pricing: '4.05cr',
      elevation: '2B+G+16',
      flatsLifts: '4flats/2lifts',
      amenities: 'All Amenities',
      possession: 'OC Received'
    },
    {
      area: 'Ceaser Road',
      status: 'RTMI',
      projectName: 'MK Gracia',
      configuration: '2bhk',
      carpet: '583',
      pricing: '2.30cr all in',
      elevation: 'G+20',
      flatsLifts: '5flats/2lifts',
      amenities: 'All Basic',
      possession: 'OC Received'
    },
    {
      area: 'Ceaser Road',
      status: 'UC',
      projectName: 'Gayatri Enclave',
      configuration: '1bhk',
      carpet: '416',
      pricing: 'TBD',
      elevation: 'G+15',
      flatsLifts: '5flats/2lifts',
      amenities: 'Basic',
      possession: 'TBD'
    }
  ];
};

// Status mapping utilities
export const getStatusDisplayText = (status) => {
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

export const getStatusColor = (status) => {
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