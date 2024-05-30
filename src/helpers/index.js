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
function _processEffects(distance, actor) {
    let modifiedDistance = distance;
    if (!actor.effects.size) return distance;
    let changes = [];
    for (let effectRow of actor.effects) {
        console.log(effectRow)
        console.log(effectRow.changes)
        console.log(effectRow.changes.length)
        if (!effectRow.changes?.length || effectRow.isSuppressed || effectRow.disabled) continue
        for (let change of effectRow.changes) {
            console.log(change)
            if (change.key === "dnd5e.foundryvtt-dnd5e-jump-calculator") {
                changes.push(change);
            }
        }
    }
    changes.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    for (let change of changes) {
        console.log(change)
        console.log(change.mode)
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
                modifiedDistance = modifiedDistance
                break;
        }
    }
    return modifiedDistance;
}

export function calculateLongJump(strength, type, actor) {
    const distance = _processEffects(getLongJumpDistance(strength, type), actor);
    const heightString = convertDecimalToHeightString(distance);
    return heightString;
}

export function getHighJumpDistance(strMod, type) {
    const distance = (type == 'running' ? 3 + Number(strMod) : (3 + Number(strMod)) / 2).toString();
    return distance;
}

export function calculateHighJump(strMod, type, actor) {
    // 3 + your Strength modifier
    const distance = _processEffects(getHighJumpDistance(strMod, type), actor);
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
