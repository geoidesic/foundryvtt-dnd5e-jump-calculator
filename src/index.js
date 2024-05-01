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
    <h2>{{5eJumpCalc.longJumpTitle}}</h2>
    <p>PHB p182</p>
    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>
    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>
    {{5eJumpCalc.longJumpPost}}
</div>
`;
const highJumpPost = `
<p>{{5eJumpCalc.highJumpPost}}</p>
`;
const longJumpPost = `
<p>{{5eJumpCalc.longJumpPost}}</p>
`;
const highJumpTextTemplate = `
<div class="geoidesic-5e-jump-calc">
    <h2>High Jump</h2>
    <p>PHB p182</p>
    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>
    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>
    <p><strong>Reach</strong>: <span class="lozenge">+{{reach}}</span></p>
    {{5eJumpCalc.highJumpPost}}
</div>
`;

function convertDecimalToFeet(decimalFeet) {
    // Split the decimal feet into integer and fractional parts
    const integerFeet = Math.floor(decimalFeet);
    const fractionalFeet = decimalFeet - integerFeet;
    // Convert the fractional part to inches (1 foot = 12 inches)
    const inches = Math.round(fractionalFeet * 12);
    // Return the result as a string in the format "feet' inches""
    return `${integerFeet}' ${inches}"`;
}

function convertFeetAndInchesToDecimal(feet, inches) {
    // Convert feet to inches and add to inches value
    const totalInches = feet * 12 + inches;
    // Convert total inches to decimal feet
    const decimalFeet = totalInches / 12;
    return decimalFeet.toFixed(1); // Return as a string with one decimal place
}

function calculateLongJump(strength, type='standing') {
    const distance = (type == 'running' ? strength : strength / 2).toString();
    return convertDecimalToFeet(distance);
}
function calculateHighJump(strMod, type='standing') {
    // 3 + your Strength modifier
    const distance = (type == 'running' ? 3 + Number(strMod) : (3 + Number(strMod)) / 2).toString();
    return convertDecimalToFeet(distance);
    
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
    const distance = String(reachFeet) + '.' + String(reachInches);
    return convertDecimalToFeet(distance);
}


const sheetContent = `
    <div class="pills-group">
        <h3 class="icon">
            <i class="fas fa-person-running"></i>
            <span class="roboto-upper">Jump Calculator</span>
        </h3>
        <ul class="pills">
            <li class="pill geoidesic-5e-button">
                <span class="label" id="renderHighJumpButton">High jump</span>
            </li>
            <li class="pill geoidesic-5e-button">
                <span class="label" id="renderLongJumpButton">Long jump</span>
            </li>
        </ul>
    </div>
`;


Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
    // console.log(html);
    const lastPillGroup = html.find('.pills-group:last-of-type');
    lastPillGroup.after(sheetContent);

    const strength = app.document.system.abilities.str.value || 10;
    const strMod = app.document.system.abilities.str.mod || 0;
    const height = parseHeightString(app.document.system.details.height) || '6.0';

    // Add event listener to the button
    const renderHighJumpButton = html.find('#renderHighJumpButton');
    renderHighJumpButton.on('click', () => {
        // Render chat message
        ChatMessage.create({
            content: highJumpTextTemplate
            .replace("{{running_jump}}", calculateHighJump(strMod, 'running'))
            .replace("{{standing_jump}}", calculateHighJump(strMod, 'standing'))
            .replace("{{5eJumpCalc.highJumpTitle}}", game.i18n.localize('5eJumpCalc.highJumpTitle'))
            .replace("{{5eJumpCalc.highJumpPost}}", game.i18n.localize('5eJumpCalc.highJumpPost'))
            .replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize('5eJumpCalc.10FtFirst'))
            .replace("{{reach}}", calculateReach(height))
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
            .replace("{{5eJumpCalc.longJumpTitle}}", game.i18n.localize('5eJumpCalc.longJumpTitle'))
            .replace("{{5eJumpCalc.longJumpPost}}", game.i18n.localize('5eJumpCalc.longJumpPost'))
            .replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize('5eJumpCalc.10FtFirst'))
            ,
            speaker: ChatMessage.getSpeaker({ actor: app.actor }),
        });
    });
});
