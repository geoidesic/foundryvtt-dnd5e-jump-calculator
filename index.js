function e(e2) {
  const n2 = Math.floor(e2), a2 = Math.round(1e10 * (e2 - n2)) / 1e10;
  return `${n2}' ${Math.floor(12 * a2)}"`;
}
function n(e2, n2) {
  let a2 = e2;
  if (!n2.effects.size)
    return e2;
  let s2 = [];
  for (let e3 of n2.effects)
    if (console.log(e3), console.log(e3.changes), console.log(e3.changes.length), e3.changes?.length && !e3.isSuppressed && !e3.disabled)
      for (let n3 of e3.changes)
        console.log(n3), "dnd5e.foundryvtt-dnd5e-jump-calculator" === n3.key && s2.push(n3);
  s2.sort((e3, n3) => (e3.priority || 0) - (n3.priority || 0));
  for (let e3 of s2)
    switch (console.log(e3), console.log(e3.mode), e3.mode) {
      case 1:
        a2 *= e3.value;
        break;
      case 2:
        a2 += e3.value;
        break;
      case 3:
        a2 = Math.min(a2, e3.value);
        break;
      case 4:
        a2 = Math.max(a2, e3.value);
        break;
      case 5:
        a2 = e3.value;
    }
  return a2;
}
function a(a2, s2, t2) {
  const o2 = n(function(e2, n2) {
    return ("running" == n2 ? e2 : e2 / 2).toString();
  }(a2, s2), t2);
  return e(o2);
}
function s(a2, s2, t2) {
  const o2 = n(function(e2, n2) {
    return ("running" == n2 ? 3 + Number(e2) : (3 + Number(e2)) / 2).toString();
  }(a2, s2), t2);
  return e(o2);
}
function t(n2) {
  const a2 = n2.split("."), s2 = Number(a2[0]), t2 = Number(a2[1]);
  let o2 = s2 + s2 / 2, c2 = t2 + t2 / 2;
  c2 > 12 && (o2 += 1, c2 -= 12);
  const r2 = function(e2, n3) {
    const a3 = 12 * Number(e2) + Number(n3);
    return (a3 / 12).toFixed(1);
  }(o2, c2);
  return e(r2);
}
const o = '\n<div class="geoidesic-5e-jump-calc">\n    <h2>{{5eJumpCalc.longJumpTitle}}</h2>\n    <p>PHB p182</p>\n    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>\n    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>\n    {{5eJumpCalc.longJumpPost}}\n</div>\n', c = '\n<div class="geoidesic-5e-jump-calc">\n    <h2>High Jump</h2>\n    <p>PHB p182</p>\n    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>\n    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>\n    <p><strong>Reach</strong>: <span class="lozenge">+{{reach}}</span></p>\n    {{5eJumpCalc.highJumpPost}}\n</div>\n', r = '\n    <div class="pills-group">\n        <h3 class="icon">\n            <i class="fas fa-person-running"></i>\n            <span class="roboto-upper">Jump Calculator</span>\n        </h3>\n        <ul class="pills">\n            <li class="pill geoidesic-5e-button">\n                <span class="label" id="renderHighJumpButton">High jump</span>\n            </li>\n            <li class="pill geoidesic-5e-button">\n                <span class="label" id="renderLongJumpButton">Long jump</span>\n            </li>\n        </ul>\n    </div>\n', l = (e2, n2) => {
  const r2 = e2.document.system.abilities.str.value || 10, l2 = e2.document.system.abilities.str.mod || 0, i = function(e3) {
    if (!e3)
      return null;
    const n3 = e3.match(/('|\s)(\d{1,3}")/gm);
    return e3.match(/^(\d{1,3}|\d\s|\d")/gm)[0] + "." + n3[0].replace(/["\s]/g, "");
  }(e2.document.system.details.height);
  n2.find("#renderHighJumpButton").on("click", () => {
    console.log("app", e2), i ? ChatMessage.create({ content: c.replace("{{running_jump}}", s(l2, "running", e2.actor)).replace("{{standing_jump}}", s(l2, "standing", e2.actor)).replace("{{5eJumpCalc.highJumpTitle}}", game.i18n.localize("5eJumpCalc.highJumpTitle")).replace("{{5eJumpCalc.highJumpPost}}", game.i18n.localize("5eJumpCalc.highJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")).replace("{{reach}}", t(i)), speaker: ChatMessage.getSpeaker({ actor: e2.actor }) }) : ChatMessage.create({ content: "<h2>High Jump</h2><p>This character's height has not been set. Please set the height in the Biography tab of the character sheet.</p>", speaker: ChatMessage.getSpeaker({ actor: e2.actor }) });
  });
  n2.find("#renderLongJumpButton").on("click", () => {
    ChatMessage.create({ content: o.replace("{{running_jump}}", a(r2, "running", e2.actor)).replace("{{standing_jump}}", a(r2, "standing", e2.actor)).replace("{{5eJumpCalc.longJumpTitle}}", game.i18n.localize("5eJumpCalc.longJumpTitle")).replace("{{5eJumpCalc.longJumpPost}}", game.i18n.localize("5eJumpCalc.longJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")), speaker: ChatMessage.getSpeaker({ actor: e2.actor }) });
  });
};
Hooks.once("ready", (e2, n2, a2) => {
}), Hooks.on("renderActorSheet5eCharacter", (e2, n2, a2) => {
  if (game.modules.has("tidy5e-sheet") && "Tidy5eCharacterSheet" === e2.constructor.name) {
    const a3 = n2.find(".main-panel .small-gap"), s2 = $(r);
    s2.addClass("tidy5e");
    const t2 = s2.find(".pill");
    t2.css("color", "white"), t2.css("border-radius", "3px"), t2.css("width", "5rem"), t2.css("margin", "2px 0"), t2.css("padding", "2px 5px"), t2.css("cursor", "pointer"), t2.css("background-color", "var(--t5e-checkbox-outline-color)"), t2.css("border", "1px solid var(--dnd5e-color-tan)"), a3.after(s2), l(e2, n2);
  } else {
    n2.find(".pills-group:last-of-type").after(r), l(e2, n2);
  }
});
//# sourceMappingURL=index.js.map
