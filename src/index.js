import '../styles/init.scss'; // Import any styles as this includes them in the build.
import {parseHeightString, calculateLongJump, calculateHighJump, calculateReach } from '~/helpers'
import {longJumpTextTemplate, highJumpTextTemplate, sheetContent } from '~/templates'

const JUMP_MODULE_DOM_ID = 'geoidesic-5e-jump-calculator';

const renderButtons = (app, html) => {

    const strength = app.document.system.abilities.str.value || 10;
    const strMod = app.document.system.abilities.str.mod || 0;
    const height = parseHeightString(app.document.system.details.height);

    // Add event listener to the button
    const renderHighJumpButton = html.find('#renderHighJumpButton');
    renderHighJumpButton.on('click', () => {
        console.log('app', app)
        // Render chat message
        if(!height) {
            ChatMessage.create({
                content: "<h2>High Jump</h2><p>This character's height has not been set. Please set the height in the Biography tab of the character sheet.</p>"
                ,
                speaker: ChatMessage.getSpeaker({ actor: app.actor }),
            });
        } else {
            ChatMessage.create({
                content: highJumpTextTemplate
                .replace("{{running_jump}}", calculateHighJump(strMod, 'running', app.actor))
                .replace("{{standing_jump}}", calculateHighJump(strMod, 'standing', app.actor))
                .replace("{{5eJumpCalc.highJumpTitle}}", game.i18n.localize('5eJumpCalc.highJumpTitle'))
                .replace("{{5eJumpCalc.highJumpPost}}", game.i18n.localize('5eJumpCalc.highJumpPost'))
                .replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize('5eJumpCalc.10FtFirst'))
                .replace("{{reach}}", calculateReach(height))
                +'<p>Check out <a href="https://foundryvtt.com/packages/foundryvtt-actor-studio">Actor Studio</a> for more features!</p>'
                ,
                speaker: ChatMessage.getSpeaker({ actor: app.actor }),
            });
        }
    });
    const renderLongJumpButton = html.find('#renderLongJumpButton');
    renderLongJumpButton.on('click', () => {
        // Render chat message
        ChatMessage.create({
            content: longJumpTextTemplate
            .replace("{{running_jump}}", calculateLongJump(strength, 'running', app.actor))
            .replace("{{standing_jump}}", calculateLongJump(strength, 'standing', app.actor))
            .replace("{{5eJumpCalc.longJumpTitle}}", game.i18n.localize('5eJumpCalc.longJumpTitle'))
            .replace("{{5eJumpCalc.longJumpPost}}", game.i18n.localize('5eJumpCalc.longJumpPost'))
            .replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize('5eJumpCalc.10FtFirst'))
            +'<p>Check out <a href="https://foundryvtt.com/packages/foundryvtt-actor-studio">Actor Studio</a> for more features!</p>'
            ,
            speaker: ChatMessage.getSpeaker({ actor: app.actor }),
        });
    });
}

Hooks.once("ready", (app, html, data) => {
    // CONFIG.debug.hooks = true;
});

  
const isCoreDnd5eSheet = (app) => {
    const constructorName = app?.constructor?.name;
    if (!constructorName) return false;

    // dnd5e v5+ (Foundry V15+) uses CharacterActorSheet (document sheet V2)
    if (constructorName === 'CharacterActorSheet') return true;

    // dnd5e v4 (Foundry V13 / rules 2024) uses ActorSheet5eCharacter2
    if (constructorName === 'ActorSheet5eCharacter2') return true;

    // legacy sheet pre-v4
    if (constructorName === 'ActorSheet5eCharacter') return true;

    // Some environments expose the sheet id via app.id like dnd5e.ActorSheet5eCharacter2
    if (typeof app.id === 'string' && app.id.startsWith('dnd5e.')) return true;

    return false;
};

const injectIntoCoreSheet = (app, html) => {
    const root = html.find('.pills-group:last-of-type');
    if (!root || !root.length) return;

    if (html.find(`#${JUMP_MODULE_DOM_ID}`).length) {
        html.find(`#${JUMP_MODULE_DOM_ID}`).remove();
    }

    root.after(sheetContent);
    renderButtons(app, html);
};

const injectIntoTidySheet = (app, html) => {
    const insertLocation = html.find('.main-panel .small-gap');
    if (!insertLocation || !insertLocation.length) return;

    // Remove existing injection before adding new
    const existing = html.find(`#${JUMP_MODULE_DOM_ID}`);
    if (existing.length) existing.remove();

    const templateHtml = $(sheetContent);
    templateHtml.addClass('tidy5e');

    // add styles
    const pill = templateHtml.find('.pill');
    pill.css('color', 'white');
    pill.css('border-radius', '3px');
    pill.css('width', '5rem');
    pill.css('margin', '2px 0');
    pill.css('padding', '2px 5px');
    pill.css('cursor', 'pointer');
    pill.css('background-color', 'var(--t5e-checkbox-outline-color)');
    pill.css('border', '1px solid var(--dnd5e-color-tan)');

    insertLocation.after(templateHtml);
    renderButtons(app, html);
};

const handleSheetRender = (app, html) => {
    if (game.modules.has('tidy5e-sheet') && app.constructor?.name === 'Tidy5eCharacterSheet') {
        injectIntoTidySheet(app, html);
        return;
    }

    if (isCoreDnd5eSheet(app)) {
        injectIntoCoreSheet(app, html);
    }
};

Hooks.on('renderActorSheet5eCharacter', (app, html, data) => {
    handleSheetRender(app, html, data);
});

Hooks.on('renderActorSheet5eCharacter2', (app, html, data) => {
    handleSheetRender(app, html, data);
});

Hooks.on('renderActorSheet5e', (app, html, data) => {
    handleSheetRender(app, html, data);
});

Hooks.on('renderActorSheetV2', (app) => {
    const element = app.element ?? $(app._element);
    if (!element) return;
    handleSheetRender(app, $(element));
});
