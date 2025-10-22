import { act, render, screen } from '@testing-library/react';
import { Timer } from '@/components/Timer';

describe('Timer Component', () => {
    const mockOnExpired = jest.fn();

    beforeEach(() => {
        mockOnExpired.mockClear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('displays correct time remaining', () => {
        const bookedAt = new Date('2024-01-01T10:00:00Z').toISOString();
        const timeLimitSeconds = 300; // 5 minutes

        // Mock current time to be 2 minutes after booking
        jest.setSystemTime(new Date('2024-01-01T10:02:00Z'));

        render(
            <Timer bookedAt={bookedAt} timeLimitSeconds={timeLimitSeconds} onExpired={mockOnExpired} />
        );

        expect(screen.getByText('Осталось: 3:00')).toBeInTheDocument();
    });

    it('shows expired message when time is up', () => {
        const bookedAt = new Date('2024-01-01T10:00:00Z').toISOString();
        const timeLimitSeconds = 300; // 5 minutes

        // Mock current time to be 6 minutes after booking (expired)
        jest.setSystemTime(new Date('2024-01-01T10:06:00Z'));

        render(
            <Timer bookedAt={bookedAt} timeLimitSeconds={timeLimitSeconds} onExpired={mockOnExpired} />
        );

        expect(screen.getByText('Время истекло')).toBeInTheDocument();
    });

    it('calls onExpired when timer reaches zero', () => {
        const bookedAt = new Date('2024-01-01T10:00:00Z').toISOString();
        const timeLimitSeconds = 60; // 1 minute

        // Mock current time to be 1 minute after booking
        jest.setSystemTime(new Date('2024-01-01T10:01:00Z'));

        render(
            <Timer bookedAt={bookedAt} timeLimitSeconds={timeLimitSeconds} onExpired={mockOnExpired} />
        );

        expect(mockOnExpired).toHaveBeenCalled();
    });

    it('shows warning color when less than 1 minute remaining', () => {
        const bookedAt = new Date('2024-01-01T10:00:00Z').toISOString();
        const timeLimitSeconds = 300; // 5 minutes

        // Mock current time to be 4 minutes 30 seconds after booking
        jest.setSystemTime(new Date('2024-01-01T10:04:30Z'));

        render(
            <Timer bookedAt={bookedAt} timeLimitSeconds={timeLimitSeconds} onExpired={mockOnExpired} />
        );

        const timerElement = screen.getByText('Осталось: 0:30');
        expect(timerElement).toHaveClass('text-yellow-500');
    });

    it('shows expired color when time is up', () => {
        const bookedAt = new Date('2024-01-01T10:00:00Z').toISOString();
        const timeLimitSeconds = 300; // 5 minutes

        // Mock current time to be 6 minutes after booking (expired)
        jest.setSystemTime(new Date('2024-01-01T10:06:00Z'));

        render(
            <Timer bookedAt={bookedAt} timeLimitSeconds={timeLimitSeconds} onExpired={mockOnExpired} />
        );

        const timerElement = screen.getByText('Время истекло');
        expect(timerElement).toHaveClass('text-red-500');
    });
});
