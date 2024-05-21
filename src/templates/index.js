export const longJumpTextTemplate = `
<div class="geoidesic-5e-jump-calc">
    <h2>{{5eJumpCalc.longJumpTitle}}</h2>
    <p>PHB p182</p>
    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>
    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>
    {{5eJumpCalc.longJumpPost}}
</div>
`;


export const highJumpTextTemplate = `
<div class="geoidesic-5e-jump-calc">
    <h2>High Jump</h2>
    <p>PHB p182</p>
    <p><strong>Running jump</strong> ({{5eJumpCalc.10FtFirst}}): <span class="lozenge">{{running_jump}}</span></p>
    <p><strong>Standing jump</strong>: <span class="lozenge">{{standing_jump}}</span></p>
    <p><strong>Reach</strong>: <span class="lozenge">+{{reach}}</span></p>
    {{5eJumpCalc.highJumpPost}}
</div>
`;

export const sheetContent = `
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
