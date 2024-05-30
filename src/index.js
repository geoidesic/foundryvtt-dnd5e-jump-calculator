import '../styles/init.scss'; // Import any styles as this includes them in the build.
import {parseHeightString, calculateLongJump, calculateHighJump, calculateReach } from '~/helpers'
import {longJumpTextTemplate, highJumpTextTemplate, sheetContent } from '~/templates'

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
            ,
            speaker: ChatMessage.getSpeaker({ actor: app.actor }),
        });
    });
}

Hooks.once("ready", (app, html, data) => {
    // CONFIG.debug.hooks = true;
});

  
Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
    
    if(game.modules.has("tidy5e-sheet")) {
        const insertLocation = html.find('.main-panel .small-gap');
        const templateHtml = $(sheetContent);
        templateHtml.addClass('tidy5e');

        // add styles
        const pill = templateHtml.find('.pill');
        pill.css('background-color', 'var(--color-warm-2)');
        pill.css('color', 'white');
        pill.css('border', '1px solid var(--color-dark-6)');
        pill.css('border-radius', '3px');
        pill.css('width', '5rem');
        pill.css('margin', '2px 0');
        pill.css('padding', '2px 5px');
        pill.css('cursor', 'pointer');

        // insert to DOM
        insertLocation.after(templateHtml);
        renderButtons(app, html);
    } else {
        const insertLocation = html.find('.pills-group:last-of-type');
        insertLocation.after(sheetContent);
        renderButtons(app, html);
    }
});
