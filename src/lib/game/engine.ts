import type { GameState, Level, Cell, Symbol } from './types';

export const GAME_NAME = 'SHIFT';

const SYMBOLS: Symbol[] = ['▲', '■', '●', '✦', '◆', '✕'];

const BASE_DISPLAY_TIME = 2000;
const MIN_DISPLAY_TIME = 500;
const DISPLAY_TIME_DECAY = 200; // ms less per level

export function getLevelConfig(levelNumber: number): Level {
	const gridSize = 3 + Math.floor((levelNumber - 1) / 3);
	const patternLength = 2 + levelNumber;
	const displayTime = Math.max(
		MIN_DISPLAY_TIME,
		BASE_DISPLAY_TIME - (levelNumber - 1) * DISPLAY_TIME_DECAY,
	);

	return {
		number: levelNumber,
		gridSize,
		patternLength,
		displayTime,
	};
}

export function createInitialState(): GameState {
	return {
		phase: 'idle',
		level: getLevelConfig(1),
		pattern: [],
		playerInput: [],
		score: 0,
		lives: 3,
	};
}

export function nextLevel(state: GameState): GameState {
	// Game over check
	if (state.lives <= 0) {
		return { ...state, phase: 'game_over' };
	}

	// Did the player get it right? Check if score increased
	const wasCorrect = state.score > 0 && state.playerInput.length === state.pattern.length &&
		checkAnswer(state.pattern, state.playerInput);

	const nextLevelNumber = wasCorrect ? state.level.number + 1 : state.level.number;
	const level = getLevelConfig(nextLevelNumber);
	const pattern = generatePattern(level);

	return {
		...state,
		phase: 'memorize',
		level,
		pattern,
		playerInput: [],
	};
}

export function startLevel(state: GameState): GameState {
	const pattern = generatePattern(state.level);

	return {
		...state,
		phase: 'memorize',
		pattern,
		playerInput: [],
	};
}

export function submitInput(state: GameState, input: ReadonlyArray<Cell>): GameState {
	const isCorrect = checkAnswer(state.pattern, input);

	return {
		...state,
		phase: 'result',
		playerInput: input,
		score: isCorrect ? state.score + calculateScore(state.level) : state.score,
		lives: isCorrect ? state.lives : state.lives - 1,
	};
}

function checkAnswer(
	pattern: ReadonlyArray<Cell>,
	input: ReadonlyArray<Cell>,
): boolean {
	if (pattern.length !== input.length) return false;

	return pattern.every((cell, i) => {
		const submitted = input[i];
		return (
			cell.row === submitted.row &&
			cell.col === submitted.col &&
			cell.symbol === submitted.symbol
		);
	});
}

function calculateScore(level: Level): number {
	return level.number * level.patternLength * 10;
}

function generatePattern(level: Level): Cell[] {
	const positions = generateUniquePositions(level.gridSize, level.patternLength);

	return positions.map(([row, col]) => ({
		row,
		col,
		symbol: randomSymbol(),
	}));
}

function generateUniquePositions(gridSize: number, count: number): [number, number][] {
	const all: [number, number][] = [];
	for (let r = 0; r < gridSize; r++) {
		for (let c = 0; c < gridSize; c++) {
			all.push([r, c]);
		}
	}

	// Fisher-Yates shuffle, pick first `count`
	for (let i = all.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[all[i], all[j]] = [all[j], all[i]];
	}

	return all.slice(0, count);
}

function randomSymbol(): Symbol {
	return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}
