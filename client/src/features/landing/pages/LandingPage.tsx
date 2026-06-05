import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2d6a4f' },
    background: { default: '#faf7f0' },
  },
  typography: { fontFamily: '"Lora", Georgia, serif' },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', borderRadius: 32 } },
    },
  },
});

const TreeIllustration: React.FC<{ scale?: number; color?: string }> = ({
  scale = 1, color = '#40916c',
}) => (
  <svg width={48 * scale} height={64 * scale} viewBox="0 0 48 64" fill="none">
    <ellipse cx="24" cy="22" rx="18" ry="20" fill={color} fillOpacity="0.9" />
    <ellipse cx="16" cy="30" rx="12" ry="13" fill={color} fillOpacity="0.7" />
    <ellipse cx="32" cy="28" rx="13" ry="14" fill={color} fillOpacity="0.75" />
    <rect x="21" y="42" width="6" height="18" rx="2" fill="#a0522d" />
  </svg>
);

const LeafSpark: React.FC<{ x: number; y: number; size?: number; rotate?: number }> = ({
  x, y, size = 1, rotate = 0,
}) => (
  <svg
    style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotate}deg)`, pointerEvents: 'none' }}
    width={16 * size} height={22 * size} viewBox="0 0 16 22" fill="none"
  >
    <path d="M8 1 C15 6, 15 16, 8 21 C1 16, 1 6, 8 1Z" fill="#52b788" fillOpacity="0.55" />
    <line x1="8" y1="1" x2="8" y2="21" stroke="#74c69d" strokeWidth="0.8" strokeOpacity="0.6" />
  </svg>
);

const CloudPuff: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width="120" height="52" viewBox="0 0 120 52" fill="none" style={style}>
    <ellipse cx="60" cy="36" rx="52" ry="18" fill="#d8f3dc" />
    <ellipse cx="42" cy="30" rx="22" ry="18" fill="#d8f3dc" />
    <ellipse cx="76" cy="28" rx="26" ry="20" fill="#d8f3dc" />
    <ellipse cx="58" cy="22" rx="18" ry="16" fill="#d8f3dc" />
  </svg>
);

const Sun: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={style}>
    <circle cx="40" cy="40" r="18" fill="#f9c74f" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <line
        key={i}
        x1="40" y1="14" x2="40" y2="8"
        stroke="#f9c74f" strokeWidth="3" strokeLinecap="round"
        transform={`rotate(${deg} 40 40)`}
      />
    ))}
  </svg>
);

const ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

  @keyframes floatUp {
    0%   { transform: translateY(0px) rotate(0deg); }
    50%  { transform: translateY(-10px) rotate(6deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes sway {
    0%,100% { transform: rotate(-4deg); }
    50%      { transform: rotate(4deg); }
  }
  @keyframes drift {
    0%   { transform: translateX(0px); }
    50%  { transform: translateX(14px); }
    100% { transform: translateX(0px); }
  }
  @keyframes softPulse {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.04); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-float { animation: floatUp 4s ease-in-out infinite; }
  .anim-sway  { animation: sway   5s ease-in-out infinite; }
  .anim-drift { animation: drift  7s ease-in-out infinite; }
  .anim-pulse { animation: softPulse 3s ease-in-out infinite; }
  .fade-in-1  { animation: fadeSlideUp 0.7s ease forwards 0.1s; opacity: 0; }
  .fade-in-2  { animation: fadeSlideUp 0.7s ease forwards 0.3s; opacity: 0; }
  .fade-in-3  { animation: fadeSlideUp 0.7s ease forwards 0.5s; opacity: 0; }

  .pill-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px 32px;
    box-shadow: 0 2px 16px rgba(45,106,79,0.08);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    border: 1px solid rgba(45,106,79,0.09);
  }
  .pill-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 32px rgba(45,106,79,0.14);
  }

  .cta-btn {
    background: #2d6a4f !important;
    color: #ffffff !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    padding: 14px 36px !important;
    font-size: 1rem !important;
    border-radius: 32px !important;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s !important;
  }
  .cta-btn:hover {
    background: #1b4332 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(45,106,79,0.3) !important;
  }
  .ghost-btn {
    color: #2d6a4f !important;
    border: 1.5px solid #2d6a4f !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 500 !important;
    padding: 13px 32px !important;
    font-size: 1rem !important;
    border-radius: 32px !important;
    transition: all 0.2s !important;
  }
  .ghost-btn:hover {
    background: rgba(45,106,79,0.06) !important;
  }
`;

const StepCard: React.FC<{
  icon: React.ReactNode; title: string; body: string; accent: string;
}> = ({ icon, title, body, accent }) => (
  <div className="pill-card" style={{ flex: '1 1 220px', minWidth: 220 }}>
    <div style={{ marginBottom: 16 }}>{icon}</div>
    <div style={{
      fontFamily: '"Lora", serif', fontSize: '1.1rem', fontWeight: 600,
      color: '#1b4332', marginBottom: 8,
    }}>{title}</div>
    <div style={{
      fontFamily: '"Inter", sans-serif', fontSize: '0.9rem',
      color: '#52796f', lineHeight: 1.7,
    }}>{body}</div>
    <div style={{
      marginTop: 16, height: 3, width: 40,
      background: accent, borderRadius: 4,
    }} />
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <style>{ANIM}</style>

      <Box sx={{ minHeight: '100vh', bgcolor: '#faf7f0', overflowX: 'hidden', fontFamily: '"Lora", serif' }}>

        {/* NAV */}
        <Box component="nav" sx={{
          position: 'sticky', top: 0, zIndex: 50,
          bgcolor: 'rgba(250,247,240,0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(45,106,79,0.08)',
        }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <span style={{ fontSize: 26 }}>🌿</span>
                <Typography sx={{
                  fontFamily: '"Lora", serif', fontWeight: 700,
                  fontSize: '1.35rem', color: '#1b4332', letterSpacing: '-0.01em',
                }}>
                  shuddi
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Button component={Link} to="/auth/login" className="ghost-btn" variant="outlined">
                  Sign in
                </Button>
                <Button component={Link} to="/auth/signup" className="cta-btn" variant="contained">
                  Join the mission
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* HERO */}
        <Box sx={{ position: 'relative', pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 12 }, overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute', top: -80, right: -100,
            width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, #d8f3dc 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -60, left: -80,
            width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle, #b7e4c7 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Box sx={{ position: 'absolute', top: 60, right: '8%', pointerEvents: 'none' }}>
            <div className="anim-drift" style={{ animationDuration: '8s' }}>
              <Sun style={{ opacity: 0.7 }} />
            </div>
          </Box>
          <Box sx={{ position: 'absolute', top: 120, right: '18%', pointerEvents: 'none' }}>
            <div className="anim-drift" style={{ animationDuration: '11s', animationDelay: '2s' }}>
              <CloudPuff style={{ opacity: 0.8 }} />
            </div>
          </Box>

          {[
            { x: '5%',  y: 90,  s: 1.3, r: 20  },
            { x: '88%', y: 200, s: 1.0, r: -30 },
            { x: '12%', y: 320, s: 0.8, r: 45  },
            { x: '80%', y: 400, s: 1.1, r: 10  },
            { x: '92%', y: 100, s: 0.7, r: -15 },
          ].map((l, i) => (
            <Box key={i} sx={{ position: 'absolute', left: l.x, top: l.y, pointerEvents: 'none' }}>
              <div className="anim-float" style={{ animationDelay: `${i * 0.7}s` }}>
                <LeafSpark x={0} y={0} size={l.s} rotate={l.r} />
              </div>
            </Box>
          ))}

          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div className="fade-in-1">
              <Typography sx={{
                fontFamily: '"Lora", serif',
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem' },
                fontWeight: 700, lineHeight: 1.2, color: '#1b4332', mb: 1,
              }}>
                A cleaner world starts
              </Typography>
              <Typography sx={{
                fontFamily: '"Lora", serif',
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem' },
                fontWeight: 700, fontStyle: 'italic',
                lineHeight: 1.2, color: '#40916c', mb: 3,
              }}>
                with one small act.
              </Typography>
            </div>

            <div className="fade-in-2">
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: '#52796f', maxWidth: 520, mx: 'auto', lineHeight: 1.85, mb: 5,
              }}>
                Shuddi gives you simple, local tasks to reduce pollution in your neighbourhood.
                Do your bit, earn credits, and watch your community transform — together.
              </Typography>
            </div>

            <div className="fade-in-3">
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button component={Link} to="/auth/signup" className="cta-btn" variant="contained" size="large">
                  Start making a difference →
                </Button>
                <Button component={Link} to="/auth/login" className="ghost-btn" variant="outlined" size="large">
                  I already have an account
                </Button>
              </Box>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.8rem', color: '#95b8a4', mt: 2,
              }}>
                Free to join · No ads · No real money
              </Typography>
            </div>
          </Container>
        </Box>

        {/* ILLUSTRATED HORIZON */}
        <Box sx={{ position: 'relative', height: 120, overflow: 'hidden', bgcolor: '#faf7f0' }}>
          <svg width="100%" height="120" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ display: 'block' }}>
            <path d="M0 80 Q200 30 400 70 Q600 110 800 60 Q1000 10 1200 65 Q1350 95 1440 55 L1440 120 L0 120Z" fill="#d8f3dc" />
            <path d="M0 95 Q300 60 600 90 Q900 120 1200 80 Q1350 65 1440 85 L1440 120 L0 120Z" fill="#b7e4c7" />
          </svg>
          {[8, 18, 28, 40, 52, 62, 72, 82, 91].map((pct, i) => (
            <Box key={i} sx={{
              position: 'absolute', bottom: 16 + (i % 3) * 6,
              left: `${pct}%`, transform: 'translateX(-50%)',
            }}>
              <div className="anim-sway" style={{ animationDelay: `${i * 0.5}s`, animationDuration: `${4 + i * 0.3}s` }}>
                <TreeIllustration
                  scale={0.55 + (i % 3) * 0.12}
                  color={['#40916c', '#52b788', '#2d6a4f'][i % 3]}
                />
              </div>
            </Box>
          ))}
        </Box>

        {/* WHAT IS SHUDDI */}
        <Box sx={{ bgcolor: '#b7e4c7', py: { xs: 8, md: 11 } }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography sx={{
              fontFamily: '"Lora", serif',
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              fontWeight: 700, color: '#1b4332', mb: 3,
            }}>
              What is Shuddi?
            </Typography>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: '#2d6a4f', lineHeight: 1.9, maxWidth: 600, mx: 'auto', mb: 2,
            }}>
              <em style={{ fontFamily: '"Lora", serif' }}>"Shuddi"</em> means purification.
              We're a platform that bridges everyday citizens with local NGOs to take on
              real, bite-sized environmental tasks — picking up litter, reporting drain blockages,
              planting saplings — and turn them into a collective habit.
            </Typography>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '1rem', color: '#40916c', lineHeight: 1.9,
              maxWidth: 540, mx: 'auto',
            }}>
              No grand gestures needed. Just small actions, done consistently,
              by people who care about where they live.
            </Typography>
          </Container>
        </Box>

        {/* HOW IT WORKS */}
        <Box sx={{ bgcolor: '#faf7f0', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Typography sx={{
              fontFamily: '"Lora", serif',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 700, color: '#1b4332', textAlign: 'center', mb: 2,
            }}>
              How it works
            </Typography>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '1rem', color: '#52796f',
              textAlign: 'center', mb: 6, maxWidth: 440, mx: 'auto', lineHeight: 1.8,
            }}>
              Simple enough that anyone can participate. Meaningful enough that it matters.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <StepCard
                icon={<span style={{ fontSize: 36 }}>📍</span>}
                title="Get tasks near you"
                body="When you sign up, you're linked to your locality. Individual tasks pop up on your feed — from 5-minute quick wins to weekend contributions."
                accent="#40916c"
              />
              <StepCard
                icon={<span style={{ fontSize: 36 }}>🤝</span>}
                title="Join community events"
                body="Local NGOs organise area-wide drives. See what's happening around you, RSVP, and show up. Every pair of hands counts."
                accent="#52b788"
              />
              <StepCard
                icon={<span style={{ fontSize: 36 }}>🌱</span>}
                title="Watch the change happen"
                body="Every verified task updates your neighbourhood's live impact. You'll actually see the difference — and so will your community."
                accent="#74c69d"
              />
              <StepCard
                icon={<span style={{ fontSize: 36 }}>🪙</span>}
                title="Earn credits, get rewards"
                body="Completed tasks earn Shuddi credits — no real money, no ads. Spend them in the rewards store on eco-friendly goodies."
                accent="#95d5b2"
              />
            </Box>
          </Container>
        </Box>

        {/* FOR INDIVIDUALS & NGOS */}
        <Box sx={{ bgcolor: '#d8f3dc', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Typography sx={{
              fontFamily: '"Lora", serif',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 700, color: '#1b4332',
              textAlign: 'center', mb: 6,
            }}>
              Who is Shuddi for?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

              {/* Individuals card */}
              <Box sx={{
                flex: 1,
                bgcolor: '#ffffff',
                borderRadius: '24px',
                p: { xs: 4, md: 5 },
                boxShadow: '0 4px 24px rgba(45,106,79,0.10)',
                border: '1px solid rgba(45,106,79,0.1)',
                display: 'flex', flexDirection: 'column', gap: 2.5,
              }}>
                <div style={{ fontSize: 48 }} className="anim-pulse">🧑‍🌾</div>
                <Typography sx={{
                  fontFamily: '"Lora", serif',
                  fontSize: '1.5rem', fontWeight: 700, color: '#1b4332',
                }}>For individuals</Typography>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.95rem', color: '#52796f', lineHeight: 1.85,
                }}>
                  You don't need to be an activist. You just need ten free minutes and a
                  desire to leave your street a little better than you found it. Shuddi
                  helps you act on that feeling — and makes it genuinely rewarding.
                </Typography>
                {/* feature bullets */}
                {[
                  { icon: '📋', text: 'Browse solo tasks matched to your area' },
                  { icon: '⏱️', text: 'Pick tasks that fit your schedule — 5 min or 5 hours' },
                  { icon: '🪙', text: 'Earn credits for every verified completion' },
                  { icon: '🎁', text: 'Redeem credits in the eco-rewards store' },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                    <Typography sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.9rem', color: '#2d6a4f', lineHeight: 1.7,
                    }}>{item.text}</Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 'auto', pt: 1 }}>
                  <Button
                    component={Link} to="/auth/signup"
                    className="cta-btn" variant="contained" fullWidth
                  >
                    Join as an individual
                  </Button>
                </Box>
              </Box>

              {/* NGO card */}
              <Box sx={{
                flex: 1,
                bgcolor: '#1b4332',
                borderRadius: '24px',
                p: { xs: 4, md: 5 },
                boxShadow: '0 4px 24px rgba(27,67,50,0.25)',
                display: 'flex', flexDirection: 'column', gap: 2.5,
              }}>
                <div style={{ fontSize: 48 }} className="anim-pulse">🏢</div>
                <Typography sx={{
                  fontFamily: '"Lora", serif',
                  fontSize: '1.5rem', fontWeight: 700, color: '#d8f3dc',
                }}>For NGOs</Typography>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.95rem', color: '#95d5b2', lineHeight: 1.85,
                }}>
                  Your organisation is assigned an area to manage. Mobilise residents,
                  run verified drives, and track real on-ground progress — all from a
                  single dashboard built for field-level work.
                </Typography>
                {[
                  { icon: '🗺️', text: 'Manage your assigned geographic zone' },
                  { icon: '📢', text: 'Create and publish community events' },
                  { icon: '✅', text: 'Verify completed tasks and award credits' },
                  { icon: '📊', text: 'Track your area\'s environmental progress' },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                    <Typography sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.9rem', color: '#b7e4c7', lineHeight: 1.7,
                    }}>{item.text}</Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 'auto', pt: 1 }}>
                  <Button
                    component={Link} to="/auth/signup"
                    variant="contained" fullWidth
                    sx={{
                      bgcolor: '#d8f3dc', color: '#1b4332',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600, borderRadius: 32, py: 1.6,
                      '&:hover': { bgcolor: '#ffffff' },
                    }}
                  >
                    Register your NGO
                  </Button>
                </Box>
              </Box>

            </Box>
          </Container>
        </Box>

        {/* MANIFESTO QUOTE */}
        <Box sx={{ bgcolor: '#faf7f0', py: { xs: 10, md: 14 } }}>
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography sx={{
              fontFamily: '"Lora", serif', fontStyle: 'italic',
              fontSize: { xs: '1.4rem', md: '1.75rem' },
              color: '#2d6a4f', lineHeight: 1.7, mb: 3,
            }}>
              "The environment doesn't need a few people doing it perfectly.
              It needs millions of people doing it imperfectly."
            </Typography>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.85rem', color: '#95b8a4',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              The spirit behind Shuddi
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 5, alignItems: 'flex-end' }}>
              {[1.0, 1.3, 0.9, 1.5, 1.1, 0.8, 1.2].map((s, i) => (
                <div key={i} className="anim-sway" style={{ animationDelay: `${i * 0.4}s` }}>
                  <TreeIllustration scale={s * 0.65} color={['#40916c', '#52b788', '#2d6a4f'][i % 3]} />
                </div>
              ))}
            </Box>
          </Container>
        </Box>

        {/* FINAL CTA */}
        <Box sx={{ bgcolor: '#2d6a4f', py: { xs: 10, md: 14 }, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute', top: -100, right: -100,
            width: 400, height: 400, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -80, left: -80,
            width: 320, height: 320, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
          }} />
          <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 20 }} className="anim-float">🌍</div>
            <Typography sx={{
              fontFamily: '"Lora", serif',
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              fontWeight: 700, color: '#ffffff', mb: 2,
            }}>
              Your neighbourhood is waiting.
            </Typography>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '1.05rem', color: '#95d5b2', lineHeight: 1.85, mb: 5,
            }}>
              Join Shuddi for free. Pick your first task. Make your first mark.
            </Typography>
            <Button
              component={Link} to="/auth/signup"
              variant="contained" size="large"
              sx={{
                bgcolor: '#d8f3dc', color: '#1b4332',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700, px: 5, py: 1.8,
                fontSize: '1rem', borderRadius: 32,
                '&:hover': {
                  bgcolor: '#ffffff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.2s',
              }}
            >
              Create your free account →
            </Button>
          </Container>
        </Box>

        {/* FOOTER */}
        <Box sx={{ bgcolor: '#1b4332', py: 3, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 18 }}>🌿</span>
                <Typography sx={{ fontFamily: '"Lora", serif', fontWeight: 700, color: '#b7e4c7', fontSize: '0.95rem' }}>
                  shuddi
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', color: '#52796f' }}>
                Built for a cleaner tomorrow · No real money · No ads
              </Typography>
            </Box>
          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;