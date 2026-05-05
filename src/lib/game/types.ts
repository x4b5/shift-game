// Game types - immutable data structures

export type Symbol = '▲' | '■' | '●' | '✦' | '◆' | '✕';

export type Phase = 'idle' | 'memorize' | 'recall' | 'result' | 'game_over';

export type Cell = {
	readonly symbol: Symbol | null;
	readonly row: number;
	readonly col: number;
};

export type Grid = {
	readonly rows: number;
	readonly cols: number;
	readonly cells: ReadonlyArray<ReadonlyArray<Cell>>;
};

export type Level = {
	readonly number: number;
	readonly gridSize: number; // e.g. 3 = 3x3
	readonly patternLength: number; // how many symbols to show
	readonly displayTime: number; // ms to memorize
};

export type GameState = {
	readonly phase: Phase;
	readonly level: Level;
	readonly pattern: ReadonlyArray<Cell>;
	readonly playerInput: ReadonlyArray<Cell>;
	readonly score: number;
	readonly lives: number;
};
