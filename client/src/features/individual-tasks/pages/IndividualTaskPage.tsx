import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Chip, Stepper, Step, StepLabel, 
  Button, CircularProgress, Alert, Paper, Divider, Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import Header from '../../dashboard/components/Header';
import { VerificationUpload } from '../components/VerificationUpload';
import type { TaskDetails } from '../../../utils/individualTask.type';
import { getTaskDetails } from '../../../apis/task/individual/individual.api';


// Theme Constants
const GREEN_PRIMARY = '#1b5e20';
const STEPS = ['Start Task', 'Complete Action', 'Upload Proof', 'Get Reward'];

export default function IndividualTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();

  if(!taskId) {
    return <Box p={4}><Typography>Invalid Task ID</Typography><Button onClick={() => navigate('/all-tasks')}>Go Back</Button></Box>;
  }

  const navigate = useNavigate();
  
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'NOT_STARTED' | 'STARTED' | 'SUBMITTED' | 'APPROVED'>('NOT_STARTED');

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskDetails = await getTaskDetails(taskId);
        setTask(taskDetails);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Simulate AI Verification
  useEffect(() => {
    if (status === 'SUBMITTED') {
      const timer = setTimeout(() => {
        setStatus('APPROVED');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const activeStep = () => {
    switch (status) {
      case 'STARTED': return 1;
      case 'SUBMITTED': return 2;
      case 'APPROVED': return 4;
      default: return 0;
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" height="100vh" alignItems="center"><CircularProgress sx={{ color: GREEN_PRIMARY }} /></Box>;
  if (!task) return <Box p={4}><Typography>Task not found</Typography><Button onClick={() => navigate('/all-tasks')}>Go Back</Button></Box>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <Header />

      {/* 1. HERO BANNER SECTION */}
      <Box 
        sx={{ 
          height: { xs: 300, md: 400 }, 
          width: '100%', 
          backgroundImage: `url(${task.image})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(27, 94, 32, 0.9) 100%)'
          }
        }}
      >
        <Container maxWidth="md" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 6, position: 'relative', zIndex: 1 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/all-tasks')}
            sx={{ position: 'absolute', top: 20, left: 0, color: 'rgba(255,255,255,0.9)', textTransform: 'none', fontWeight: 600 }}
          >
            Back to All Tasks
          </Button>

          {/* Badges */}
          <Box display="flex" gap={1} mb={2}>
            <Chip 
              label={task.category} 
              sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 700, borderRadius: 1 }} 
            />
            <Chip 
              label={task.difficulty} 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)', fontWeight: 600 }} 
            />
          </Box>
          
          {/* Title */}
          <Typography variant="h3" fontWeight={800} color="white" gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {task.title}
          </Typography>
          
          {/* Meta Info */}
          <Box display="flex" alignItems="center" gap={3} color="rgba(255,255,255,0.95)">
            <Box display="flex" alignItems="center" gap={1}>
               <AccessTimeIcon fontSize="small" />
               <Typography variant="subtitle1" fontWeight={500}>{task.timeEstimate}</Typography>
            </Box>
            <Box sx={{ width: 4, height: 4, bgcolor: 'white', borderRadius: '50%' }} />
            <Typography variant="subtitle1" fontWeight={700} color="#69f0ae">
              +{task.baseScore} XP Reward
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* 2. MAIN CONTENT CARD */}
      <Container maxWidth="md" sx={{ mt: -4, pb: 8, position: 'relative', zIndex: 2 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          
          {/* Progress Bar */}
          <Box sx={{ bgcolor: '#fff', p: 4, borderBottom: '1px solid #f0f0f0' }}>
            <Stepper activeStep={activeStep()} alternativeLabel sx={{ 
              '& .MuiStepIcon-root.Mui-active': { color: GREEN_PRIMARY },
              '& .MuiStepIcon-root.Mui-completed': { color: GREEN_PRIMARY },
            }}>
              {STEPS.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ p: { xs: 3, md: 5 } }}>
            
            {/* Description */}
            <Box mb={4}>
              <Typography variant="h6" fontWeight={800} color="text.primary" gutterBottom>
                MISSION BRIEF
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                {task.description}
              </Typography>
            </Box>

            {/* Educational Link (if exists) */}
            {task.educationalLink && (
              <Button 
                variant="outlined" 
                startIcon={<PlayCircleOutlineIcon />}
                href={task.educationalLink}
                target="_blank"
                fullWidth
                sx={{ 
                  mb: 4, py: 2, borderRadius: 2, 
                  borderColor: '#90caf9', color: '#1976d2', bgcolor: '#f5faff',
                  justifyContent: 'flex-start', px: 3, textTransform: 'none'
                }}
              >
                <Box textAlign="left">
                   <Typography variant="subtitle2" fontWeight={700}>Watch Tutorial</Typography>
                   <Typography variant="caption">Learn how to complete this task effectively</Typography>
                </Box>
              </Button>
            )}

            {/* Steps List */}
            {/* <Box sx={{ bgcolor: '#f1f8e9', p: 3, borderRadius: 2, mb: 5, borderLeft: `4px solid ${GREEN_PRIMARY}` }}>
              <Typography variant="h6" fontWeight={700} color={GREEN_PRIMARY} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 STEPS TO COMPLETE
              </Typography>
              {task.steps ? (
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {task.steps.map((step, idx) => (
                    <Typography component="li" key={idx} variant="body1" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                      {step}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">Follow the instructions in the description.</Typography>
              )}
            </Box> */}

            <Divider sx={{ mb: 5 }} />

            {/* 3. ACTION ZONE */}
            <Box textAlign="center">
              
              {/* STATUS: NOT STARTED */}
              {status === 'NOT_STARTED' && (
                <Box>
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    Ready to take action?
                  </Typography>
                  <Typography color="text.secondary" mb={3}>
                    Start this task now to track your progress and earn rewards.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => setStatus('STARTED')}
                    sx={{ 
                      px: 6, py: 1.5, borderRadius: 50, fontSize: '1.1rem', 
                      bgcolor: GREEN_PRIMARY, fontWeight: 700,
                      boxShadow: '0 8px 20px rgba(27, 94, 32, 0.3)',
                      '&:hover': { bgcolor: '#144a18' }
                    }}
                  >
                    Start Task
                  </Button>
                </Box>
              )}

              {/* STATUS: STARTED (UPLOAD) */}
              {status === 'STARTED' && (
                <Box textAlign="left">
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    <strong>Proof Required:</strong> {task.verificationType === 'HYBRID' ? 'Photo + Description' : task.verificationType}
                  </Alert>
                  <VerificationUpload 
                    type={task.verificationType}
                    loading={false}
                    onSubmit={() => setStatus('SUBMITTED')}
                  />
                </Box>
              )}

              {/* STATUS: SUBMITTED (VERIFYING) */}
              {status === 'SUBMITTED' && (
                <Box py={4}>
                  <CircularProgress size={60} sx={{ color: GREEN_PRIMARY, mb: 3 }} />
                  <Typography variant="h5" fontWeight={700}>Verifying Submission...</Typography>
                  <Typography color="text.secondary">Our AI is analyzing your proof. Hang tight!</Typography>
                </Box>
              )}

              {/* STATUS: APPROVED */}
              {status === 'APPROVED' && (
                <Box py={2} sx={{ bgcolor: '#e8f5e9', borderRadius: 3, p: 4 }}>
                  <Avatar sx={{ bgcolor: '#4caf50', width: 80, height: 80, margin: '0 auto', mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="h4" fontWeight={800} color="#2e7d32" gutterBottom>
                    Mission Accomplished!
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    You've earned <strong>{task.baseScore} XP</strong>
                  </Typography>
                  <Box mt={3} display="flex" justifyContent="center" gap={2}>
                    <Button variant="outlined" onClick={() => navigate('/all-tasks')} sx={{ borderColor: GREEN_PRIMARY, color: GREEN_PRIMARY }}>
                      Find Another Task
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: GREEN_PRIMARY }}>
                      View Leaderboard
                    </Button>
                  </Box>
                </Box>
              )}

            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}