// src/components/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  EmojiEvents as LeaderboardIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InboxDialog from './inbox/InboxDialog';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onProfileClick?: () => void;
  onLeaderboardClick?: () => void;
  onLogoutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = 'Pratik',
  userAvatar = 'https://i.pravatar.cc/150?img=12',
  notificationCount = 1,
  onProfileClick,
  onLeaderboardClick,
  onLogoutClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [inboxOpen, setInboxOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile")
    if (onProfileClick) onProfileClick();
  };

  const handleLeaderboardClick = () => {
    handleMenuClose();

    if (onLeaderboardClick) onLeaderboardClick();
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    if (onLogoutClick) onLogoutClick();
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo Section */}
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'secondary.main',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" color="white">🌱</Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            Shuddi.AI
          </Typography>
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
          {/* Navigation Buttons */}
          <Button
            startIcon={<Box component="span">📋</Box>}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              color: 'text.primary',
              textTransform: 'none'
            }}
          >
            Tasks
          </Button>
          <Button
            startIcon={<Box component="span">✉️</Box>}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              color: 'text.primary',
              textTransform: 'none'
            }}
          >
            My Submissions
          </Button>

          {/* Notification Icon */}
          <IconButton
            onClick={() =>
              setInboxOpen(true)
            }
          >
            <Badge
              badgeContent={
                notificationCount
              }
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>



          {/* Settings Icon */}
          <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <SettingsIcon />
          </IconButton>

          {/* User Profile with Dropdown */}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Avatar
              src={userAvatar}
              sx={{ width: 36, height: 36 }}
            />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              {userName}
            </Typography>
            <ArrowDownIcon
              sx={{
                fontSize: 20,
                transition: 'transform 0.2s',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                overflow: 'visible',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleLeaderboardClick}>
              <ListItemIcon>
                <LeaderboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Leaderboard</ListItemText>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={handleLogoutClick}
              sx={{
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        <InboxDialog
          open={inboxOpen}
          onClose={() =>
            setInboxOpen(false)
          }
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;