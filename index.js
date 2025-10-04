function e(e2) {
  const n2 = Math.floor(e2), t2 = Math.round(1e10 * (e2 - n2)) / 1e10;
  return `${n2}' ${Math.floor(12 * t2)}"`;
}
function n(e2, n2) {
  let t2 = e2;
  const a2 = n2?.effects;
  if (!a2)
    return e2;
  const r2 = "function" == typeof a2[Symbol.iterator] ? a2 : "function" == typeof a2.values ? a2.values() : [];
  let o2 = [];
  for (let e3 of r2)
    if (e3.changes?.length && !e3.isSuppressed && !e3.disabled)
      for (let n3 of e3.changes)
        "dnd5e.foundryvtt-dnd5e-jump-calculator" === n3.key && o2.push(n3);
  o2.sort((e3, n3) => (e3.priority || 0) - (n3.priority || 0));
  for (let e3 of o2)
    switch (e3.mode) {
      case 1:
        t2 *= e3.value;
        break;
      case 2:
        t2 += e3.value;
        break;
      case 3:
        t2 = Math.min(t2, e3.value);
        break;
      case 4:
        t2 = Math.max(t2, e3.value);
        break;
      case 5:
        t2 = e3.value;
    }
  return t2;
}
function t(t2, a2, r2) {
  const o2 = n(function(e2, n2) {
    return ("running" == n2 ? e2 : e2 / 2).toString();
  }(t2, a2), r2);
  return e(o2);
}
function a(t2, a2, r2) {
  const o2 = n(function(e2, n2) {
    return ("running" == n2 ? 3 + Number(e2) : (3 + Number(e2)) / 2).toString();
  }(t2, a2), r2);
  return e(o2);
}
function r(n2) {
  const t2 = n2.split("."), a2 = Number(t2[0]), r2 = Number(t2[1]);
  let o2 = a2 + a2 / 2, s2 = r2 + r2 / 2;
  s2 > 12 && (o2 += 1, s2 -= 12);
  const c2 = function(e2, n3) {
    const t3 = 12 * Number(e2) + Number(n3);
    return (t3 / 12).toFixed(1);
  }(o2, s2);
  return e(c2);
}
const o = '\n<div class="geoidesic-5e-jump-calc">\n    <h2>{{5eJumpCalc.longJumpTitle}}</h2>\n    <p>PHB p182</p>\n    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>\n    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>\n    {{5eJumpCalc.longJumpPost}}\n</div>\n', s = '\n<div class="geoidesic-5e-jump-calc">\n    <h2>High Jump</h2>\n    <p>PHB p182</p>\n    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>\n    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>\n    <p><strong>Reach</strong>: <span class="lozenge">+{{reach}}</span></p>\n    {{5eJumpCalc.highJumpPost}}\n</div>\n', c = '\n    <div class="pills-group geoidesic-5e-jump-calculator" id="geoidesic-5e-jump-calculator">\n        <h3 class="icon">\n            <i class="fas fa-person-running"></i>\n            <span class="roboto-upper">Jump Calculator</span>\n        </h3>\n        <ul class="pills">\n            <li class="pill geoidesic-5e-button">\n                <span class="label" id="renderHighJumpButton">High jump</span>\n            </li>\n            <li class="pill geoidesic-5e-button">\n                <span class="label" id="renderLongJumpButton">Long jump</span>\n            </li>\n        </ul>\n    </div>\n', i = "geoidesic-5e-jump-calculator", l = (e2, n2) => {
  const c2 = e2.document.system.abilities.str.value || 10, i2 = e2.document.system.abilities.str.mod || 0, l2 = function(e3) {
    if (!e3)
      return null;
    const n3 = e3.match(/('|\s)(\d{1,3}")/gm);
    return e3.match(/^(\d{1,3}|\d\s|\d")/gm)[0] + "." + n3[0].replace(/["\s]/g, "");
  }(e2.document.system.details.height);
  n2.find("#renderHighJumpButton").on("click", () => {
    console.log("app", e2), l2 ? ChatMessage.create({ content: s.replace("{{running_jump}}", a(i2, "running", e2.actor)).replace("{{standing_jump}}", a(i2, "standing", e2.actor)).replace("{{5eJumpCalc.highJumpTitle}}", game.i18n.localize("5eJumpCalc.highJumpTitle")).replace("{{5eJumpCalc.highJumpPost}}", game.i18n.localize("5eJumpCalc.highJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")).replace("{{reach}}", r(l2)) + '<p>Check out <a href="https://foundryvtt.com/packages/foundryvtt-actor-studio">Actor Studio</a> for more features!</p>', speaker: ChatMessage.getSpeaker({ actor: e2.actor }) }) : ChatMessage.create({ content: "<h2>High Jump</h2><p>This character's height has not been set. Please set the height in the Biography tab of the character sheet.</p>", speaker: ChatMessage.getSpeaker({ actor: e2.actor }) });
  });
  n2.find("#renderLongJumpButton").on("click", () => {
    ChatMessage.create({ content: o.replace("{{running_jump}}", t(c2, "running", e2.actor)).replace("{{standing_jump}}", t(c2, "standing", e2.actor)).replace("{{5eJumpCalc.longJumpTitle}}", game.i18n.localize("5eJumpCalc.longJumpTitle")).replace("{{5eJumpCalc.longJumpPost}}", game.i18n.localize("5eJumpCalc.longJumpPost")).replace("{{5eJumpCalc.10FtFirst}}", game.i18n.localize("5eJumpCalc.10FtFirst")) + '<p>Check out <a href="https://foundryvtt.com/packages/foundryvtt-actor-studio">Actor Studio</a> for more features!</p>', speaker: ChatMessage.getSpeaker({ actor: e2.actor }) });
  });
};
Hooks.once("ready", (e2, n2, t2) => {
});
const p = (e2, n2) => {
  game.modules.has("tidy5e-sheet") && "Tidy5eCharacterSheet" === e2.constructor?.name ? ((e3, n3) => {
    const t2 = n3.find(".main-panel .small-gap");
    if (!t2 || !t2.length)
      return;
    const a2 = n3.find(`#${i}`);
    a2.length && a2.remove();
    const r2 = $(c);
    r2.addClass("tidy5e");
    const o2 = r2.find(".pill");
    o2.css("color", "white"), o2.css("border-radius", "3px"), o2.css("width", "5rem"), o2.css("margin", "2px 0"), o2.css("padding", "2px 5px"), o2.css("cursor", "pointer"), o2.css("background-color", "var(--t5e-checkbox-outline-color)"), o2.css("border", "1px solid var(--dnd5e-color-tan)"), t2.after(r2), l(e3, n3);
  })(e2, n2) : ((e3) => {
    const n3 = e3?.constructor?.name;
    return !(!n3 || "CharacterActorSheet" !== n3 && "ActorSheet5eCharacter2" !== n3 && "ActorSheet5eCharacter" !== n3 && ("string" != typeof e3.id || !e3.id.startsWith("dnd5e.")));
  })(e2) && ((e3, n3) => {
    const t2 = n3.find(".pills-group:last-of-type");
    t2 && t2.length && (n3.find(`#${i}`).length && n3.find(`#${i}`).remove(), t2.after(c), l(e3, n3));
  })(e2, n2);
};
Hooks.on("renderActorSheet5eCharacter", (e2, n2, t2) => {
  p(e2, n2);
}), Hooks.on("renderActorSheet5eCharacter2", (e2, n2, t2) => {
  p(e2, n2);
}), Hooks.on("renderActorSheet5e", (e2, n2, t2) => {
  p(e2, n2);
}), Hooks.on("renderActorSheetV2", (e2) => {
  const n2 = e2.element ?? $(e2._element);
  n2 && p(e2, $(n2));
});
//# sourceMappingURL=index.js.map
