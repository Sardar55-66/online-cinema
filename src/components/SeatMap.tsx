'use client';

import type { Seat, SeatFromAPI } from '@/types';

interface SeatMapProps {
    rows: number;
    seatsPerRow: number;
    bookedSeats: SeatFromAPI[];
    onSeatSelect: (seats: Seat[]) => void;
    selectedSeats: Seat[];
}

export function SeatMap({
    rows,
    seatsPerRow,
    bookedSeats,
    onSeatSelect,
    selectedSeats,
}: SeatMapProps) {
    // Фиксированное количество рядов и мест
    const FIXED_ROWS = 6;
    const FIXED_SEATS_PER_ROW = 10;


    const isSeatBooked = (row: number, seat: number) => {
        return bookedSeats.some((s) => s.rowNumber === row && s.seatNumber === seat);
    };

    const isSeatSelected = (row: number, seat: number) => {
        return selectedSeats.some((s) => s.row === row && s.seat === seat);
    };

    const handleSeatClick = (row: number, seat: number) => {
        if (isSeatBooked(row, seat)) return;

        const seatObj = { row, seat };
        const isSelected = isSeatSelected(row, seat);

        if (isSelected) {
            onSeatSelect(selectedSeats.filter((s) => !(s.row === row && s.seat === seat)));
        } else {
            onSeatSelect([...selectedSeats, seatObj]);
        }
    };

    const getSeatStyle = (row: number, seat: number): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            transition: 'all 0.2s',
            userSelect: 'none',
            border: '2px solid',
        };

        if (isSeatBooked(row, seat)) {
            return {
                ...baseStyle,
                backgroundColor: '#E57373',
                borderColor: '#E57373',
                cursor: 'not-allowed',
            };
        }

        if (isSeatSelected(row, seat)) {
            return {
                ...baseStyle,
                backgroundColor: '#64B5F6',
                borderColor: '#64B5F6',
                cursor: 'pointer',
            };
        }

        return {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderColor: '#616161',
            cursor: 'pointer',
        };
    };

    return (
        <div style={{
            borderRadius: '8px',
            padding: '24px',
        }}>
            {/* Сетка мест */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
            }}>
                {Array.from({ length: FIXED_ROWS }, (_, rowIndex) => (
                    <div
                        key={rowIndex}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                        }}
                    >
                        {/* Номер ряда */}
                        <div style={{
                            width: '40px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#999',
                            textAlign: 'right',
                        }}>
                            ряд {rowIndex + 1}
                        </div>

                        {/* Места в ряду */}
                        <div style={{
                            display: 'flex',
                            gap: '20px',
                        }}>
                            {Array.from({ length: FIXED_SEATS_PER_ROW }, (_, seatIndex) => {
                                const row = rowIndex + 1;
                                const seat = seatIndex + 1;

                                return (
                                    <div
                                        key={seatIndex}
                                        onClick={() => handleSeatClick(row, seat)}
                                        style={getSeatStyle(row, seat)}
                                    >
                                        {seat}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Легенда */}
            <div style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                fontSize: '14px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'transparent',
                        border: '2px solid #616161',
                        borderRadius: '4px',
                    }}></div>
                    <span style={{ color: '#999' }}>Свободно</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#64B5F6',
                        border: '2px solid #64B5F6',
                        borderRadius: '4px',
                    }}></div>
                    <span style={{ color: '#999' }}>Выбрано</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#E57373',
                        border: '2px solid #E57373',
                        borderRadius: '4px',
                    }}></div>
                    <span style={{ color: '#999' }}>Занято</span>
                </div>
            </div>


            {/* Выбранные места */}
            {selectedSeats.length > 0 && (
                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '14px', color: '#999' }}>
                        Выбрано мест: {selectedSeats.length}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {selectedSeats.map((s) => `ряд ${s.row}, место ${s.seat}`).join(' | ')}
                    </p>
                </div>
            )}
        </div>
    );
}
