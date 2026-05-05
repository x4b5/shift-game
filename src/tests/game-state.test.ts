import { describe, it, expect } from 'vitest';
import { createInitialState, startLevel, submitInput } from '$lib/game/engine';
import type { GameState, Cell } from '$lib/game/types';

describe('game state', () => {
	it('creates initial state with default values', () => {
		const state = createInitialState();

		expect(state.phase).toBe('idle');
		expect(state.score).toBe(0);
		expect(state.lives).toBe(3);
		expect(state.level.number).toBe(1);
		expect(state.level.gridSize).toBe(3);
		expect(state.pattern).toEqual([]);
		expect(state.playerInput).toEqual([]);
	});

	it('transitions to memorize phase when level starts', () => {
		const state = createInitialState();
		const next = startLevel(state);

		expect(next.phase).toBe('memorize');
		expect(next.pattern.length).toBeGreaterThan(0);
		expect(next.pattern.length).toBe(next.level.patternLength);
	});

	it('never mutates the original state', () => {
		const state = createInitialState();
		const next = startLevel(state);

		expect(state.phase).toBe('idle');
		expect(state.pattern).toEqual([]);
		expect(next).not.toBe(state);
	});
});

describe('pattern generation', () => {
	it('generates a pattern with valid grid positions', () => {
		const state = startLevel(createInitialState());

		for (const cell of state.pattern) {
			expect(cell.row).toBeGreaterThanOrEqual(0);
			expect(cell.row).toBeLessThan(state.level.gridSize);
			expect(cell.col).toBeGreaterThanOrEqual(0);
			expect(cell.col).toBeLessThan(state.level.gridSize);
			expect(cell.symbol).not.toBeNull();
		}
	});

	it('generates unique positions (no duplicates)', () => {
		const state = startLevel(createInitialState());
		const positions = state.pattern.map((c) => `${c.row},${c.col}`);
		const unique = new Set(positions);

		expect(unique.size).toBe(positions.length);
	});
});

describe('input submission', () => {
	it('transitions to result phase after submitting input', () => {
		const playing = startLevel(createInitialState());
		const input: Cell[] = playing.pattern.map((c) => ({ ...c }));
		const result = submitInput(playing, input);

		expect(result.phase).toBe('result');
	});

	it('awards points for correct input', () => {
		const playing = startLevel(createInitialState());
		const input: Cell[] = playing.pattern.map((c) => ({ ...c }));
		const result = submitInput(playing, input);

		expect(result.score).toBeGreaterThan(0);
	});

	it('loses a life for incorrect input', () => {
		const playing = startLevel(createInitialState());
		const wrongInput: Cell[] = [{ row: 99, col: 99, symbol: '✕' }];
		const result = submitInput(playing, wrongInput);

		expect(result.lives).toBe(playing.lives - 1);
	});

	it('does not lose a life for correct input', () => {
		const playing = startLevel(createInitialState());
		const input: Cell[] = playing.pattern.map((c) => ({ ...c }));
		const result = submitInput(playing, input);

		expect(result.lives).toBe(playing.lives);
	});
});
