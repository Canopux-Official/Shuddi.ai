import React from 'react';
import { Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { CATEGORY_THEME } from '../../config/taskTheme';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  searchPlaceholder?: string;
}

// Category options are derived from the theme config, not hardcoded —
// add a category to taskTheme.ts and it shows up here for free.
export const TaskListFilters: React.FC<Props> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  searchPlaceholder = 'Search tasks...',
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ p: 2, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', gap: 2 }}
    >
      <TextField
        fullWidth
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
      />

      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryFilter}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value)}
          startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
        >
          <MenuItem value="All">All</MenuItem>
          {Object.entries(CATEGORY_THEME).map(([key, theme]) => (
            <MenuItem key={key} value={key}>
              {theme.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};