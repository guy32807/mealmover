import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { 
  Slider, Chip, FormControl, FormGroup, FormControlLabel, 
  Checkbox, TextField, Button, Typography, Rating 
} from '@mui/material';
import { FaFilter, FaDollarSign, FaUtensils } from 'react-icons/fa';
import './FilterPanel.css';

const cuisineOptions = [
  'American', 'Italian', 'Chinese', 'Japanese', 'Mexican', 
  'Indian', 'Thai', 'Mediterranean', 'French', 'Vietnamese'
];

const FilterPanel = ({ onFilterChange }) => {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [1, 4],
    rating: 0,
    cuisines: [],
    openNow: false,
    keyword: ''
  });
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      // Debounce to avoid too many rerenders
      setTimeout(() => onFilterChange(newFilters), 300);
      return newFilters;
    });
  };
  
  const handleCuisineToggle = (cuisine) => {
    setFilters(prev => {
      const newCuisines = prev.cuisines.includes(cuisine) 
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine];
        
      const newFilters = { ...prev, cuisines: newCuisines };
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  const clearFilters = () => {
    const defaultFilters = {
      priceRange: [1, 4],
      rating: 0,
      cuisines: [],
      openNow: false,
      keyword: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    
    // Invalidate queries to refresh data
    queryClient.invalidateQueries('restaurants');
  };
  
  return (
    <div className={`filter-panel ${expanded ? 'expanded' : ''}`}>
      <div className="filter-header" onClick={() => setExpanded(!expanded)}>
        <FaFilter />
        <h3>Filters</h3>
        <span className="toggle-icon">{expanded ? '▲' : '▼'}</span>
      </div>
      
      {expanded && (
        <div className="filter-content">
          <div className="filter-section">
            <Typography gutterBottom>Price Range</Typography>
            <div className="price-slider">
              <Slider
                value={filters.priceRange}
                onChange={(e, value) => handleFilterChange('priceRange', value)}
                min={1}
                max={4}
                step={1}
                marks={[
                  { value: 1, label: <FaDollarSign /> },
                  { value: 2, label: <><FaDollarSign /><FaDollarSign /></> },
                  { value: 3, label: <><FaDollarSign /><FaDollarSign /><FaDollarSign /></> },
                  { value: 4, label: <><FaDollarSign /><FaDollarSign /><FaDollarSign /><FaDollarSign /></> }
                ]}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
          
          <div className="filter-section">
            <Typography gutterBottom>Minimum Rating</Typography>
            <Rating
              name="rating"
              value={filters.rating}
              precision={0.5}
              onChange={(_, value) => handleFilterChange('rating', value)}
            />
          </div>
          
          <div className="filter-section">
            <Typography gutterBottom>Cuisines</Typography>
            <div className="cuisine-chips">
              {cuisineOptions.map(cuisine => (
                <Chip
                  key={cuisine}
                  label={cuisine}
                  clickable
                  color={filters.cuisines.includes(cuisine) ? "primary" : "default"}
                  onClick={() => handleCuisineToggle(cuisine)}
                  icon={<FaUtensils />}
                />
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={filters.openNow}
                    onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                  />
                }
                label="Open Now"
              />
            </FormGroup>
          </div>
          
          <div className="filter-section">
            <TextField
              fullWidth
              label="Search Keywords"
              variant="outlined"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              placeholder="Name, dish, description..."
            />
          </div>
          
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={clearFilters}
            className="clear-filters-btn"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;