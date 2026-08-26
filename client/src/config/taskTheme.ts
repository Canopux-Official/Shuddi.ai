/**
 * Single source of truth for how a task's category/difficulty is *shown*.
 *
 * Why this exists: the old UI keyed hero banners and cards off `task.image`,
 * but the schema has no image field on Task — so it was always broken, and
 * generating a photo per task at creation time isn't realistic anyway.
 * Instead, every category/difficulty gets an icon + color identity here.
 * Add a new TaskCategory value on the backend -> add one entry below ->
 * every screen (card, hero, filters) picks it up automatically.
 */
import type { SvgIconComponent } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import Bolt from '@mui/icons-material/Bolt';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export interface CategoryTheme {
  label: string;
  icon: SvgIconComponent;
  /** Used for hero panels / large surfaces */
  gradient: string;
  /** Used for text, borders, chip accents */
  accent: string;
  /** Light tint for chip/badge backgrounds */
  soft: string;
}

const DEFAULT_CATEGORY_THEME: CategoryTheme = {
  label: 'General',
  icon: TaskAltIcon,
  gradient: 'linear-gradient(135deg, #37474f 0%, #546e7a 100%)',
  accent: '#455a64',
  soft: '#eceff1',
};

// Known categories today: SUSTAINABILITY, COMMUNITY, EDUCATION.
// The rest are here so new backend categories don't fall back to the
// generic gray theme the moment they show up — extend freely.
export const CATEGORY_THEME: Record<string, CategoryTheme> = {
  SUSTAINABILITY: {
    label: 'Sustainability',
    icon: RecyclingIcon,
    gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
    accent: '#2e7d32',
    soft: '#e8f5e9',
  },
  COMMUNITY: {
    label: 'Community',
    icon: GroupsIcon,
    gradient: 'linear-gradient(135deg, #01579b 0%, #0277bd 100%)',
    accent: '#0277bd',
    soft: '#e1f5fe',
  },
  EDUCATION: {
    label: 'Education',
    icon: SchoolIcon,
    gradient: 'linear-gradient(135deg, #e65100 0%, #ef6c00 100%)',
    accent: '#ef6c00',
    soft: '#fff3e0',
  },
  RECYCLING: {
    label: 'Recycling',
    icon: RecyclingIcon,
    gradient: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)',
    accent: '#6a1b9a',
    soft: '#f3e5f5',
  },
  WATER: {
    label: 'Water',
    icon: WaterDropIcon,
    gradient: 'linear-gradient(135deg, #01579b 0%, #0288d1 100%)',
    accent: '#0288d1',
    soft: '#e1f5fe',
  },
  ENERGY: {
    label: 'Energy',
    icon: Bolt,
    gradient: 'linear-gradient(135deg, #f57f17 0%, #f9a825 100%)',
    accent: '#f57f17',
    soft: '#fffde7',
  },
};

export const getCategoryTheme = (category?: string | null): CategoryTheme => {
  if (!category) return DEFAULT_CATEGORY_THEME;
  return CATEGORY_THEME[category.toUpperCase()] ?? DEFAULT_CATEGORY_THEME;
};

export interface DifficultyTheme {
  label: string;
  color: string;
  soft: string;
}

export const DIFFICULTY_THEME: Record<string, DifficultyTheme> = {
  EASY: { label: 'Easy', color: '#2e7d32', soft: '#e8f5e9' },
  MEDIUM: { label: 'Medium', color: '#ef6c00', soft: '#fff3e0' },
  HARD: { label: 'Hard', color: '#c62828', soft: '#ffebee' },
};

export const getDifficultyTheme = (difficulty?: string | null): DifficultyTheme => {
  if (!difficulty) return { label: 'Unknown', color: '#616161', soft: '#f5f5f5' };
  return (
    DIFFICULTY_THEME[difficulty.toUpperCase()] ?? {
      label: difficulty,
      color: '#616161',
      soft: '#f5f5f5',
    }
  );
};