import JumpCalc from './view/JumpCalc.js';
import '../styles/init.scss'; // Import any styles as this includes them in the build.


function parseHeightString(heightString) {
    // Regular expression to match patterns for feet and inches
    const inchesRegex = /('|\s)(\d")/gm;
    const feetRegex = /^(\d|\d\s|\d")/gm;

    // Execute the regular expressions on the input height string
    const inchesMatch = heightString.match(inchesRegex);
    const feetMatch = heightString.match(feetRegex);


    const feet = feetMatch[0];
    const inches = inchesMatch[0].replace(/["\s]/g, '');
    // Return the height as a string in the format "<feet>.<inches>"
    return feet + '.' + inches;
}

const longJumpTextTemplate = `
<div class="geoidesic-5e-jump-calc">
<h2>Long Jump</h2>
<p>PHB p182</p>
<p><strong>Running jump</strong> (10' move first): <span class="lozenge">{{running_jump}} ft</span></p>
<p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}} ft</span></p>
{{post}}
</div>
`;
const highJumpPost = `
<p>Either way, each foot you clear on the jump costs a foot of movement. In some circumstances, your DM might allow you to make a Strength (Athletics) check to jump higher than you normally can.
You can extend your arms half your height above yourself during the jump. Thus, you can reach above you a distance equal to the height of the jump plus 1½ times your height.
</p>
`;
const longJumpPost = `
<p>Either way, each foot you clear on the jump costs a foot of movement.
This rule assumes that the height of your jump doesn't matter, such as a jump across a stream or chasm. At your DM's option, you must succeed on a DC 10 Strength (Athletics) check to clear a low obstacle (no taller than a quarter of the jump's distance), such as a hedge or low wall. Otherwise, you hit it.
When you land in difficult terrain, you must succeed on a DC 10 Dexterity (Acrobatics) check to land on your feet. Otherwise, you land prone.
</p>
`;
const highJumpTextTemplate = `
<div class="geoidesic-5e-jump-calc">
<h2>High Jump</h2>
<p>PHB p182</p>
<p><strong>Running jump</strong> (10' move first): <span class="lozenge">{{running_jump}} ft</span></p>
<p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}} ft</span></p>
<p><strong>Reach</strong>: <span class="lozenge">+{{reach}} ft</span></p>
{{post}}
</div>
`;

function calculateLongJump(strength, type='standing') {
    return (type == 'running' ? strength : strength / 2).toString();
}
function calculateHighJump(strength, type='standing') {
    return (type == 'running' ? strength : strength / 2).toString();
}
function calculateReach(height) {
    // split height string by '.' character
    const split = height.split('.');
    const feet = Number(split[0]);
    const inches = Number(split[1]);
    const halfInches = inches / 2;
    const halfFeet = feet / 2;
    const reachFeet = feet + halfFeet;
    const reachInches = inches + halfInches;
    if(reachInches > 12) {
        reachFeet += 1;
        reachInches -= 12;
    }
    return String(reachFeet) + '.' + String(reachInches);
}


Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
    // console.log(html);
    const lastPillGroup = html.find('.pills-group:last-of-type');
    const sheetContent = `
    <div class="pills-group">
        <h3 class="icon">
            <i class="fas fa-flag"></i>
            <span class="roboto-upper">Geoidesic plugins</span>
        </h3>
        <button class="geoidesic-5e-button" id="renderHighJumpButton">High jump!</button>
        <button class="geoidesic-5e-button" id="renderLongJumpButton">Long jump!</button>
    </div>
    `;
    lastPillGroup.after(sheetContent);

    const strength = app.document.system.abilities.str.value || 10;
    const height = parseHeightString(app.document.system.details.height) || '6.0';

    // Add event listener to the button
    const renderHighJumpButton = html.find('#renderHighJumpButton');
    renderHighJumpButton.on('click', () => {
        // Render chat message
        ChatMessage.create({
            content: highJumpTextTemplate
            .replace("{{running_jump}}", calculateHighJump(strength, 'running'))
            .replace("{{standing_jump}}", calculateHighJump(strength, 'standing'))
            .replace("{{reach}}", calculateReach(height))
            .replace("{{post}}", highJumpPost)
            ,
            speaker: ChatMessage.getSpeaker({ actor: app.actor }),
        });
    });
    const renderLongJumpButton = html.find('#renderLongJumpButton');
    renderLongJumpButton.on('click', () => {
        // Render chat message
        ChatMessage.create({
            content: longJumpTextTemplate
            .replace("{{running_jump}}", calculateLongJump(strength, 'running'))
            .replace("{{standing_jump}}", calculateLongJump(strength, 'standing'))
            .replace("{{post}}", longJumpPost)
            ,
            speaker: ChatMessage.getSpeaker({ actor: app.actor }),
        });
    });

});
