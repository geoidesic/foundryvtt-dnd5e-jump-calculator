function n(n2) {
  const e2 = Math.floor(n2), t2 = Math.round(1e10 * (n2 - e2)) / 1e10;
  return `${e2}' ${Math.floor(12 * t2)}"`;
}
function e(e2, t2 = "standing") {
  const a2 = function(n2, e3 = "standing") {
    return ("running" == e3 ? n2 : n2 / 2).toString();
  }(e2, t2);
  return n(a2);
}
function t(e2, t2 = "standing") {
  const a2 = function(n2, e3 = "standing") {
    return ("running" == e3 ? 3 + Number(n2) : (3 + Number(n2)) / 2).toString();
  }(e2, t2);
  return n(a2);
}
function a(e2) {
  const t2 = e2.split("."), a2 = Number(t2[0]), s2 = Number(t2[1]);
  let l2 = a2 + a2 / 2, p = s2 + s2 / 2;
  p > 12 && (l2 += 1, p -= 12);
  const i = function(n2, e3) {
    const t3 = 12 * Number(n2) + Number(e3);
    return (t3 / 12).toFixed(1);
  }(l2, p);
  return console.log(i), n(i);
}
const s = '\n<div class="geoidesic-5e-jump-calc">\n    <h2>{{5eJumpCalc.longJumpTitle}}</h2>\n    <p>PHB p182</p>\n    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>\n    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>\n    {{5eJumpCalc.longJumpPost}}\n</div>\n', l = '\n<div class="geoidesic-5e-jump-calc">\n    <h2>High Jump</h2>\n    <p>PHB p182</p>\n    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>\n    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>\n    <p><strong>Reach</strong>: <span class="lozenge">+{{reach}}</span></p>\n    {{5eJumpCalc.highJumpPost}}\n</div>\n';
Hooks.on("renderActorSheet5eCharacter", (n2, p, i) => {
  p.find(".pills-group:last-of-type").after('\n    <div class="pills-group">\n        <h3 class="icon">\n            <i class="fas fa-person-running"></i>\n            <span class="roboto-upper">Jump Calculator</span>\n        </h3>\n        <ul class="pills">\n            <li class="pill geoidesic-5e-button">\n                <span class="label" id="renderHighJumpButton">High jump</span>\n            </li>\n            <li class="pill geoidesic-5e-button">\n                <span class="label" id="renderLongJumpButton">Long jump</span>\n            </li>\n        </ul>\n    </div>\n');
  const c = n2.document.system.abilities.str.value || 10, u = n2.document.system.abilities.str.mod || 0, o = function(n3) {
    const e2 = n3.match(/('|\s)(\d{1,3}")/gm);
    return n3.match(/^(\d{1,3}|\d\s|\d")/gm)[0] + "." + e2[0].replace(/["\s]/g, "");
  }(n2.document.system.details.height) || "6.0";
  p.find("#renderHighJumpButton").on("click", () => {
    ChatMessage.create({ content: l.replace("{{running_jump}}", t(u, "running")).replace("{{standing_jump}}", t(u, "standing")).replace("{{5eJumpCalc.highJumpTitle}}", game.i18n.localize("5eJumpCalc.highJumpTitle")).replace("{{5eJumpCalc.highJumpPost}}", game.i18n.localize("5eJumpCalc.highJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")).replace("{{reach}}", a(o)), speaker: ChatMessage.getSpeaker({ actor: n2.actor }) });
  });
  p.find("#renderLongJumpButton").on("click", () => {
    ChatMessage.create({ content: s.replace("{{running_jump}}", e(c, "running")).replace("{{standing_jump}}", e(c, "standing")).replace("{{5eJumpCalc.longJumpTitle}}", game.i18n.localize("5eJumpCalc.longJumpTitle")).replace("{{5eJumpCalc.longJumpPost}}", game.i18n.localize("5eJumpCalc.longJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")), speaker: ChatMessage.getSpeaker({ actor: n2.actor }) });
  });
});
//# sourceMappingURL=index.js.map
