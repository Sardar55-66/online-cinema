import { fireEvent, render, screen } from '@testing-library/react';
import type { Seat } from '@/types';
import { SeatMap } from '@/components/SeatMap';

describe('SeatMap Component', () => {
    const mockOnSeatSelect = jest.fn();
    const defaultProps = {
        rows: 3,
        seatsPerRow: 4,
        bookedSeats: [{ rowNumber: 1, seatNumber: 1 }],
        onSeatSelect: mockOnSeatSelect,
        selectedSeats: [],
    };

    beforeEach(() => {
        mockOnSeatSelect.mockClear();
    });

    it('renders correct number of seats', () => {
        render(<SeatMap {...defaultProps} />);

        const seatNumbers = screen.getAllByText(/\d+/).filter(el =>
            el.textContent && /^[1-9]|10$/.test(el.textContent.trim())
        );
        expect(seatNumbers).toHaveLength(60);
    });

    it('shows booked seats as disabled', () => {
        render(<SeatMap {...defaultProps} />);

        const bookedSeat = screen.getByText('1', { selector: 'div[style*="rgb(229, 115, 115)"]' });
        expect(bookedSeat).toHaveStyle('background-color: rgb(229, 115, 115)'); // red-300
        expect(bookedSeat).toHaveStyle('cursor: not-allowed');
    });

    it('allows selecting free seats', () => {
        render(<SeatMap {...defaultProps} />);

        const freeSeats = screen.getAllByText('2');
        const seatElement = freeSeats.find(el =>
            el.closest('div')?.style.backgroundColor === 'transparent'
        );
        expect(seatElement).toBeDefined();
        fireEvent.click(seatElement!);

        expect(mockOnSeatSelect).toHaveBeenCalledWith([{ row: 1, seat: 2 }]);
    });

    it('allows deselecting selected seats', () => {
        const selectedSeats = [{ row: 2, seat: 2 }];
        render(<SeatMap {...defaultProps} selectedSeats={selectedSeats} />);

        const seatElements = screen.getAllByText('2');
        const seatElement = seatElements.find(el =>
            el.closest('div')?.style.backgroundColor === 'rgb(100, 181, 246)'
        );
        expect(seatElement).toBeDefined();
        fireEvent.click(seatElement!);

        expect(mockOnSeatSelect).toHaveBeenCalledWith([]);
    });

    it('shows selected seats with correct styling', () => {
        const selectedSeats = [{ row: 2, seat: 2 }];
        render(<SeatMap {...defaultProps} selectedSeats={selectedSeats} />);

        // Ищем выбранное место по стилю
        const seatElements = screen.getAllByText('2');
        const selectedSeat = seatElements.find(el =>
            el.closest('div')?.style.backgroundColor === 'rgb(100, 181, 246)'
        );
        expect(selectedSeat?.closest('div')).toHaveStyle('background-color: rgb(100, 181, 246)');
    });

    it('displays legend correctly', () => {
        render(<SeatMap {...defaultProps} />);

        expect(screen.getByText('Свободно')).toBeInTheDocument();
        expect(screen.getByText('Выбрано')).toBeInTheDocument();
        expect(screen.getByText('Занято')).toBeInTheDocument();
    });

    it('shows selected seats count when seats are selected', () => {
        const selectedSeats = [
            { row: 2, seat: 2 },
            { row: 2, seat: 3 },
        ];
        render(<SeatMap {...defaultProps} selectedSeats={selectedSeats} />);

        expect(screen.getByText('Выбрано мест: 2')).toBeInTheDocument();
        expect(screen.getByText('ряд 2, место 2 | ряд 2, место 3')).toBeInTheDocument();
    });

    it('does not show selected seats info when no seats selected', () => {
        render(<SeatMap {...defaultProps} />);

        expect(screen.queryByText(/Выбрано мест:/)).not.toBeInTheDocument();
    });
});
