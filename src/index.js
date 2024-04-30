import JumpCalc from './view/JumpCalc.js';

Hooks.once('ready', () => new JumpCalc().render(true, { focus: true }));