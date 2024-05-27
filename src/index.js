import '../styles/init.scss'; // Import any styles as this includes them in the build.
import {parseHeightString, calculateLongJump, calculateHighJump, calculateReach } from '~/helpers'
import {longJumpTextTemplate, highJumpTextTemplate, sheetContent } from '~/templates'



Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {


    const lastPillGroup = html.find('.pills-group:last-of-type');
    lastPillGroup.after(sheetContent);

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
});
