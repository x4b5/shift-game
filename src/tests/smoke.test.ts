import { describe, it, expect } from 'vitest';
import { GAME_NAME } from '$lib/game/engine';

describe('project setup', () => {
	it('smoke test - project is wired correctly', () => {
		expect(GAME_NAME).toBe('SHIFT');
	});
});
