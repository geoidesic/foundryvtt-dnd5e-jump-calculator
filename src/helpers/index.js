/**
 * 
 * @param {string} heightString in the format `<ft>' <in>"`
 * @returns 
 */
export function parseHeightString(heightString) {
    if (!heightString) return null;
    // Regular expression to match patterns for feet and inches
    const inchesRegex = /('|\s)(\d{1,3}")/gm;
    const feetRegex = /^(\d{1,3}|\d\s|\d")/gm;

    // Execute the regular expressions on the input height string
    const inchesMatch = heightString.match(inchesRegex);
    const feetMatch = heightString.match(feetRegex);

    const feet = feetMatch[0];
    const inches = inchesMatch[0].replace(/["\s]/g, '');
    // Return the height as a string in the format "<feet>.<inches>"
    return feet + '.' + inches;
}

/**
 * Converts decimal feet to feet and inches. E.g. 6.5 feet, means "six and a half feet", which would be `6' 6"`
 * @param {string} decimalFeet // 0.1, 1.3
 * @returns {string} feet and inches 
 */
export function convertDecimalToHeightString(decimalFeet) {
    // Split the decimal feet into integer and fractional parts
    const integerFeet = Math.floor(decimalFeet);
    const fractionalFeet = Math.round((decimalFeet - integerFeet) * 1e10) / 1e10;
    // Convert the fractional part to inches (1 foot = 12 inches)
    const inches = Math.floor(fractionalFeet * 12);
    // Return the result as a string in the format "feet' inches""
    return `${integerFeet}' ${inches}"`;
}

export function getLongJumpDistance(strength, type) {
    const distance = (type == 'running' ? strength : strength / 2).toString();
    return distance;
}

/**
 * This will check for active effects on the actor and process any that match this module
 * @param {Number} distance 
 * @param {object} actor 
 * @returns {Number}
 */
// Accepts a key to filter effects for specific jump type
function _processEffects(distance, actor, effectKey = "dnd5e.foundryvtt-dnd5e-jump-calculator") {
    let modifiedDistance = Number(distance);
    const effects = actor?.effects;
    if (!effects) return modifiedDistance;

    const effectIterable = typeof effects[Symbol.iterator] === 'function'
        ? effects
        : typeof effects.values === 'function'
            ? effects.values()
            : [];
    let changes = [];
    for (let effectRow of effectIterable) {
        if (!effectRow.changes?.length || effectRow.isSuppressed || effectRow.disabled) continue;
        for (let change of effectRow.changes) {
            if (change.key === effectKey) {
                changes.push(change);
            }
        }
    }
    changes.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    for (let change of changes) {
        switch (change.mode) {
            case 1:
                modifiedDistance = modifiedDistance * change.value;
                break;
            case 2:
                modifiedDistance = modifiedDistance + change.value;
                break;
            case 3:
                modifiedDistance = Math.min(modifiedDistance, change.value);
                break;
            case 4:
                modifiedDistance = Math.max(modifiedDistance, change.value);
                break;
            case 5:
                modifiedDistance = change.value;
                break;
            default:
                break;
        }
    }
    return modifiedDistance;
}

export function calculateLongJump(strength, type, actor) {
    // Apply both general and long-jump-only effects
    let distance = getLongJumpDistance(strength, type);
    distance = _processEffects(distance, actor, "dnd5e.foundryvtt-dnd5e-jump-calculator");
    distance = _processEffects(distance, actor, "dnd5e.foundryvtt-dnd5e-jump-calculator-long");
    return convertDecimalToHeightString(distance);
}

export function getHighJumpDistance(strMod, type) {
    const distance = (type == 'running' ? 3 + Number(strMod) : (3 + Number(strMod)) / 2).toString();
    return distance;
}

/**
 * Calculates high jump distance, applying effects and optional boost.
 * @param {number} strMod
 * @param {string} type
 * @param {object} actor
 * @param {number} [movement=0] - Actor's movement speed (for boost)
 * @param {boolean} [applyBoost=false] - Whether to apply the extra boost
 */
export function calculateHighJump(strMod, type, actor, movement = 0, applyBoost = false) {
    let distance = getHighJumpDistance(strMod, type);
    distance = _processEffects(distance, actor, "dnd5e.foundryvtt-dnd5e-jump-calculator");
    distance = _processEffects(distance, actor, "dnd5e.foundryvtt-dnd5e-jump-calculator-high");
    if (applyBoost && movement > 0) {
        distance = Number(distance) + (movement / 2);
    }
    return convertDecimalToHeightString(distance);
}

/**
 * @param {string} height <ft>.<in> 
 * @returns <ft>.<in>*1.5
 */
export function calculateReach(height) {
    // split height string by '.' character
    const split = height.split('.');
    const feet = Number(split[0]);
    const inches = Number(split[1]);
    const halfInches = inches / 2;
    const halfFeet = feet / 2;
    let reachFeet = feet + halfFeet;
    let reachInches = inches + halfInches;
    if (reachInches > 12) {
        reachFeet += 1;
        reachInches -= 12;
    }
    // const distance = String(reachFeet) + '.' + String(reachInches);
    const decimalHeight = convertFeetAndInchesToDecimal(reachFeet, reachInches);
    return convertDecimalToHeightString(decimalHeight);
}

export function convertFeetAndInchesToDecimal(feet, inches) {
    // Convert feet to inches and add to inches value
    const totalInches = Number(feet) * 12 + Number(inches);
    // Convert total inches to decimal feet
    const decimalFeet = totalInches / 12;
    const val = decimalFeet.toFixed(1); // Return as a string with one decimal place
    return val;
}
