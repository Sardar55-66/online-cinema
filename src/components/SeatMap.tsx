'use client';

import type { Seat, SeatFromAPI } from '@/types';
import { SEAT_MAP, SEAT_COLORS, TIME } from '@/constants';

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
            width: `${SEAT_MAP.SEAT_SIZE_PX}px`,
            height: `${SEAT_MAP.SEAT_SIZE_PX}px`,
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
                backgroundColor: SEAT_COLORS.BOOKED_BACKGROUND,
                borderColor: SEAT_COLORS.BOOKED_BORDER,
                cursor: 'not-allowed',
            };
        }

        if (isSeatSelected(row, seat)) {
            return {
                ...baseStyle,
                backgroundColor: SEAT_COLORS.SELECTED_BACKGROUND,
                borderColor: SEAT_COLORS.SELECTED_BORDER,
                cursor: 'pointer',
            };
        }

        return {
            ...baseStyle,
            backgroundColor: SEAT_COLORS.AVAILABLE_BACKGROUND,
            borderColor: SEAT_COLORS.AVAILABLE_BORDER,
            cursor: 'pointer',
        };
    };

    return (
        <div
            style={{
                borderRadius: '8px',
                padding: `${SEAT_MAP.PADDING}px`,
            }}
        >
            {/* Сетка мест */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: `${SEAT_MAP.ROW_GAP}px`,
                }}
            >
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', alignItems: 'center', gap: `${SEAT_MAP.ROW_GAP}px` }}>
                        {/* Номер ряда */}
                        <div
                            style={{
                                width: `${SEAT_MAP.SEAT_SIZE_PX}px`,
                                fontSize: '14px',
                                fontWeight: '600',
                                color: SEAT_COLORS.TEXT_COLOR,
                                textAlign: 'right',
                            }}
                        >
                            ряд {rowIndex + 1}
                        </div>

                        {/* Места в ряду */}
                        <div style={{ display: 'flex', gap: `${SEAT_MAP.SEAT_GAP}px` }}>
                            {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                                const row = rowIndex + 1;
                                const seat = seatIndex + 1;

                                return (
                                    <div key={seatIndex} onClick={() => handleSeatClick(row, seat)} style={getSeatStyle(row, seat)}>
                                        {seat}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Легенда */}
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: `${SEAT_MAP.LEGEND_GAP}px`, fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: `${SEAT_COLORS.LEGEND_GAP}px` }}>
                    <div
                        style={{
                            width: `${SEAT_COLORS.LEGEND_INDICATOR_SIZE}px`,
                            height: `${SEAT_COLORS.LEGEND_INDICATOR_SIZE}px`,
                            backgroundColor: SEAT_COLORS.AVAILABLE_BACKGROUND,
                            border: `2px solid ${SEAT_COLORS.AVAILABLE_BORDER}`,
                            borderRadius: '4px',
                        }}
                    ></div>
                    <span style={{ color: SEAT_COLORS.TEXT_COLOR }}>Свободно</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: `${SEAT_COLORS.LEGEND_GAP}px` }}>
                    <div
                        style={{
                            width: `${SEAT_COLORS.LEGEND_INDICATOR_SIZE}px`,
                            height: `${SEAT_COLORS.LEGEND_INDICATOR_SIZE}px`,
                            backgroundColor: SEAT_COLORS.SELECTED_BACKGROUND,
                            border: `2px solid ${SEAT_COLORS.SELECTED_BORDER}`,
                            borderRadius: '4px',
                        }}
                    ></div>
                    <span style={{ color: SEAT_COLORS.TEXT_COLOR }}>Выбрано</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: `${SEAT_COLORS.LEGEND_GAP}px` }}>
                    <div
                        style={{
                            width: `${SEAT_COLORS.LEGEND_INDICATOR_SIZE}px`,
                            height: `${SEAT_COLORS.LEGEND_INDICATOR_SIZE}px`,
                            backgroundColor: SEAT_COLORS.BOOKED_BACKGROUND,
                            border: `2px solid ${SEAT_COLORS.BOOKED_BORDER}`,
                            borderRadius: '4px',
                        }}
                    ></div>
                    <span style={{ color: SEAT_COLORS.TEXT_COLOR }}>Занято</span>
                </div>
            </div>

            {/* Выбранные места */}
            {selectedSeats.length > 0 && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: SEAT_COLORS.TEXT_COLOR }}>Выбрано мест: {selectedSeats.length}</p>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {selectedSeats.map((s) => `ряд ${s.row}, место ${s.seat}`).join(' | ')}
                    </p>
                </div>
            )}
        </div>
    );
}
