/**
 * Central place for task-flow toast copy + styling, built on react-hot-toast
 * (already in the project — no new dependency).
 *
 * Wiring: mount <Toaster position="bottom-center" /> once near the root of
 * the app (e.g. in App.tsx). These helpers don't render anything themselves.
 *
 * Copy follows the interface's voice: state what happened, not an apology,
 * and match the button label that triggered it (e.g. "Start Task" -> "Task started").
 */
import toast from 'react-hot-toast';

const baseStyle = {
  borderRadius: '12px',
  background: '#fff',
  color: '#1b1b1b',
  fontWeight: 600,
  padding: '12px 16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
} as const;

const successIcon = { primary: '#1b5e20', secondary: '#fff' };

export const taskToast = {
  started: () => toast.success('Task started — good luck!', { style: baseStyle, iconTheme: successIcon }),

  submitted: () =>
    toast.success('Proof submitted — verifying now.', { style: baseStyle, iconTheme: successIcon }),

  approved: (points: number) =>
    toast.success(`Approved — +${points} XP`, { style: baseStyle, iconTheme: successIcon }),

  rejected: (reason?: string | null) =>
    toast.error(reason ? `Submission rejected: ${reason}` : 'Submission was rejected.', {
      style: baseStyle,
    }),

  cooldown: () =>
    toast('This task is on cooldown — check back later.', { style: baseStyle, icon: '⏳' }),

  registered: () =>
    toast.success('Registered for this event.', { style: baseStyle, iconTheme: successIcon }),

  error: (message = 'Something went wrong. Please try again.') =>
    toast.error(message, { style: baseStyle }),
};