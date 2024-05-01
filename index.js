const init = "";
function parseHeightString(heightString) {
  const inchesRegex = /('|\s)(\d")/gm;
  const feetRegex = /^(\d|\d\s|\d")/gm;
  const inchesMatch = heightString.match(inchesRegex);
  const feetMatch = heightString.match(feetRegex);
  const feet = feetMatch[0];
  const inches = inchesMatch[0].replace(/["\s]/g, "");
  return feet + "." + inches;
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
  const integerFeet = Math.floor(decimalFeet);
  const fractionalFeet = decimalFeet - integerFeet;
  const inches = Math.round(fractionalFeet * 12);
  return `${integerFeet}' ${inches}"`;
}
function calculateLongJump(strength, type = "standing") {
  const distance = (type == "running" ? strength : strength / 2).toString();
  return convertDecimalToFeet(distance);
}
function calculateHighJump(strMod, type = "standing") {
  const distance = (type == "running" ? 3 + Number(strMod) : (3 + Number(strMod)) / 2).toString();
  return convertDecimalToFeet(distance);
}
function calculateReach(height) {
  const split = height.split(".");
  const feet = Number(split[0]);
  const inches = Number(split[1]);
  const halfInches = inches / 2;
  const halfFeet = feet / 2;
  const reachFeet = feet + halfFeet;
  const reachInches = inches + halfInches;
  if (reachInches > 12) {
    reachFeet += 1;
    reachInches -= 12;
  }
  const distance = String(reachFeet) + "." + String(reachInches);
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
  const lastPillGroup = html.find(".pills-group:last-of-type");
  lastPillGroup.after(sheetContent);
  const strength = app.document.system.abilities.str.value || 10;
  const strMod = app.document.system.abilities.str.mod || 0;
  const height = parseHeightString(app.document.system.details.height) || "6.0";
  const renderHighJumpButton = html.find("#renderHighJumpButton");
  renderHighJumpButton.on("click", () => {
    ChatMessage.create({
      content: highJumpTextTemplate.replace("{{running_jump}}", calculateHighJump(strMod, "running")).replace("{{standing_jump}}", calculateHighJump(strMod, "standing")).replace("{{5eJumpCalc.highJumpTitle}}", game.i18n.localize("5eJumpCalc.highJumpTitle")).replace("{{5eJumpCalc.highJumpPost}}", game.i18n.localize("5eJumpCalc.highJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")).replace("{{reach}}", calculateReach(height)),
      speaker: ChatMessage.getSpeaker({ actor: app.actor })
    });
  });
  const renderLongJumpButton = html.find("#renderLongJumpButton");
  renderLongJumpButton.on("click", () => {
    ChatMessage.create({
      content: longJumpTextTemplate.replace("{{running_jump}}", calculateLongJump(strength, "running")).replace("{{standing_jump}}", calculateLongJump(strength, "standing")).replace("{{5eJumpCalc.longJumpTitle}}", game.i18n.localize("5eJumpCalc.longJumpTitle")).replace("{{5eJumpCalc.longJumpPost}}", game.i18n.localize("5eJumpCalc.longJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")),
      speaker: ChatMessage.getSpeaker({ actor: app.actor })
    });
  });
});
//# sourceMappingURL=index.js.map
