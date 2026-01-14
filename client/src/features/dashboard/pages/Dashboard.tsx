// src/App.tsx
import React from 'react';
import {
    ThemeProvider,
    CssBaseline,
    Box,
    Container,
    Typography,
    Button,
    Paper,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import {
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { theme } from '../theme/theme';
import type { CommunityFeedItem, Task } from '../types/types';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import TaskCard from '../components/TaskCard';
import ProgressStats from '../components/ProgressStats';
import VerificationProcess from '../components/VerificationProcess';
import RewardsSection from '../components/RewardsSection';
import CommunityFeed from '../components/CommunityFeed';
import ActionAlert from '../components/alert/ActionAlert';


const Dashboard: React.FC = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const tasks: Task[] = [
        {
            id: '1',
            title: 'Plant a Tree',
            difficulty: 'Easy',
            points: 20,
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
            icon: '🌳',
        },
        {
            id: '2',
            title: 'Beach Cleanup',
            difficulty: 'Medium',
            points: 35,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
            icon: '🏖️',
        },
        {
            id: '3',
            title: 'Water Quality Test',
            difficulty: 'Hard',
            points: 50,
            image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=400&h=300&fit=crop',
            icon: '💧',
        },
    ];

    const communityFeed: CommunityFeedItem[] = [
        {
            id: '1',
            name: 'Neha',
            action: 'planted 5 trees',
            location: 'Jaipur',
            verifiedBy: 'GreenEarth NGO',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
        },
        {
            id: '2',
            name: 'Amit',
            action: 'organized a beach cleanup',
            location: 'Puri',
            verifiedBy: 'Coastal Care',
            image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=100&h=100&fit=crop',
        },
        {
            id: '3',
            name: 'Sunita',
            action: 'tested water quality',
            location: 'Cuttack',
            verifiedBy: 'AquaTrust',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        },
    ];

    const handleFixClick = () => {
        alert('Fix & Resubmit clicked');
        // Add your logic here
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Header />

                <Container maxWidth="xl" sx={{ py: 3 }}>
                    <HeroBanner />
                    {/* Main Layout: Two Columns */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', lg: 'row' },
                            gap: 3,
                            mt: 1,
                        }}
                    >
                        {/* Left Column */}
                        <Box
                            sx={{
                                flex: { xs: 'none', lg: 1 },
                                width: { xs: '100%', lg: '66.666%' }, // Approx 8/12
                            }}
                        >
                            {/* Active Tasks */}
                            <Box mb={4}>
                                <Box display="flex" alignItems="center" gap={1} mb={2} justifyContent="space-between">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOnIcon color="secondary" />
                                        <Typography variant="h6" fontWeight={600}>
                                            Active Tasks Near You
                                        </Typography>
                                    </Box>
                                    <Button size="small" sx={{ textTransform: 'none' }}>View All →</Button>
                                </Box>

                                {/* Tasks Layout: Flex Wrap */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                        flexWrap: 'wrap',
                                        justifyContent: { xs: 'center', sm: 'flex-start' },
                                    }}
                                >
                                    {tasks.map((task) => (
                                        <Box
                                            key={task.id}
                                            sx={{
                                                flex: { xs: 'none', sm: '1 1 48%', md: '1 1 31%' },
                                                minWidth: 0,
                                                width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 13.333px)' },
                                            }}
                                        >
                                            <TaskCard task={task} />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            {/* Progress Stats */}
                            <Paper
                                elevation={0}
                                sx={{
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    borderRadius: 2,
                                    p: { xs: 2, sm: 3 },
                                    mb: 4,
                                    bgcolor: 'rgba(249, 250, 251, 0.5)',
                                }}
                            >
                                {/* Progress Stats */}
                                <Box mb={3}>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <LocationOnIcon color="secondary" />
                                        <Typography variant="h6" fontWeight={600}>
                                            Your Progress And Activity
                                        </Typography>
                                    </Box>
                                    <ProgressStats />
                                </Box>

                                {/* Action Alert */}
                                <Box mb={3}>
                                    <ActionAlert
                                        title="Beach Cleanup"
                                        items={[
                                            { text: 'Location mismatch detected' },
                                            { text: 'Photo timestamp outside task window' }
                                        ]}
                                        buttonText="Fix & Resubmit"
                                        onButtonClick={handleFixClick}
                                    />
                                </Box>

                                {/* Verification Process */}
                                <VerificationProcess />
                            </Paper>
                        </Box>
                        {/* Right Column */}
                        <Box
                            sx={{
                                flex: { xs: 'none', lg: 1 },
                                width: { xs: '100%', lg: '33.333%' }, // Approx 4/12
                            }}
                        >
                            {/* Community Feed */}
                            <Paper sx={{ mb: 3 }}>
                                <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #f0f0f0">
                                    <Typography variant="h6" fontWeight={600}>
                                        Community Impact Feed
                                    </Typography>
                                    <Button size="small" sx={{ textTransform: 'none' }}>View All →</Button>
                                </Box>
                                {communityFeed.map((item) => (
                                    <CommunityFeed key={item.id} item={item} />
                                ))}
                            </Paper>
                            {/* Rewards */}
                            <RewardsSection />
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;