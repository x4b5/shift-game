import { describe, it, expect } from 'vitest';
import {
	createInitialState,
	startLevel,
	submitInput,
	nextLevel,
	getLevelConfig,
} from '$lib/game/engine';
import type { Cell } from '$lib/game/types';

describe('level progression', () => {
	it('advances to the next level after correct input', () => {
		const playing = startLevel(createInitialState());
		const correctInput: Cell[] = playing.pattern.map((c) => ({ ...c }));
		const result = submitInput(playing, correctInput);
		const next = nextLevel(result);

		expect(next.level.number).toBe(2);
		expect(next.phase).toBe('memorize');
		expect(next.pattern.length).toBeGreaterThan(0);
	});

	it('stays at same level after incorrect input (retry)', () => {
		const playing = startLevel(createInitialState());
		const wrongInput: Cell[] = [{ row: 99, col: 99, symbol: '✕' }];
		const result = submitInput(playing, wrongInput);
		const retry = nextLevel(result);

		expect(retry.level.number).toBe(1);
		expect(retry.phase).toBe('memorize');
	});

	it('increases grid size every 3 levels', () => {
		const lvl1 = getLevelConfig(1);
		const lvl3 = getLevelConfig(3);
		const lvl4 = getLevelConfig(4);

		expect(lvl1.gridSize).toBe(3);
		expect(lvl3.gridSize).toBe(3);
		expect(lvl4.gridSize).toBe(4);
	});

	it('increases pattern length each level', () => {
		const lvl1 = getLevelConfig(1);
		const lvl2 = getLevelConfig(2);
		const lvl5 = getLevelConfig(5);

		expect(lvl2.patternLength).toBeGreaterThan(lvl1.patternLength);
		expect(lvl5.patternLength).toBeGreaterThan(lvl2.patternLength);
	});

	it('decreases display time as level increases', () => {
		const lvl1 = getLevelConfig(1);
		const lvl5 = getLevelConfig(5);

		expect(lvl5.displayTime).toBeLessThan(lvl1.displayTime);
	});

	it('never lets display time go below 500ms', () => {
		const lvl99 = getLevelConfig(99);

		expect(lvl99.displayTime).toBeGreaterThanOrEqual(500);
	});

	it('game over when lives reach 0', () => {
		let state = createInitialState();
		state = startLevel(state);
		const wrong: Cell[] = [{ row: 99, col: 99, symbol: '✕' }];

		// Verlies 3 levens
		state = submitInput(state, wrong);
		state = nextLevel(state);
		state = submitInput(state, wrong);
		state = nextLevel(state);
		state = submitInput(state, wrong);
		const final = nextLevel(state);

		expect(final.phase).toBe('game_over');
		expect(final.lives).toBe(0);
	});
});
