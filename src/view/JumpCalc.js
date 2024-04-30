import { SvelteApplication }  from '#runtime/svelte/application';

import JumpCalc          from './JumpCalc.svelte';

export default class JumpCalcApplication extends SvelteApplication
{
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: '5eJumpCalc.title',  // Automatically localized from `lang/en.json`.
         width: 300,

         svelte: {
            class: JumpCalc,
            target: document.body
         }
      });
   }
}