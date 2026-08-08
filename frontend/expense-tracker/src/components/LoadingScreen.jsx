import { Loader2 } from 'lucide-react';
import expensifyLogo from '../assets/expensify_logo.png';

export default function LoadingScreen({ message = "Loading..." }) {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'var(--bg-color)' 
        }}>
            <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <img src={expensifyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <Loader2 className="animate-spin" size={48} color="var(--primary-green)" style={{ marginBottom: '1.5rem' }} />
            
            <p style={{ 
                color: 'var(--text-secondary)', 
                fontWeight: 500,
                fontSize: '1.1rem'
            }}>
                {message}
            </p>
        </div>
    );
}
