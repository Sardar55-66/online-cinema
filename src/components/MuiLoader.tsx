'use client';

import { CircularProgress, Box, Typography } from '@mui/material';

interface MuiLoaderProps {
    text?: string;
    size?: number;
}

export function MuiLoader({ text = 'Загрузка...', size = 60 }: MuiLoaderProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                gap: 2,
            }}
        >
            <CircularProgress
                size={size}
                sx={{
                    color: '#3b82f6', // blue-500
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    }
                }}
            />
            <Typography
                variant="body1"
                sx={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 500,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}

// Компонент для центрированной загрузки
export function CenteredMuiLoader({ text = 'Загрузка...' }: { text?: string }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100%',
                backgroundColor: 'black',
            }}
        >
            <MuiLoader text={text} size={80} />
        </Box>
    );
}

// Компонент для полноэкранной загрузки с затемнением
export function FullScreenMuiLoader({ text = 'Загрузка...' }: { text?: string }) {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#1f2937', // gray-800
                    borderRadius: 2,
                    padding: 4,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
            >
                <MuiLoader text={text} size={80} />
            </Box>
        </Box>
    );
}
