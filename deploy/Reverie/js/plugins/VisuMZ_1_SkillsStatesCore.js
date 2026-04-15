//=============================================================================
// VisuStella MZ - Skills & States Core
// VisuMZ_1_SkillsStatesCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_SkillsStatesCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.SkillsStatesCore = VisuMZ.SkillsStatesCore || {};
VisuMZ.SkillsStatesCore.version = 1.54;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.54] [SkillsStatesCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Skills_and_States_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Skills & States Core plugin extends and builds upon the functionality of
 * RPG Maker MZ's inherent skill, state, and buff functionalities and allows
 * game devs to customize its various aspects.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Assigning multiple Skill Types to Skills.
 * * Making custom Skill Cost Types (such as HP, Gold, and Items).
 * * Allowing Skill Costs to become percentile-based or dynamic either directly
 *   through the Skills themselves or through trait-like notetags.
 * * Replacing gauges for different classes to display different types of
 *   Skill Cost Type resources.
 * * Hiding/Showing and enabling/disabling skills based on switches, learned
 *   skills, and code.
 * * Setting rulings for states, including if they're cleared upon death, how
 *   reapplying the state affects their turn count, and more.
 * * Allowing states to be categorized and affected by categories, too.
 * * Displaying turn counts on states drawn in the window or on sprites.
 * * Manipulation of state, buff, and debuff turns through skill and item
 *   effect notetags.
 * * Create custom damage over time state calculations through notetags.
 * * Allow database objects to apply passive states to its user.
 * * Passive states can have conditions before they become active as well.
 * * Updated Skill Menu Scene layout to fit more modern appearances.
 * * Added bonus if Items & Equips Core is installed to utilize the Shop Status
 *   Window to display skill data inside the Skill Menu.
 * * Control over various aspects of the Skill Menu Scene.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 1 ------
 *
 * This plugin is a Tier 1 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 * 
 * Action End Removal for States
 * 
 * - If your Plugin Parameter settings for "Action End Update" are enabled,
 * then "Action End" has been updated so that it actually applies per action
 * used instead of just being at the start of a battler's action set.
 * 
 * - However, there are side effects to this: if a state has the "Cannot Move"
 * restriction along with the "Action End" removal timing, then unsurprisingly,
 * the state will never wear off because it's now based on actual actions
 * ending. To offset this and remove confusion, "Action End" auto-removal
 * timings for states with "Cannot Move" restrictions will be turned into
 * "Turn End" auto-removal timings while the "Action End Update" is enabled.
 * 
 * - This automatic change won't make it behave like an "Action End" removal
 * timing would, but it's better than completely softlocking a battler.
 * 
 * EXAMPLE:
 * 
 * - The new state: "Fiery Blade" will allow the affected battler to deal fire
 * elemental damage. With Action End, this means for 5 actions, those attacks
 * will deal fire damage.
 * 
 * - This means that if no action is taken, due to a status effect like "Sleep"
 * or "Stun", then the duration count will not decrease.
 * 
 * - On the flip side, if the battler performs multiple actions a turn, then
 * the duration count drops faster because more actions have been spent.
 * 
 * - However, if this "Fiery Blade" state was using Turn End instead, it will
 * have its duration reduced by 1 each turn, regardless of "Sleep" or "Stun"
 * states, and regardless of how many actions are performed each turn.
 * 
 * ---
 *
 * Buff & Debuff Level Management
 *
 * - In RPG Maker MZ, buffs and debuffs when applied to one another will shift
 * the buff modifier level up or down. This plugin will add an extra change to
 * the mechanic by making it so that once the buff modifier level reaches a
 * neutral point, the buff or debuff is removed altogether and resets the buff
 * and debuff turn counter for better accuracy.
 *
 * ---
 *
 * Skill Costs
 *
 * - In RPG Maker MZ, skill costs used to be hard-coded. Now, all Skill Cost
 * Types are now moved to the Plugin Parameters, including MP and TP. This
 * means that from payment to checking for them, it's all done through the
 * options available.
 *
 * - By default in RPG Maker MZ, displayed skill costs would only display only
 * one type: TP if available, then MP. If a skill costs both TP and MP, then
 * only TP was displayed. This plugin changes that aspect by displaying all the
 * cost types available in order of the Plugin Parameter Skill Cost Types.
 *
 * - By default in RPG Maker MZ, displayed skill costs were only color-coded.
 * This plugin changes that aspect by displaying the Skill Cost Type's name
 * alongside the cost. This is to help color-blind players distinguish what
 * costs a skill has.
 *
 * ---
 *
 * Sprite Gauges
 *
 * - Sprite Gauges in RPG Maker MZ by default are hard-coded and only work for
 * HP, MP, TP, and Time (used for ATB). This plugin makes it possible for them
 * to be customized through the use of Plugin Parameters under the Skill Cost
 * Types and their related-JavaScript entries.
 *
 * ---
 * 
 * State Displays
 * 
 * - To put values onto states and display them separately from the state turns
 * you can use the following script calls.
 * 
 *   battler.getStateDisplay(stateId)
 *   - This returns whatever value is stored for the specified battler under
 *     that specific state value.
 *   - If there is no value to be returned it will return an empty string.
 * 
 *   battler.setStateDisplay(stateId, value)
 *   - This sets the display for the battler's specific state to whatever you
 *     declared as the value.
 *   - The value is best used as a number or a string.
 * 
 *   battler.clearStateDisplay(stateId)
 *   - This clears the display for the battler's specific state.
 *   - In short, this sets the stored display value to an empty string.
 * 
 * ---
 *
 * Window Functions Moved
 *
 * - Some functions found in RPG Maker MZ's default code for Window_StatusBase
 * and Window_SkillList are now moved to Window_Base to make the functions
 * available throughout all windows for usage.
 *
 * ---
 *
 * ============================================================================
 * Slip Damage Popup Clarification
 * ============================================================================
 * 
 * Slip Damage popups only show one popup for HP, MP, and TP each and it is the
 * grand total of all the states and effects combined regardless of the number
 * of states and effects on a battler. This is how it is in vanilla RPG Maker
 * MZ and this is how we intend for it to be with the VisuStella MZ library.
 * 
 * This is NOT a bug!
 * 
 * The reason we are not changing this is because it does not properly relay
 * information to the player accurately. When multiple popups appear, players
 * only have roughly a second and a half to calculate it all for any form of
 * information takeaway. We feel it is better suited for the player's overall
 * convenience to show a cummulative change and steer the experience towards a
 * more positive one.
 *
 * ============================================================================
 * Passive State Clarification
 * ============================================================================
 * 
 * This section will explain various misconceptions regarding passive states.
 * No, passive states do not work the same way as states code-wise. Yes, they
 * use the same effects as states mechanically, but there are differences.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * This is NOT a bug.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 * 
 * As passive states are NOT considered directly applied to, they do NOT match
 * a Conditional Branch's state check as well. The Conditional Branch effect
 * checks for an affected state.
 * 
 * ---
 * 
 * Because passive states are NOT directly applied to a battler, the functions
 * of "addNewState", "addState", "eraseState", "removeState" do NOT apply to
 * passive states either. This means that any of the related JS notetags tied
 * to those functions will not occur either.
 * 
 * ---
 * 
 * Why are passive states not considered affected by? Let's look at it
 * differently. There are two ways to grant skills to actors. They can acquire
 * skills by levels/items/events or they can equip gear that temporarily grants
 * the skill in question.
 * 
 * Learning the skill is direct. Temporarily granting the skill is indirect.
 * These two factors have mechanical importance and require differentiation.
 * 
 * Regular states and passive states are the same way. Regular states are
 * directly applied, therefore, need to be distinguished in order for things
 * like state turns and steps, removal conditionals, and similar to matter at
 * all. Passive states are indirect and are therefore, unaffected by state
 * turns, steps, and removal conditions. These mechanical differences are
 * important for how RPG Maker works.
 * 
 * ---
 * 
 * Once again, it is NOT a bug that when using "a.isStateAffected(10)" to
 * check if a target has a passive state will return false.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * === General Skill Notetags ===
 *
 * The following are general notetags that are skill-related.
 *
 * ---
 *
 * <Skill Type: x>
 * <Skill Types: x,x,x>
 *
 * <Skill Type: name>
 * <Skill Types: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Marks the skill to have multiple Skill Types, meaning they would appear
 *   under different skill types without needing to create duplicate skills.
 * - Replace 'x' with a number value representing the Skill Type's ID.
 * - If using 'name' notetag variant, replace 'name' with the Skill Type(s)
 *   name desired to be added.
 *
 * ---
 * 
 * <List Name: name>
 * 
 * - Used for: Skill Notetags
 * - Makes the name of the skill appear different when show in the skill list.
 * - Using \V[x] as a part of the name will display that variable.
 * - If used with Battle Core's <Command Text: x>, the Command Text notetag
 *   will take priority in the command window, but the List Name notetag will
 *   appear in the skill list.
 * - This does not change the display text. If you'd like to change that, use
 *   the Battle Core's <Display Text: x> notetag along with this notetag.
 * 
 * ---
 * 
 * <ID Sort Priority: x>
 * 
 * - Used for: Skill Notetags
 * - Used for Scene_Skill.
 * - Changes sorting priority by ID for skills to 'x'. 
 *   - Default priority level is '50'.
 * - Skills with higher priority values will be sorted higher up on the list
 *   while lower values will be lower on the list.
 * 
 * ---
 *
 * === Skill Cost Notetags ===
 *
 * The following are notetags that can be used to adjust skill costs. Some of
 * these notetags are added through the Plugin Parameter: Skill Cost Types and
 * can be altered there. This also means that some of these notetags can have
 * their functionality altered and/or removed.
 *
 * ---
 *
 * <type Cost: x>
 * <type Cost: x%>
 *
 * - Used for: Skill Notetags
 * - These notetags are used to designate costs of custom or already existing
 *   types that cannot be made by the Database Editor.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'x' with a number value to determine the exact type cost value.
 *   This lets you bypass the Database Editor's limit of 9,999 MP and 100 TP.
 * - The 'x%' version is replaced with a percentile value to determine a cost
 *   equal to a % of the type's maximum quantity limit.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost: 500>
 *   <MP Cost: 25%>
 *   <Gold Cost: 3000>
 *   <Potion Cost: 5>
 *
 * ---
 *
 * <type Cost Max: x>
 * <type Cost Min: x>
 *
 * - Used for: Skill Notetags
 * - These notetags are used to ensure conditional and % costs don't become too
 *   large or too small.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'x' with a number value to determine the maximum or minimum values
 *   that the cost can be.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost Max: 1500>
 *   <MP Cost Min: 5>
 *   <Gold Cost Max: 10000>
 *   <Potion Cost Min: 3>
 *
 * ---
 *
 * <type Cost: +x>
 * <type Cost: -x>
 *
 * <type Cost: x%>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - The related actor will raise/lower the cost of any skill that uses the
 *   'type' cost by a specified amount.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - For % notetag variant: Replace 'x' with a number value to determine the
 *   rate to adjust the Skill Cost Type by as a rate value. This is applied
 *   before <type Cost: +x> and <type Cost: -x> notetags.
 * - For + and - notetag variants: Replace 'x' with a number value to determine
 *   how much to adjust the Skill Cost Type by as a flat value. This is applied
 *   after <type Cost: x%> notetags.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost: +20>
 *   <MP Cost: -10>
 *   <Gold Cost: 50%>
 *   <Potion Cost: 200%>
 *
 * ---
 *
 * <Custom Cost Text>
 *  text
 * </Custom Cost Text>
 *
 * - Used for: Skill Notetags
 * - Allows you to insert custom text into the skill's cost area towards the
 *   end of the costs.
 * - Replace 'text' with the text you wish to display.
 * - Text codes may be used.
 *
 * ---
 *
 * === JavaScript Notetags: Skill Costs ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine any dynamic Skill Cost Types used for particular skills.
 *
 * ---
 *
 * <JS type Cost>
 *  code
 *  code
 *  cost = code;
 * </JS type Cost>
 *
 * - Used for: Skill Notetags
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'code' to determine the type 'cost' of the skill.
 * - Insert the final type cost into the 'cost' variable.
 * - The 'user' variable refers to the user about to perform the skill.
 * - The 'skill' variable refers to the skill being used.
 * - Functionality for the notetag can be altered in the Plugin Parameters.
 *
 * ---
 *
 * === Gauge Replacement Notetags ===
 *
 * Certain classes can have their gauges swapped out for other Skill Cost
 * Types. This is especially helpful for the classes that don't utilize those
 * Skill Cost Types. You can mix and match them however you want.
 *
 * ---
 *
 * <Replace HP Gauge: type>
 * <Replace MP Gauge: type>
 * <Replace TP Gauge: type>
 *
 * - Used for: Class Notetags
 * - Replaces the HP (1st), MP (2nd), or TP (3rd) gauge with a different Skill
 *   Cost Type.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 *   - Does not work with 'Item Cost', 'Weapon Cost', or 'Armor Cost'.
 * - Replace 'type' with 'none' to not display any gauges there.
 * - The <Replace TP Gauge: type> will require 'Display TP in Window' setting
 *   to be on in the Database > System 1 tab.
 * - Functionality for the notetags can be altered by changes made to the
 *   Skill & States Core Plugin Parameters.
 *
 * ---
 * 
 * === Item Cost-Related Notetags ===
 * 
 * ---
 * 
 * <Item Cost: x name>
 * <Weapon Cost: x name>
 * <Armor Cost: x name>
 * 
 * - Used for: Skill Notetags
 * - The skill will consume items, weapons, and/or armors in order to be used.
 *   - Non-consumable items will not be consumed but their amounts will be
 *     required.
 * - Replace 'x' with a number representing the respective item cost.
 * - Replace 'name' with text representing the respective item, weapon, or
 *   armor to be consumed.
 * - Insert multiples of this notetag to consume multiple items, weapons,
 *   and/or armors.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 * 
 * Examples:
 * 
 *   <Item Cost: 5 Magic Water>
 *   <Item Cost: 2 Antidote>
 *   <Weapon Cost: 1 Short Sword>
 *   <Armor Cost: 3 Cloth Armor>
 * 
 * ---
 *
 * <Item Cost Max: x name>
 * <Item Cost Min: x name>
 *
 * <Weapon Cost Max: x name>
 * <Weapon Cost Min: x name>
 *
 * <Armor Cost Max: x name>
 * <Armor Cost Min: x name>
 * 
 * - Used for: Skill Notetags
 * - Sets up a maximum/minimum cost for the item, weapon, armor type costs.
 * - Replace 'x' with a number representing the maximum or minimum cost.
 * - Replace 'name' with text representing the respective item, weapon, or
 *   armor to be consumed.
 * 
 * Examples:
 * 
 *   <Item Cost Max: 10 Magic Water>
 *   <Item Cost Min: 2 Antidote>
 *   <Weapon Cost Max: 3 Short Sword>
 *   <Armor Cost Min: 1 Cloth Armor>
 * 
 * ---
 *
 * <Item Cost: +x name>
 * <Item Cost: -x name>
 *
 * <Weapon Cost: +x name>
 * <Weapon Cost: -x name>
 *
 * <Armor Cost: +x name>
 * <Armor Cost: -x name>
 * 
 * <Item Cost: x% name>
 * <Weapon Cost: x% name>
 * <Armor Cost: x% name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - The related actor will raise/lower the item, weapon, and/or armor costs of
 *   any skill that costs those items, weapons, and/or armors by x%.
 * - For % notetag variant: Replace 'x' with a number value to determine the
 *   rate to adjust the Skill Cost Type by as a rate value. This is applied
 *   before <type Cost: +x> and <type Cost: -x> notetags.
 * - For + and - notetag variants: Replace 'x' with a number value to determine
 *   how much to adjust the Skill Cost Type by as a flat value. This is applied
 *   after <type Cost: x%> notetags.
 * - Replace 'name' with text representing the respective item, weapon, or
 *   armor to be consumed.
 * - Insert multiples of this notetag to consume multiple items, weapons,
 *   and/or armors.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 * 
 * Examples:
 * 
 *   <Item Cost: +1 Magic Water>
 *   <Item Cost: -2 Antidote>
 *   <Weapon Cost: 50% Short Sword>
 *   <Armor Cost: 200% Cloth Armor>
 * 
 * ---
 * 
 * <Replace Item name1 Cost: name2>
 * <Replace Weapon name1 Cost: name2>
 * <Replace Armor name1 Cost: name2>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - The related actor will not consume 'name1' items, weapons, or armors.
 *   Instead, the cost will be redirected to 'name2' items, weapons, or armors.
 *   - Even non-consumable items will be consumed.
 * - Replace 'name1' with text representing the respective item, weapon, or
 *   armor that is the original cost type.
 * - Replace 'name2' with text representing the respective item, weapon, or
 *   armor that will be consumed instead.
 * 
 * Examples:
 * 
 *   <Replace Item Magic Water Cost: Potion>
 *   <Replace Item Antidote Cost: Dispel Herb>
 *   <Replace Weapon Short Sword Cost: Falchion>
 *   <Replace Armor Cloth Armor Cost: Leather Armor>
 * 
 * ---
 *
 * === Skill Accessibility Notetags ===
 *
 * Sometimes, you don't want all skills to be visible whether it be to hide
 * menu-only skills during battle, until certain switches are turned ON/OFF, or
 * until certain skills have been learned.
 *
 * ---
 *
 * <Hide in Battle>
 * <Hide outside Battle>
 *
 * - Used for: Skill Notetags
 * - Makes the specific skill visible or hidden depending on whether or not the
 *   player is currently in battle.
 *
 * ---
 *
 * <Show Switch: x>
 *
 * <Show All Switches: x,x,x>
 * <Show Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, skill will be hidden until all switches
 *   are ON. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the
 *   switches are ON. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide Switch: x>
 *
 * <Hide All Switches: x,x,x>
 * <Hide Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, skill will be shown until all switches
 *   are ON. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   switches are ON. Otherwise, it would be shown.
 *
 * ---
 *
 * <Show if learned Skill: x>
 *
 * <Show if learned All Skills: x,x,x>
 * <Show if learned Any Skills: x,x,x>
 *
 * <Show if learned Skill: name>
 *
 * <Show if learned All Skills: name, name, name>
 * <Show if learned Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills learned.
 * - This does not apply to skills added by traits on actors, classes, any
 *   equipment, or states. These are not considered learned skills. They are
 *   considered temporary skills.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be hidden until all skills
 *   are learned. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the skills
 *   are learned. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide if learned Skill: x>
 *
 * <Hide if learned All Skills: x,x,x>
 * <Hide if learned Any Skills: x,x,x>
 *
 * <Hide if learned Skill: name>
 *
 * <Hide if learned All Skills: name, name, name>
 * <Hide if learned Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills learned.
 * - This does not apply to skills added by traits on actors, classes, any
 *   equipment, or states. These are not considered learned skills. They are
 *   considered temporary skills.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be shown until all skills
 *   are learned. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   skills are learned. Otherwise, it would be shown.
 *
 * ---
 *
 * <Show if has Skill: x>
 *
 * <Show if have All Skills: x,x,x>
 * <Show if have Any Skills: x,x,x>
 *
 * <Show if has Skill: name>
 *
 * <Show if have All Skills: name, name, name>
 * <Show if have Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills available.
 * - This applies to both skills that have been learned and/or temporarily
 *   added through traits on actors, classes, equipment, or states.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be hidden until all skills
 *   are learned. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the skills
 *   are learned. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide if has Skill: x>
 *
 * <Hide if have All Skills: x,x,x>
 * <Hide if have Any Skills: x,x,x>
 *
 * <Hide if has Skill: name>
 *
 * <Hide if have All Skills: name, name, name>
 * <Hide if have Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills available.
 * - This applies to both skills that have been learned and/or temporarily
 *   added through traits on actors, classes, equipment, or states.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be shown until all skills
 *   are learned. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   skills are learned. Otherwise, it would be shown.
 *
 * ---
 *
 * <Enable Switch: x>
 *
 * <Enable All Switches: x,x,x>
 * <Enable Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's enabled status.
 * - If 'All' notetag variant is used, skill will be disabled until all
 *   switches are ON. Then, it would be enabled.
 * - If 'Any' notetag variant is used, skill will be enabled if any of the
 *   switches are ON. Otherwise, it would be disabled.
 *
 * ---
 *
 * <Disable Switch: x>
 *
 * <Disable All Switches: x,x,x>
 * <Disable Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's enabled status.
 * - If 'All' notetag variant is used, skill will be enabled until all switches
 *   are ON. Then, it would be disabled.
 * - If 'Any' notetag variant is used, skill will be disabled if any of the
 *   switches are ON. Otherwise, it would be enabled.
 *
 * ---
 *
 * === JavaScript Notetags: Skill Accessibility ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine if a skill can be accessible visibly or through usage.
 *
 * ---
 *
 * <JS Skill Visible>
 *  code
 *  code
 *  visible = code;
 * </JS Skill Visible>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on JavaScript code.
 * - Replace 'code' to determine the type visibility of the skill.
 * - The 'visible' variable returns a boolean (true/false) to determine if the
 *   skill will be visible or not.
 * - The 'user' variable refers to the user with the skill.
 * - The 'skill' variable refers to the skill being checked.
 * - All other visibility conditions must be met for this code to count.
 *
 * ---
 *
 * <JS Skill Enable>
 *  code
 *  code
 *  enabled = code;
 * </JS Skill Enable>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on JavaScript code.
 * - Replace 'code' to determine the type enabled status of the skill.
 * - The 'enabled' variable returns a boolean (true/false) to determine if the
 *   skill will be enabled or not.
 * - The 'user' variable refers to the user with the skill.
 * - The 'skill' variable refers to the skill being checked.
 * - All other skill conditions must be met in order for this to code to count.
 *
 * ---
 *
 * === General State-Related Notetags ===
 *
 * The following notetags are centered around states, such as how their turn
 * counts are displayed, items and skills that affect state turns, if the state
 * can avoid removal by death state, etc.
 *
 * ---
 *
 * <No Death Clear>
 *
 * - Used for: State Notetags
 * - Prevents this state from being cleared upon death.
 * - This allows this state to be added to an already dead battler, too.
 *
 * ---
 *
 * <No Recover All Clear>
 *
 * - Used for: State Notetags
 * - Prevents this state from being cleared upon using the Recover All command.
 *
 * ---
 *
 * <Group Defeat>
 *
 * - Used for: State Notetags
 * - If an entire party is affected by states with the <Group Defeat> notetag,
 *   they are considered defeated.
 * - Usage for this includes party-wide petrification, frozen, etc.
 *
 * ---
 *
 * <Reapply Rules: Ignore>
 * <Reapply Rules: Reset>
 * <Reapply Rules: Greater>
 * <Reapply Rules: Add>
 *
 * - Used for: State Notetags
 * - Choose what kind of rules this state follows if the state is being applied
 *   to a target that already has the state. This affects turns specifically.
 * - 'Ignore' will bypass any turn changes.
 * - 'Reset' will recalculate the state's turns.
 * - 'Greater' will choose to either keep the current turn count if it's higher
 *   than the reset amount or reset it if the current turn count is lower.
 * - 'Add' will add the state's turn count to the applied amount.
 * - If this notetag isn't used, it will use the rules set in the States >
 *   Plugin Parameters.
 *
 * ---
 *
 * <Positive State>
 * <Negative State>
 *
 * - Used for: State Notetags
 * - Marks the state as a positive state or negative state, also altering the
 *   state's turn count color to match the Plugin Parameter settings.
 * - This also puts the state into either the 'Positive' category or
 *   'Negative' category.
 *
 * ---
 *
 * <Category: name>
 * <Category: name, name, name>
 *
 * - Used for: State Notetags
 * - Arranges states into certain/multiple categories.
 * - Replace 'name' with a category name to mark this state as.
 * - Insert multiples of this to mark the state with  multiple categories.
 *
 * ---
 *
 * <Categories>
 *  name
 *  name
 * </Categories>
 *
 * - Used for: State Notetags
 * - Arranges states into certain/multiple categories.
 * - Replace each 'name' with a category name to mark this state as.
 *
 * ---
 * 
 * <Bypass State Damage Removal: id>
 * <Bypass State Damage Removal: id, id, id>
 * 
 * <Bypass State Damage Removal: name>
 * <Bypass State Damage Removal: name, name, name>
 * 
 * - Used for: Skill, Item Notetags
 * - When this skill/item is used to attack an enemy with the listed state that
 *   would normally have on damage removal (ie Sleep).
 * - For 'id' variant, replace each 'id' with a number representing the state's
 *   ID to bypass the damage removal for.
 * - For 'name' variant, replace each 'name' with the state's name to bypass
 *   the damage removal for.
 * - This can be used for attacks like "Dream Eater" that would prevent waking
 *   up a sleeping opponent.
 * 
 * ---
 * 
 * <Bypass State Damage Removal as Attacker: id>
 * <Bypass State Damage Removal as Attacker: id, id, id>
 * 
 * <Bypass State Damage Removal as Attacker: name>
 * <Bypass State Damage Removal as Attacker: name, name, name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - When an attacker with an associated trait object that has this notetag
 *   would attack an enemy with the listed state, bypass on damage removal.
 * - For 'id' variant, replace each 'id' with a number representing the state's
 *   ID to bypass the damage removal for.
 * - For 'name' variant, replace each 'name' with the state's name to bypass
 *   the damage removal for.
 * - This can be used for effects like "Sleep Striker" that would prevent the
 *   attacker from waking up a sleeping opponent.
 * 
 * ---
 * 
 * <Bypass State Damage Removal as Target: id>
 * <Bypass State Damage Removal as Target: id, id, id>
 * 
 * <Bypass State Damage Removal as Target: name>
 * <Bypass State Damage Removal as Target: name, name, name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - When a target with an associated trait object that has this notetag is
 *   attacked as the target with the listed state, bypass on damage removal.
 * - For 'id' variant, replace each 'id' with a number representing the state's
 *   ID to bypass the damage removal for.
 * - For 'name' variant, replace each 'name' with the state's name to bypass
 *   the damage removal for.
 * - This can be used for effects like "Deep Sleep" that would prevent the
 *   attacked target from waking up.
 * 
 * ---
 * 
 * <Resist State Category: name>
 * <Resist State Categories: name, name, name>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Causes the affected battler resist the listed categories.
 * - Replace each 'name' with a category name to resist.
 *   - Insert multiple 'name' entries to add more categories.
 * - This works exactly like how state resistances work in-game. If a battler
 *   who was originally NOT resistant to "Poison" before gaining a
 *   poison-resistant trait, the "Poison" state will remain because it was
 *   applied before poison-resistance as enabled.
 * 
 * ---
 * 
 * <Resist State Categories>
 *  name
 *  name
 *  name
 * </Resist State Categories>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Causes the affected battler resist the listed categories.
 * - Replace each 'name' with a category name to resist.
 *   - Insert multiple 'name' entries to add more categories.
 * - This works exactly like how state resistances work in-game. If a battler
 *   who was originally NOT resistant to "Poison" before gaining a
 *   poison-resistant trait, the "Poison" state will remain because it was
 *   applied before poison-resistance as enabled.
 * 
 * ---
 *
 * <State x Category Remove: y>
 * 
 * <State x Category Remove: All>
 *
 * - Used for: Skill, Item Notetags
 * - Allows the skill/item to remove 'y' states from specific category 'x'.
 * - Replace 'x' with a category name to remove from.
 * - Replace 'y' with the number of times to remove from that category.
 * - Use the 'All' variant to remove all of the states of that category.
 * - Insert multiples of this to remove different types of categories.
 *
 * ---
 * 
 * <Remove Other x States>
 * 
 * - Used for: State Notetags
 * - When the state with this notetag is added, remove other 'x' category
 *   states from the battler (except for the state being added).
 * - Replace 'x' with a category name to remove from.
 * - Insert multiples of this to remove different types of categories.
 * - Useful for thing state types like stances and forms that there is usually
 *   only one active at a time.
 * 
 * ---
 *
 * <Hide State Turns>
 *
 * - Used for: State Notetags
 * - Hides the state turns from being shown at all.
 * - This will by pass any Plugin Parameter settings.
 *
 * ---
 *
 * <Turn Color: x>
 * <Turn Color: #rrggbb>
 *
 * - Used for: State Notetags
 * - Hides the state turns from being shown at all.
 * - Determines the color of the state's turn count.
 * - Replace 'x' with a number value depicting a window text color.
 * - Replace 'rrggbb' with a hex color code for a more custom color.
 *
 * ---
 * 
 * <Max Turns: x>
 * 
 * - Used for: State Notetags
 * - Determines the upper limit on the maximum number of turns for this state.
 * - Replace 'x' with a number representing the maximum number of turns used
 *   for this state.
 * - If no notetag is used, refer to the default setting found in the Plugin
 *   Parameters under "State Settings".
 * 
 * ---
 *
 * <State id Turns: +x>
 * <State id Turns: -x>
 *
 * <Set State id Turns: x>
 *
 * <State name Turns: +x>
 * <State name Turns: -x>
 *
 * <Set State name Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by state 'id' or state 'name', change the state
 *   turn duration for target.
 * - For 'id' variant, replace 'id' with the ID of the state to modify.
 * - For 'name' variant, replace 'name' with the name of the state to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple states at once.
 *
 * ---
 *
 * <param Buff Turns: +x>
 * <param Buff Turns: -x>
 *
 * <Set param Buff Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by a 'param' buff, change that buff's turn
 *   duration for target.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter buff to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple parameters at once.
 *
 * ---
 *
 * <param Debuff Turns: +x>
 * <param Debuff Turns: -x>
 *
 * <Set param Debuff Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by a 'param' debuff, change that debuff's turn
 *   duration for target.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter debuff to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple parameters at once.
 *
 * ---
 *
 * === JavaScript Notetags: On Add/Erase/Expire ===
 *
 * Using JavaScript code, you can use create custom effects that occur when a
 * state has bee added, erased, or expired.
 * 
 * ---
 *
 * <JS On Add State>
 *  code
 *  code
 * </JS On Add State>
 *
 * - Used for: State Notetags
 * - When a state is added, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * <JS On Erase State>
 *  code
 *  code
 * </JS On Erase State>
 *
 * - Used for: State Notetags
 * - When a state is erased, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * <JS On Expire State>
 *  code
 *  code
 * </JS On Expire State>
 *
 * - Used for: State Notetags
 * - When a state has expired, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * === JavaScript Notetags: Slip Damage/Healing ===
 *
 * Slip Damage, in RPG Maker vocabulary, refers to damage over time. The
 * following notetags allow you to perform custom slip damage/healing.
 *
 * ---
 *
 * <JS type Slip Damage>
 *  code
 *  code
 *  damage = code;
 * </JS type Slip Damage>
 *
 * - Used for: State Notetags
 * - Code used to determine how much slip damage is dealt to the affected unit
 *   during each regeneration phase.
 * - Replace 'type' with 'HP', 'MP', or 'TP'.
 * - Replace 'code' with the calculations on what to determine slip damage.
 * - The 'user' variable refers to the origin of the state.
 * - The 'target' variable refers to the affected unit receiving the damage.
 * - The 'state' variable refers to the current state being affected.
 * - The 'damage' variable is the finalized slip damage to be dealt.
 * - When these states are applied via action effects, the slip calculations
 *   are one time calculations made upon applying and the damage is cached to
 *   be used for future on regeneration calculations.
 * - For that reason, do not include game mechanics here such as adding states,
 *   buffs, debuffs, etc. as this notetag is meant for calculations only. Use
 *   the VisuStella Battle Core's <JS Pre-Regenerate> and <JS Post-Regenerate>
 *   notetags for game mechanics instead.
 * - Passive states and states with the <JS Slip Refresh> notetag are exempt
 *   from the one time calculation and recalculated each regeneration phase.
 *
 * ---
 *
 * <JS type Slip Heal>
 *  code
 *  code
 *  heal = code;
 * </JS type Slip Heal>
 *
 * - Used for: State Notetags
 * - Code used to determine how much slip healing is dealt to the affected unit
 *   during each regeneration phase.
 * - Replace 'type' with 'HP', 'MP', or 'TP'.
 * - Replace 'code' with the calculations on what to determine slip healing.
 * - The 'user' variable refers to the origin of the state.
 * - The 'target' variable refers to the affected unit receiving the healing.
 * - The 'state' variable refers to the current state being affected.
 * - The 'heal' variable is the finalized slip healing to be recovered.
 * - When these states are applied via action effects, the slip calculations
 *   are one time calculations made upon applying and the damage is cached to
 *   be used for future on regeneration calculations.
 * - For that reason, do not include game mechanics here such as adding states,
 *   buffs, debuffs, etc. as this notetag is meant for calculations only. Use
 *   the VisuStella Battle Core's <JS Pre-Regenerate> and <JS Post-Regenerate>
 *   notetags for game mechanics instead.
 * - Passive states and states with the <JS Slip Refresh> notetag are exempt
 *   from the one time calculation and recalculated each regeneration phase.
 *
 * ---
 * 
 * <JS Slip Refresh>
 * 
 * - Used for: State Notetags
 * - Refreshes the calculations made for the JS Slip Damage/Heal amounts at the
 *   start of each regeneration phase to allow for dynamic damage ranges.
 * 
 * ---
 *
 * === Passive State Notetags ===
 *
 * Passive States are states that are always applied to actors and enemies
 * provided that their conditions have been met. These can be granted through
 * database objects or through the Passive States Plugin Parameters.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * This is NOT a bug.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 * 
 * As passive states are NOT considered directly applied to, they do NOT match
 * a Conditional Branch's state check as well. The Conditional Branch effect
 * checks for an affected state.
 * 
 * ---
 * 
 * Because passive states are NOT directly applied to a battler, the functions
 * of "addNewState", "addState", "eraseState", "removeState" do NOT apply to
 * passive states either. This means that any of the related JS notetags tied
 * to those functions will not occur either.
 * 
 * ---
 * 
 * Why are passive states not considered affected by? Let's look at it
 * differently. There are two ways to grant skills to actors. They can acquire
 * skills by levels/items/events or they can equip gear that temporarily grants
 * the skill in question.
 * 
 * Learning the skill is direct. Temporarily granting the skill is indirect.
 * These two factors have mechanical importance and require differentiation.
 * 
 * Regular states and passive states are the same way. Regular states are
 * directly applied, therefore, need to be distinguished in order for things
 * like state turns and steps, removal conditionals, and similar to matter at
 * all. Passive states are indirect and are therefore, unaffected by state
 * turns, steps, and removal conditions. These mechanical differences are
 * important for how RPG Maker works.
 * 
 * ---
 * 
 * Once again, it is NOT a bug that when using "a.isStateAffected(10)" to
 * check if a target has a passive state will return false.
 * 
 * ---
 *
 * <Passive State: x>
 * <Passive States: x,x,x>
 *
 * <Passive State: name>
 * <Passive States: name, name, name>
 *
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy Notetags
 * - Adds passive state(s) x to trait object, applying it to related actor or
 *   enemy unit(s).
 * - Replace 'x' with a number to determine which state to add as a passive.
 * - If using 'name' notetag variant, replace 'name' with the name of the
 *   state(s) to add as a passive.
 * - Note: If you plan on applying a passive state through a skill, it must be
 *   through a skill that has been learned by the target and not a skill that
 *   is given through a trait.
 * - If you are using VisuMZ's Equip Battle Skills, know that the notetag
 *   <Passive State: x> will always have the passive state be available no
 *   matter if the skill is equipped or not, as long as the skill is learned.
 *   - If you want the passive state to only appear while the skill is equipped
 *     then use the VisuMZ Equip Battle Skills notetag <Equip State: x> for
 *     this effect instead.
 *
 * ---
 *
 * <Passive Stackable>
 *
 * - Used for: State Notetags
 * - Makes it possible for this passive state to be added multiple times.
 * - Otherwise, only one instance of the passive state can be available.
 *
 * ---
 *
 * <Passive Condition Class: id>
 * <Passive Condition Classes: id, id, id>
 *
 * <Passive Condition Class: name>
 * <Passive Condition Classes: name, name, name>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on the actor's
 *   current class. As long as the actor's current class matches one of the
 *   data entries, the passive condition is considered passed.
 * - For 'id' variant, replace 'id' with a number representing class's ID.
 * - For 'name' variant, replace 'name' with the class's name.
 *
 * ---
 *
 * <Passive Condition Multiclass: id>
 * <Passive Condition Multiclass: id, id, id>
 *
 * <Passive Condition Multiclass: name>
 * <Passive Condition Multiclass: name, name, name>
 *
 * - Used for: State Notetags
 * - Requires VisuMZ_2_ClassChangeSystem!
 * - Determines the passive condition of the passive state based on the actor's
 *   multiclasses. As long as the actor has any of the matching classes
 *   assigned as a multiclass, the passive condition is considered passed.
 * - For 'id' variant, replace 'id' with a number representing class's ID.
 * - For 'name' variant, replace 'name' with the class's name.
 *
 * ---
 *
 * <Passive Condition Switch ON: x>
 *
 * <Passive Condition All Switches ON: x,x,x>
 * <Passive Condition Any Switch ON: x,x,x>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on switches.
 * - Replace 'x' with the switch ID to determine the state's passive condition.
 * - If 'All' notetag variant is used, conditions will not be met until all
 *   switches are ON. Then, it would be met.
 * - If 'Any' notetag variant is used, conditions will be met if any of the
 *   switches are ON. Otherwise, it would not be met.
 *
 * ---
 *
 * <Passive Condition Switch OFF: x>
 *
 * <Passive Condition All Switches OFF: x,x,x>
 * <Passive Condition Any Switch OFF: x,x,x>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on switches.
 * - Replace 'x' with the switch ID to determine the state's passive condition.
 * - If 'All' notetag variant is used, conditions will not be met until all
 *   switches are OFF. Then, it would be met.
 * - If 'Any' notetag variant is used, conditions will be met if any of the
 *   switches are OFF. Otherwise, it would not be met.
 *
 * ---
 *
 * === JavaScript Notetags: Passive State ===
 *
 * The following is a notetag made for users with JavaScript knowledge to
 * determine if a passive state's condition can be met.
 *
 * ---
 *
 * <JS Passive Condition>
 *  code
 *  code
 *  condition = code;
 * </JS Passive Condition>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the state based on JavaScript code.
 * - Replace 'code' to determine if a passive state's condition has been met.
 * - The 'condition' variable returns a boolean (true/false) to determine if
 *   the passive state's condition is met or not.
 * - The 'user' variable refers to the user affected by the passive state.
 * - The 'state' variable refers to the passive state being checked.
 * - All other passive conditions must be met for this code to count.
 * 
 * **NOTE** Not everything can be used as a custom JS Passive Condition due to
 * limitations of the code. There are failsafe checks to prevent infinite loops
 * and some passive conditions will not register for this reason and the
 * conditional checks will behave as if the passive states have NOT been
 * applied for this reason. Such examples include the following:
 * 
 * - A passive state that requires another passive state
 * - A passive state that requires a trait effect from another state
 * - A passive state that requires a parameter value altered by another state
 * - A passive state that requires equipment to be worn but its equipment type
 *   access is provided by another state.
 * - Anything else that is similar in style.
 *
 * ---
 * 
 * === Skill Toggle Notetags ===
 * 
 * Skill Toggles are skills that can be toggled ON or OFF. If ON, then any
 * passive states on that skill will become enabled (assuming all other passive
 * conditions are met) and if toggled OFF, then that passive state will not
 * appear (even if all other conditions are met).
 * 
 * Skill Toggles do not take up actions, even in battle. They will not consume
 * an actor's current turn. A player can toggle multiple skill toggles at a
 * time.
 * 
 * Skill Toggles require the character to pay the skill cost ONLY when the
 * skill is toggled from OFF to ON, not when it is toggled ON to OFF.
 * 
 * Enemies are unable to switch Toggle Skills and the passive effects on a
 * Toggle Skill for an enemy will always be considered ON.
 * 
 * Otherwise, you can use JavaScript calls like the following for script call
 * checks, and the like:
 * 
 *   $gameActors.actor(2).isSkillToggled($dataSkills[3])
 * 
 * ---
 * 
 * <Toggle>
 * 
 * - Used for: Skill Notetags
 * - Turns the skill into a toggle skill.
 * - Best used with a passive state.
 *   - Just like with regular <Passive State: x> notetag:
 *   - If you plan on applying a passive state through a skill, it must be
 *     through a skill that has been learned by the target and not a skill that
 *     is given through a trait.
 * - Toggle skills cannot be used with certain skill effects:
 *   - Active Chain Skills, Evolution Matrix Skills, Input Combo Skills
 *   - Field Skills
 *   - Item Amplify Skills, Item Concoct Skills, Item Throw Skills
 *   - Toggle skills cannot be Skill Containers
 * 
 * ---
 * 
 * <Initial Toggle: On>
 * <Initial Toggle: Off>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - Sets the initial toggle for this skill to be ON/OFF.
 *   - aka when an actor learns the skill for the first time and this
 *     determines what toggle it will have
 * - If this notetag is not used, refer to the setting found in the
 *   Plugin Parameters
 * 
 * ---
 * 
 * <Toggle Exclusion Group: key>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - When this skill is toggled, all other toggle skills with a matching 'key'
 *   will be turned off.
 *   - For example, the skills Fire Force, Ice Force, and Thunder Force have
 *     the <Toggle Exclusion Group: Force> notetag.
 *   - When Fire Force is toggled ON, then Ice Force and Thunder Force will
 *     automatically turn OFF.
 * - Replace 'key' with a toggle exclusion group name for this skill to use.
 * 
 * ---
 * 
 * <Toggle On Animation: x>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - When a skill is turned off, this is the animation that plays.
 * - If this notetag is not used, refer to the skill's animation.
 * - Replace 'x' with a number representing the ID of the animation to play
 *   when the skill is toggled on.
 * 
 * ---
 * 
 * <Toggle Off Animation: x>
 * 
 * - Used for: Skill Notetags
 * - Pair this notetag together with skill toggles.
 * - When a skill is turned off, this is the animation that plays.
 * - If this notetag is not used, refer to the Plugin Parameters' animation.
 * - Replace 'x' with a number representing the ID of the animation to play
 *   when the skill is toggled off.
 * 
 * ---
 * 
 * === Aura & Miasma Notetags ===
 * 
 * Auras are a type passive that affects an allied party. Miasmas are a type of
 * passive that affects an opposing party. Auras and Miasmas only need to come
 * from a single source to give an entire party or troop a passive provided
 * that the battler emitting the aura/miasma is alive and in battle.
 * 
 * ---
 * 
 * <Aura State: x>
 * <Aura States: x, x, x>
 * 
 * <Aura State: name>
 * <Aura States: name, name, name>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy Notetags
 * - Emits an aura that affects the battler's allies and gives each affected
 *   member passive state(s) 'x'.
 * - Replace 'x' with a number to determine which state to add as a passive
 *   generated by this aura.
 * - If using 'name' notetag variant, replace 'name' with the name of the
 *   state(s) to add as a passive generated by this aura.
 * - Note: If you plan on applying an aura effect through a skill, it must be
 *   through a skill that has been learned by the target and not a skill that
 *   is given through a trait.
 * 
 * ---
 * 
 * <Miasma State: x>
 * <Miasma States: x, x, x>
 * 
 * <Miasma State: name>
 * <Miasma States: name, name, name>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy Notetags
 * - Emits an miasma that affects the battler's opponents and gives each
 *   affected member passive state(s) 'x'.
 * - Miasmas do NOT apply outside of battle.
 * - Replace 'x' with a number to determine which state to add as a passive
 *   generated by this miasma.
 * - If using 'name' notetag variant, replace 'name' with the name of the
 *   state(s) to add as a passive generated by this miasma.
 * - Note: If you plan on applying a miasma effect through a skill, it must be
 *   through a skill that has been learned by the target and not a skill that
 *   is given through a trait.
 * 
 * ---
 * 
 * <Not User Aura>
 * <Aura Not For User>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy, State Notetags
 * - Prevents the emitting user from being affected by the related aura.
 * 
 * ---
 * 
 * <Allow Dead Aura>
 * <Allow Dead Miasma>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy, State Notetags
 * - Allows aura/miasma to continue emitting even after the emitting user is
 *   in a dead state.
 * - When used with Actor, Class, Skill, Weapon, Armor, Enemy objects, it will
 *   only affect the auras/miasmas emitted from that object.
 * - When used with States, the effect will take place as long as it is used
 *   as an aura or miasma regardless of where it is emitting from.
 * - Takes priority over <Dead Aura Only> and <Dead Miasma Only> notetags.
 * 
 * ---
 * 
 * <Dead Aura Only>
 * <Dead Miasma Only>
 * 
 * - Used for: Actor, Class, Skill, Weapon, Armor, Enemy, State Notetags
 * - Allows aura/miasma to only emit if the emitting user is in a dead state.
 * - When used with Actor, Class, Skill, Weapon, Armor, Enemy objects, it will
 *   only affect the auras/miasmas emitted from that object.
 * - When used with States, the effect will take place as long as it is used
 *   as an aura or miasma regardless of where it is emitting from.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Skill Cost Plugin Commands ===
 * 
 * ---
 * 
 * Skill Cost: Emulate Actor Pay
 * - Target actor(s) emulates paying for skill cost.
 * - 
 * 
 *   Actor ID(s):
 *   - Select which Actor ID(s) will pay skill cost.
 * 
 *   Skill ID:
 *   - What is the ID of the skill to emulate paying the skill cost for?
 * 
 * ---
 * 
 * Skill Cost: Emulate Enemy Pay
 * - Target enemy(s) emulates paying for skill cost.
 * - 
 * 
 *   Enemy Index(es):
 *   - Select which enemy index(es) will pay skill cost.
 * 
 *   Skill ID:
 *   - What is the ID of the skill to emulate paying the skill cost for?
 * 
 * ---
 * 
 * === State Turns Plugin Commands ===
 * 
 * ---
 * 
 * State Turns: Actor State Turns Change By
 * - Changes actor(s) state turns by an amount.
 * - Only works on states that can have turns.
 * 
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns By:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 * State Turns: Actor State Turns Change To
 * - Changes actor(s) state turns to a specific value.
 * - Only works on states that can have turns.
 * 
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns To:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 * State Turns: Enemy State Turns Change By
 * - Changes enemy(s) state turns by an amount.
 * - Only works on states that can have turns.
 * 
 *   Enemy Index(es):
 *   - Select which enemy index(es) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns By:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 * State Turns: Enemy State Turns Change To
 * - Changes enemy(s) state turns to a specific value.
 * - Only works on states that can have turns.
 * 
 *   Enemy Index(es):
 *   - Select which enemy index(es) to affect.
 * 
 *   State ID:
 *   - What is the ID of the state you wish to change turns for?
 *   - Only works on states that can have turns.
 * 
 *   Change Turns To:
 *   - How many turns should the state be changed to?
 *   - You may use JavaScript code.
 * 
 *   Auto-Add State?:
 *   - Automatically adds state if actor(s) does not have it applied?
 * 
 * ---
 * 
 *
 * ============================================================================
 * Plugin Parameters: General Skill Settings
 * ============================================================================
 *
 * These Plugin Parameters adjust various aspects of the game regarding skills
 * from the custom Skill Menu Layout to global custom effects made in code.
 *
 * ---
 *
 * General
 * 
 *   Use Updated Layout:
 *   - Use the Updated Skill Menu Layout provided by this plugin?
 *   - This will automatically enable the Status Window.
 *   - This will override the Core Engine windows settings.
 *
 *   Layout Style:
 *   - If using an updated layout, how do you want to style the menu scene?
 *     - Upper Help, Left Input
 *     - Upper Help, Right Input
 *     - Lower Help, Left Input
 *     - Lower Help, Right Input
 *
 * ---
 *
 * Skill Type Window
 * 
 *   Style:
 *   - How do you wish to draw commands in the Skill Type Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Skill Type Window.
 * 
 *   Window Width:
 *   - What is the desired pixel width of this window?
 *   - Default: 240
 *
 * ---
 *
 * List Window
 * 
 *   Columns:
 *   - Number of maximum columns.
 *
 * ---
 *
 * Shop Status Window
 * 
 *   Show in Skill Menu?:
 *   - Show the Shop Status Window in the Skill Menu?
 *   - This is enabled if the Updated Layout is on.
 * 
 *   Adjust List Window?:
 *   - Automatically adjust the Skill List Window in the Skill Menu if using
 *     the Shop Status Window?
 * 
 *   Background Type:
 *   - Select background type for this window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this Shop Status Window in the
 *     Skill Menu.
 *
 * ---
 *
 * Skill Types
 * 
 *   Hidden Skill Types:
 *   - Insert the ID's of the Skill Types you want hidden from view ingame.
 * 
 *   Hidden During Battle:
 *   - Insert the ID's of the Skill Types you want hidden during battle only.
 * 
 *   Icon: Normal Type:
 *   - Icon used for normal skill types that aren't assigned any icons.
 *   - To assign icons to skill types, simply insert \I[x] into the
 *     skill type's name in the Database > Types tab.
 * 
 *   Icon: Magic Type:
 *   - Icon used for magic skill types that aren't assigned any icons.
 *   - To assign icons to skill types, simply insert \I[x] into the
 *     skill type's name in the Database > Types tab.
 * 
 *   Sort: Alphabetical:
 *   - Insert the ID's of Skill Types you want sorted alphabetically.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: Skill Conditions:
 *   - JavaScript code for a global-wide skill condition check.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Skill Cost Types
 * ============================================================================
 *
 * Skill Cost Types are the resources that are used for your skills. These can
 * range from the default MP and TP resources to the newly added HP, Gold, and
 * Potion resources.
 *
 * ---
 *
 * Settings
 * 
 *   Name:
 *   - A name for this Skill Cost Type.
 * 
 *   Icon:
 *   - Icon used for this Skill Cost Type.
 *   - Use 0 for no icon.
 * 
 *   Font Color:
 *   - Text Color used to display this cost.
 *   - For a hex color, use #rrggbb with VisuMZ_1_MessageCore
 * 
 *   Font Size:
 *   - Font size used to display this cost.
 *
 * ---
 *
 * Cost Processing
 * 
 *   JS: Cost Calculation:
 *   - Code on how to calculate this resource cost for the skill.
 * 
 *   JS: Can Pay Cost?:
 *   - Code on calculating whether or not the user is able to pay the cost.
 * 
 *   JS: Paying Cost:
 *   - Code for if met, this is the actual process of paying of the cost.
 *
 * ---
 *
 * Window Display
 * 
 *   JS: Show Cost?:
 *   - Code for determining if the cost is shown or not.
 * 
 *   JS: Cost Text:
 *   - Code to determine the text (with Text Code support) used for the
 *     displayed cost.
 *
 * ---
 *
 * Gauge Display
 * 
 *   JS: Maximum Value:
 *   - Code to determine the maximum value used for this Skill Cost resource
 *     for gauges.
 * 
 *   JS: Current Value:
 *   - Code to determine the current value used for this Skill Cost resource
 *     for gauges.
 * 
 *   JS: Draw Gauge:
 *   - Code to determine how to draw the Skill Cost resource for this 
 *     gauge type.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Skill Toggle Settings
 * ============================================================================
 *
 * Skill toggles are a new type of skill. They do not perform any actions but
 * instead, will switch on/off any passive effects the skill has.
 * 
 * Skill Toggles do not take up actions, even in battle. They will not consume
 * an actor's current turn. A player can toggle multiple skill toggles at a
 * time.
 * 
 * Skill Toggles require the character to pay the skill cost ONLY when the
 * skill is toggled from OFF to ON, not when it is toggled ON to OFF.
 * 
 * Enemies are unable to switch Toggle Skills and the passive effects on a
 * Toggle Skill for an enemy will always be considered ON.
 *
 * ---
 *
 * Default
 * 
 *   Default Toggle:
 *   - What is the default toggle setting for toggle skills?
 * 
 *   Toggle Off Animation:
 *   - Play this animation when a skill is toggled off.
 *   - Requires VisuMZ_0_CoreEngine.
 *   - Toggle On animation by default is whatever the skill animation is set to
 * 
 * ---
 * 
 * Appearance
 * 
 *   Toggle On Text Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *   - Applies for skill name, not the skill cost
 * 
 * ---
 * 
 * Vocabulary
 * 
 *   Toggle Type:
 *   - Skill toggle displayed in the status window.
 * 
 *   Toggle On:
 *   - Text displayed for a skill that's toggled on
 * 
 *   Toggle Off:
 *   - Text displayed for a skill that's toggled off
 * 
 *     Off Text Location:
 *     - Where is the [OFF] text located in the skill cost?
 *       - front
 *       - back
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Gauge Settings
 * ============================================================================
 *
 * Settings in regards to how skill cost gauges function and appear.
 *
 * ---
 *
 * Labels
 * 
 *   Font Type:
 *   - Which font type should be used for labels?
 * 
 *   Match Label Color:
 *   - Match the label color to the Gauge Color being used?
 * 
 *     Match: Gauge # ?:
 *     - Which Gauge Color should be matched?
 * 
 *     Preset: Gauge Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors from
 *       the Window Skin.
 * 
 *   Solid Outline:
 *   - Make the label outline a solid black color?
 * 
 *   Outline Width:
 *   - What width do you wish to use for your outline?
 *   - Use 0 to not use an outline.
 *
 * ---
 *
 * Values
 * 
 *   Font Type:
 *   - Which font type should be used for values?
 * 
 *   Solid Outline:
 *   - Make the value outline a solid black color?
 * 
 *   Outline Width:
 *   - What width do you wish to use for your outline?
 *   - Use 0 to not use an outline.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General State Settings
 * ============================================================================
 *
 * These are general settings regarding RPG Maker MZ's state-related aspects
 * from how turns are reapplied to custom code that's ran whenever states are
 * added, erased, or expired.
 *
 * ---
 *
 * General
 * 
 *   Reapply Rules:
 *   - These are the rules when reapplying states.
 *   - Ignore: State doesn't get added.
 *   - Reset: Turns get reset.
 *   - Greater: Turns take greater value (current vs reset).
 *   - Add: Turns add upon existing turns.
 * 
 *   Maximum Turns:
 *   - Maximum number of turns to let states go up to.
 *   - This can be changed with the <Max Turns: x> notetag.
 * 
 *   Action End Update:
 *   - Refer to "Major Changes" in Help File for explanation.
 * 
 *   Turn End on Map:
 *   - Update any state and buff turns on the map after this many steps.
 *   - Use 0 to disable.
 *
 * ---
 *
 * Turn Display
 * 
 *   Show Turns?:
 *   - Display state turns on top of window icons and sprites?
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Offset X:
 *   - Offset the X position of the turn display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the turn display.
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Turn Color: Neutral:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Positive:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Negative:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 * ---
 *
 * Data Display
 * 
 *   Show Data?:
 *   - Display state data on top of window icons and sprites?
 * 
 *   Data Font Size:
 *   - Font size used for displaying state data.
 * 
 *   Offset X:
 *   - Offset the X position of the state data display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the state data display.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: On Add State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     is added.
 * 
 *   JS: On Erase State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     is erased.
 * 
 *   JS: On Expire State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     has expired.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Buff/Debuff Settings
 * ============================================================================
 *
 * Buffs and debuffs don't count as states by RPG Maker MZ's mechanics, but
 * they do function close enough for them to be added to this plugin for
 * adjusting. Change these settings to make buffs and debuffs work to your
 * game's needs.
 *
 * ---
 *
 * General
 * 
 *   Reapply Rules:
 *   - These are the rules when reapplying buffs/debuffs.
 *   - Ignore: Buff/Debuff doesn't get added.
 *   - Reset: Turns get reset.
 *   - Greater: Turns take greater value (current vs reset).
 *   - Add: Turns add upon existing turns.
 * 
 *   Maximum Turns:
 *   - Maximum number of turns to let buffs and debuffs go up to.
 *
 * ---
 *
 * Stacking
 * 
 *   Max Stacks: Buff:
 *   - Maximum number of stacks for buffs.
 * 
 *   Max Stacks: Debuff:
 *   - Maximum number of stacks for debuffs.
 * 
 *   JS: Buff/Debuff Rate:
 *   - Code to determine how much buffs and debuffs affect parameters.
 *
 * ---
 *
 * Turn Display
 * 
 *   Show Turns?:
 *   - Display buff and debuff turns on top of window icons and sprites?
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Offset X:
 *   - Offset the X position of the turn display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the turn display.
 * 
 *   Turn Color: Buffs:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Debuffs:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 * ---
 *
 * Rate Display
 * 
 *   Show Rate?:
 *   - Display buff and debuff rate on top of window icons and sprites?
 * 
 *   Rate Font Size:
 *   - Font size used for displaying rate.
 * 
 *   Offset X:
 *   - Offset the X position of the rate display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the rate display.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: On Add Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Add Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 * 
 *   JS: On Erase Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Erase Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 * 
 *   JS: On Expire Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Expire Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Passive State Settings
 * ============================================================================
 *
 * These Plugin Parameters adjust passive states that can affect all actors and
 * enemies as well as have global conditions.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * This is NOT a bug.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 * 
 * As passive states are NOT considered directly applied to, they do NOT match
 * a Conditional Branch's state check as well. The Conditional Branch effect
 * checks for an affected state.
 * 
 * ---
 * 
 * Because passive states are NOT directly applied to a battler, the functions
 * of "addNewState", "addState", "eraseState", "removeState" do NOT apply to
 * passive states either. This means that any of the related JS notetags tied
 * to those functions will not occur either.
 * 
 * ---
 * 
 * Why are passive states not considered affected by? Let's look at it
 * differently. There are two ways to grant skills to actors. They can acquire
 * skills by levels/items/events or they can equip gear that temporarily grants
 * the skill in question.
 * 
 * Learning the skill is direct. Temporarily granting the skill is indirect.
 * These two factors have mechanical importance and require differentiation.
 * 
 * Regular states and passive states are the same way. Regular states are
 * directly applied, therefore, need to be distinguished in order for things
 * like state turns and steps, removal conditionals, and similar to matter at
 * all. Passive states are indirect and are therefore, unaffected by state
 * turns, steps, and removal conditions. These mechanical differences are
 * important for how RPG Maker works.
 * 
 * ---
 * 
 * Once again, it is NOT a bug that when using "a.isStateAffected(10)" to
 * check if a target has a passive state will return false.
 * 
 * ---
 *
 * List
 * 
 *   Global Passives:
 *   - A list of passive states to affect actors and enemies.
 * 
 *   Actor-Only Passives:
 *   - A list of passive states to affect actors only.
 * 
 *   Enemy Passives:
 *   - A list of passive states to affect enemies only.
 *
 * ---
 * 
 * Cache
 * 
 *   Switch Refresh?:
 *   - Refresh all battle members when switches are changed in battle?
 *   - This is primarily used for passive state conditions involve parameters
 *     that do not update due to cached data until a refresh occurs.
 *   - If this is on, do not spam Switch changes during battle in order to
 *     prevent lag spikes.
 * 
 *   Variable Refresh?:
 *   - Refresh all battle members when variables are changed in battle?
 *   - This is primarily used for passive state conditions involve parameters
 *     that do not update due to cached data until a refresh occurs.
 *   - If this is on, do not spam Variable changes during battle in order to
 *     prevent lag spikes.
 * 
 * ---
 *
 * Global JS Effects
 * 
 *   JS: Condition Check:
 *   - JavaScript code for a global-wide passive condition check.
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * - Yanfly
 * - Arisu
 * - Olivia
 * - Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.55: March 16, 2026
 * * Documentation Update!
 * ** Added extra clarity for <Toggle> notetag:
 * *** Just like with regular <Passive State: x> notetag:
 * *** If you plan on applying a passive state through a skill, it must be
 *     through a skill that has been learned by the target and not a skill that
 *     is given through a trait.
 * 
 * Version 1.54: December 15, 2025
 * * Documentation Update!
 * ** Added extra clarity for <List Name: name> notetag:
 * *** If used with Battle Core's <Command Text: x>, the Command Text notetag
 *     will take priority in the command window, but the List Name notetag will
 *     appear in the skill list.
 * *** This does not change the display text. If you'd like to change that, use
 *     the Battle Core's <Display Text: x> notetag along with this notetag.
 * 
 * Version 1.53: September 18, 2025
 * * Bug Fixes!
 * ** Fixed a bug where the "Preset: Gauge Color" Plugin Parameter was not
 *    accepting #rrggbb values. Fix made by Arisu.
 * * Documentation Update!
 * ** Added extra clarity for <Passive State: x>:
 * *** If you are using VisuMZ's Equip Battle Skills, know that the notetag
 *     <Passive State: x> will always have the passive state be available no
 *     matter if the skill is equipped or not, as long as the skill is learned.
 * *** If you want the passive state to only appear while the skill is equipped
 *     then use the VisuMZ Equip Battle Skills notetag <Equip State: x> for
 *     this effect instead.
 * 
 * Version 1.52: August 14, 2025
 * * Feature Update!
 * ** Passive States with custom JS conditions should be less prone to infinite
 *    loops. Update made by Irina.
 * 
 * Version 1.51: April 17, 2025
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Olivia:
 * *** Plugin Parameters > Skill Toggle Settings
 * **** Skill toggles are a new type of skill. They do not perform any actions
 *      but instead, will switch on/off any passive effects the skill has.
 * **** Enemies are unable to switch Toggle Skills and the passive effects on a
 *      Toggle Skill for an enemy will always be considered ON.
 * **** See the help file for more information.
 * ** New Notetags added by Olivia:
 * *** Skill Toggle Notetags:
 * **** <Toggle>
 * **** <Initial Toggle: On/Off>
 * **** <Toggle Exclusion Group: key>
 * **** <Toggle On Animation: x>
 * **** <Toggle Off Animation: x>
 * ***** See the help file for more information.
 * 
 * Version 1.50: March 20, 2025
 * * Documentation Update!
 * ** Changed the description of Plugin Parameter 'Action End Update' to
 *    'Refer to "Major Changes" in Help File for explanation.'
 * ** Added examples of "Action End Update" under "Major Changes"
 * *** The new state: "Fiery Blade" will allow the affected battler to deal
 *     fire elemental damage. With Action End, this means for 5 actions, those
 *     attacks will deal fire damage.
 * *** This means that if no action is taken, due to a status effect like
 *     "Sleep" or "Stun", then the duration count will not decrease.
 * *** On the flip side, if the battler performs multiple actions a turn, then
 *     the duration count drops faster because more actions have been spent.
 * *** However, if this "Fiery Blade" state was using Turn End instead, it will
 *     have its duration reduced by 1 each turn, regardless of "Sleep" or
 *     "Stun" states, and regardless of how many actions are performed each
 *     turn.
 * 
 * Version 1.49: February 20, 2025
 * * Bug Fixes!
 * ** Fixed a bug where causing a dead battler to refresh afterwards would
 *    yield multiple death states on that battler. Fix made by Arisu.
 * * Compatibility Update!
 * ** Updated for RPG Maker MZ Core Scripts 1.9.0!
 * *** Better compatibility with different icon sizes.
 * 
 * Version 1.48: December 19, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** Auras & Miasmas added by Olivia:
 * *** Auras are a type passive that affects an allied party. Miasmas are a
 *     type of passive that affects an opposing party. Auras and Miasmas only
 *     need to come from a single source to give an entire party or troop a
 *     passive provided that the battler emitting the aura/miasma is alive and
 *     in battle.
 * ** New Notetags added by Olivia:
 * *** <Aura State: x>
 * **** Emits an aura that affects the battler's allies and gives each affected
 *      member passive state(s) 'x'.
 * *** <Miasma State: x>
 * **** Emits an aura that affects the battler's opponents and gives each
 *      affected member passive state(s) 'x'.
 * *** <Not User Aura>
 * **** Prevents the emitting user from being affected by the related aura.
 * *** <Allow Dead Aura>
 * *** <Allow Dead Miasma>
 * **** Allows aura/miasma to continue emitting even after the emitting user is
 *      in a dead state.
 * *** <Dead Aura Only>
 * *** <Dead Miasma Only>
 * **** Allows aura/miasma to only emit if the emitting user is in a dead state
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.47: August 29, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New notetags added by Arisu:
 * *** <Bypass State Damage Removal: id/name>
 * **** When this skill/item is used to attack an enemy with the listed state
 *      that would normally have on damage removal (ie Sleep).
 * **** This can be used for attacks like "Dream Eater" that would prevent
 *      waking up a sleeping opponent.
 * *** <Bypass State Damage Removal as Attacker: id/name>
 * **** When an attacker with an associated trait object that has this notetag
 *      would attack an enemy with the listed state, bypass on damage removal.
 * **** This can be used for effects like "Sleep Striker" that would prevent
 *      the attacker from waking up a sleeping opponent.
 * *** <Bypass State Damage Removal as Target: id/name>
 * **** When a target with an associated trait object that has this notetag is
 *      attacked as the target with the listed state, bypass on damage removal.
 * **** This can be used for effects like "Deep Sleep" that would prevent the
 *      attacked target from waking up.
 * 
 * Version 1.46: July 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Parameters > Skill Settings > Skill Types > Sort: Alphabetical
 * **** Insert the ID's of Skill Types you want sorted alphabetically.
 * ** New notetags added by Irina:
 * *** <ID Sort Priority: x>
 * **** Used for Scene_Skill.
 * **** Changes sorting priority by ID for skill to 'x'. 
 * **** Default priority level is '50'.
 * **** Skills with higher priority values will be sorted higher up on the list
 *      while lower values will be lower on the list.
 * 
 * Version 1.45: May 16, 2024
 * * Bug Fixes!
 * ** Fixed a problem with passive state conditional notetags not working
 *    properly. Fix made by Irina.
 * 
 * Version 1.44: April 18, 2024
 * * Bug Fixes!
 * ** Fixed a bug where passive states would not appear. Fix made by Olivia.
 * ** Fixed a bug where a crash would occur if certain plugins cleared the
 *    passive state cache midway through trying to register it. Fix by Olivia.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * ** States with lots and lots of text data within their notes will no longer
 *    cause FPS drops.
 * 
 * Version 1.43: January 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Commands added by Arisu!
 * *** Skill Cost: Emulate Actor Pay
 * *** Skill Cost: Emulate Enemy Pay
 * **** Target actor(s)/enemy(s) emulates paying for skill cost.
 * *** State Turns: Actor State Turns Change By
 * *** State Turns: Actor State Turns Change To
 * *** State Turns: Enemy State Turns Change By
 * *** State Turns: Enemy State Turns Change To
 * **** Changes actor(s)/enemy(s) state turns to a specific value/by an amount.
 * **** Only works on states that can have turns.
 * 
 * Version 1.42: November 16, 2023
 * * Bug Fixes!
 * ** 'origin' variable was not working properly for <JS On Expire State>
 *    JavaScript notetag. Should now be working properly. Fix made by Irina.
 * 
 * Version 1.41: September 14, 2023
 * * Bug Fixes!
 * ** Fixed a bug that prevented <Max Turns: x> for states from working due to
 *    one of the recent updates. Fix made by Arisu.
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Apparently, we never put <Max Turns: x> in the help notetag section.
 *    Woops... It's there now.
 * 
 * Version 1.40: August 17, 2023
 * * Bug Fixes!
 * ** Fixed a bug involving the "Item Cost" skill cost type found in the Plugin
 *    Parameters when involving consumable items.
 * *** If you want to acquire these settings for an already-existing project,
 *     do either of the following:
 * **** Delete the existing VisuMZ_1_SkillsStatesCore.js in the Plugin Manager
 *      list and install the newest version.
 * **** Or create a new project, install VisuMZ_1_SkillsStatesCore.js there,
 *      then copy over the "Item Cost" plugin parameters found in the "Skill
 *      Cost Types" plugin parameter settings to your current project.
 * 
 * Version 1.39: July 13, 2023
 * * Feature Update!
 * ** Updated the "Item Cost" skill cost type found in the Plugin Parameters to
 *    no longer consume items that are key items or nonconsumable.
 * *** If you want to acquire these settings for an already-existing project,
 *     do either of the following:
 * **** Delete the existing VisuMZ_1_SkillsStatesCore.js in the Plugin Manager
 *      list and install the newest version.
 * **** Or create a new project, install VisuMZ_1_SkillsStatesCore.js there,
 *      then copy over the "Item Cost" plugin parameters found in the "Skill
 *      Cost Types" plugin parameter settings to your current project.
 * 
 * Version 1.38: March 16, 2023
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added segment to <Replace x Gauge: type> in documentation:
 * *** Does not work with 'Item Cost', 'Weapon Cost', or 'Armor Cost'.
 * * New Features!
 * ** New "Skill Cost Type" and notetags added by Arisu and sponsored by FAQ.
 * *** <Item Cost: x name>
 * *** <Weapon Cost: x name>
 * *** <Armor Cost: x name>
 * **** The skill will consume items, weapons, and/or armors in order to be
 *      used. Even non-consumable items will be consumed.
 * *** <Item Cost Max/Min: x name>
 * *** <Weapon Cost Max/Min: x name>
 * *** <Armor Cost Max/Min: x name>
 * **** Sets up a maximum/minimum cost for the item, weapon, armor type costs.
 * *** <Item Cost: x% name>
 * *** <Weapon Cost: x% name>
 * *** <Armor Cost: x% name>
 * **** Alters cost rate of skills that would consume item, weapon, or armor.
 * *** <Item Cost: +/-x name>
 * *** <Weapon Cost: +/-x name>
 * *** <Armor Cost: +/-x name>
 * **** Alters flat costs of skills that would consume item, weapon, or armor.
 * *** <Replace Item name1 Cost: name2>
 * *** <Replace Weapon name1 Cost: name2>
 * *** <Replace Armor name1 Cost: name2>
 * **** Replaces item, weapon, or armor to be consumed for another type.
 * *** Projects with the Skills and States Core already installed will not have
 *     this update, but you can copy over the settings from a new project with
 *     the following steps:
 * **** Create a new project. Install Skills and States Core. Open up the new
 *      project's 'Skill Cost Types'.
 * **** Right click the 'Item Cost' option(s) and click copy.
 * **** Go to the target project's Skills and States Core's 'Skill Cost Types'
 *      plugin parameter. Paste the command where you want it to go.
 * **** Only 'Item Cost' is needed as it encompasses all three types for item,
 *      weapon, and armor costs.
 * 
 * Version 1.38: February 16, 2023
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.37: January 20, 2023
 * * Bug Fixes!
 * ** Fixed a bug that caused equipment to unequip if the needed equipment
 *    traits came from passive states upon learning new skills. Fix by Irina.
 * 
 * Version 1.36: December 15, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** When enemies are defeated with their entire party having a state with the
 *    <Group Defeat> notetag, then the party will gain EXP, Gold, and Drops
 *    before when they wouldn't. Update made by Irina.
 * * New Features!
 * ** New Plugin Parameter added by Irina!
 * *** Plugin Parameters > Skill Settings > Skill Type Window > Window Width
 * **** What is the desired pixel width of this window? Default: 240
 * 
 * Verison 1.35: October 13, 2022
 * * Feature Update!
 * ** Default values for Passive States > Cache > Switch Refresh? and Variable
 *    Refresh? are now set to "false" in order to prevent sudden lag spikes for
 *    those who are unfamiliar with how this setting works.
 * ** Update made by Irina.
 * 
 * Version 1.34: September 29, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Irina and sponsored by AndyL:
 * *** Plugin Parameters > Gauge Settings
 * **** These settings allow you to make minor tweaks to how the gauges look
 *      ranging from the color used for the labels to the outline types used
 *      for the values.
 * 
 * Version 1.33: August 11, 2022
 * * Bug Fixes!
 * ** Fixed a crash that occurs when performing a custom action sequence
 *    without a skill attached to it. Fix made by Olivia.
 * 
 * Version 1.32: June 16, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameters added by Arisu:
 * *** Plugin Parameters > Passive State Settings > Cache > Switch Refresh?
 * *** Plugin Parameters > Passive State Settings > Cache > Variable Refresh?
 * **** Refresh all battle members when switches/variables are changed in
 *      battle?
 * **** This is primarily used for passive state conditions involve parameters
 *      that do not update due to cached data until a refresh occurs.
 * **** If this is on, do not spam Switch/Variable changes during battle in
 *      order to prevent lag spikes.
 * 
 * Version 1.31: April 28, 2022
 * * Bug Fixes!
 * ** Custom Slip Damage JS is now totalled correctly into regular slip damage
 *    totals for damage popups. Fix made by Olivia.
 * 
 * Version 1.30: April 14, 2022
 * * Feature Update!
 * ** Changed the state data removal timing to be after JS notetag effects
 *    take place in order for data such as origin data to remain intact. Update
 *    made by Irina.
 * 
 * Version 1.29: March 31, 2022
 * * Bug Fixes!
 * ** Fixed an error with <State x Category Remove: y> not countaing correctly
 *    unless the state count matched the exact amount. The notetag effect
 *    should work properly now. Fix made by Olivia.
 * 
 * Version 1.28: March 10, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** <State x Category Remove: All> updated to allow multiple cases in a
 *    single notebox. Updated by Arisu.
 * * New Features!
 * ** New Notetag added by Arisu and sponsored by Archeia!
 * *** <Remove Other x States>
 * **** When the state with this notetag is added, remove other 'x' category
 *      states from the battler (except for the state being added).
 * **** Useful for thing state types like stances and forms that there is
 *      usually only one active at a time.
 * 
 * Version 1.27: January 27, 2022
 * * Bug Fixes!
 * ** Custom JS Slip Damage/Healing values should now be recalculated on
 *    demand. Fix made by Olivia.
 * 
 * Version 1.26: January 20, 2022
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** Conditional Passive Bypass check is now stronger to prevent even more
 *    infinite loops from happening. Update made by Olivia.
 * * New Features!
 * ** New Plugin Parameter added by Olivia:
 * *** Plugin Parameters > State Settings > General > Turn End on Map
 * **** Update any state and buff turns on the map after this many steps.
 * **** Use 0 to disable.
 * 
 * Version 1.25: November 11, 2021
 * * Bug Fixes!
 * ** Hidden skill notetags should no longer crash upon not detecting actors
 *    for learned skills. Fix made by Olivia.
 * 
 * Version 1.24: November 4, 2021
 * * Documentation Update!
 * ** Added section: "Slip Damage Popup Clarification"
 * *** Slip Damage popups only show one popup for HP, MP, and TP each and it is
 *     the grand total of all the states and effects combined regardless of the
 *     number of states and effects on a battler. This is how it is in vanilla
 *     RPG Maker MZ and this is how we intend for it to be with the VisuStella
 *     MZ library.
 * *** This is NOT a bug!
 * *** The reason we are not changing this is because it does not properly
 *     relay information to the player accurately. When multiple popups appear,
 *     players only have roughly a second and a half to calculate it all for
 *     any form of information takeaway. We feel it is better suited for the
 *     player's overall convenience to show a cummulative change and steer the
 *     experience towards a more positive one.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.23: September 17, 2021
 * * Compatibility Update!
 * ** RPG Maker MZ 1.3.3 compatibility.
 * *** Updated how gauges are drawn.
 * *** Skill Cost Types Plugin Parameters need to be updated for those who want
 *     the updated gauges. This can be done easily with the following steps:
 * **** Step 1: Create a new project.
 * **** Step 2: Install Skills and States Core version 1.23 into it.
 * **** Step 3: Copy the Plugin Parameter Settings for "Skill Cost Types".
 * **** Step 4: Return back to your original project.
 * **** Step 5: Paste Plugin Parameter Settings on top of "Skill Cost Types".
 * 
 * Version 1.22: August 6, 2021
 * * Documentation Update!
 * ** "Action End Removal for States" under Major Updates is changed to:
 * *** If your Plugin Parameter settings for "Action End Update" are enabled,
 *     then "Action End" has been updated so that it actually applies per
 *     action used instead of just being at the start of a battler's action
 *     set.
 * *** However, there are side effects to this: if a state has the "Cannot
 *     Move" restriction along with the "Action End" removal timing, then
 *     unsurprisingly, the state will never wear off because it's now based on
 *     actual actions ending. To offset this and remove confusion, "Action End"
 *     auto-removal timings for states with "Cannot Move" restrictions will be
 *     turned into "Turn End" auto-removal timings while the "Action End
 *     Update" is enabled.
 * *** This automatic change won't make it behave like an "Action End" removal
 *     timing would, but it's better than completely softlocking a battler.
 * * Feature Update!
 * ** Those using "Cannot Move" states with "Action End" auto-removal will now
 *    have be automatically converted into "Turn End" auto-removal if the
 *    plugin parameter "Action End Update" is set to true. Update by Irina.
 * 
 * Version 1.21: July 30, 2021
 * * Documentation Update!
 * ** Expanded "Action End Removal for States" section in Major Changes.
 * *** These changes have been in effect since Version 1.07 but have not been
 *     explained in excess detail in the documentation since.
 * **** Action End has been updated so that it actually applies per action used
 *      instead of just being at the start of a battler's action set. However,
 *      there are side effects to this: if a state has the "Cannot Move"
 *      restriction along with the "Action End" removal timing, then
 *      unsurprisingly, the state will never wear off because it's now based on
 *      actual actions ending. There are two solutions to this:
 * **** Don't make "Cannot Move" restriction states with "Action End". This is
 *      not a workaround. This is how the state removal is intended to work
 *      under the new change.
 * **** Go to the Skills & States Core Plugin Parameters, go to State
 *      Setttings, look for "Action End Update", and set it to false. You now
 *      reverted the removal timing system back to how it originally was in RPG
 *      Maker MZ's default battle system where it only updates based on an
 *      action set rather than per actual action ending.
 * 
 * Version 1.20: June 18, 2021
 * * Feature Update!
 * ** Updated automatic caching for conditional passive states to update more
 *    efficiently. Update made by Arisu.
 * 
 * Version 1.19: June 4, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.18: May 21, 2021
 * * Documentation Update
 * ** Added "Passive State Clarification" section.
 * *** As there is a lot of confusion regarding how passive states work and how
 *     people still miss the explanations found in the "Passive State Notetags"
 *     section AND the "Plugin Parameters: Passive State Settings", we are
 *     adding a third section to explain how they work.
 * *** All three sections will contain the full detailed explanation of how
 *     passive states work to clear common misconceptions about them.
 * 
 * Version 1.17: May 7, 2021
 * * Bug Fixes
 * ** State category removal is now usable outside of battle. Fix by Irina.
 * 
 * Version 1.16: April 30, 2021
 * * Bug Fixes!
 * ** When states with step removal have the <No Recover All Clear> or
 *    <No Death Clear> notetags, their step counter is no longer reset either.
 *    Fix made by Irina.
 * * New Features!
 * ** New notetag added by Arisu!
 * *** <List Name: name>
 * **** Makes the name of the skill appear different when show in the skill
 *      list. Using \V[x] as a part of the name will display that variable.
 * 
 * Version 1.15: March 19, 2021
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.14: March 12, 2021
 * * Bug Fixes!
 * ** Max HP Buff/Debuff should now display its turn counter. Fix by Yanfly.
 * * Documentation Update!
 * ** For the <JS Passive Condition>, we've added documentation on the
 *    limitations of passive conditions since they have been reported as bug
 *    reports, when in reality, they are failsafes to prevent infinite loops.
 *    Such limitations include the following:
 * *** A passive state that requires another passive state
 * *** A passive state that requires a trait effect from another state
 * *** A passive state that requires a parameter value altered by another state
 * *** A passive state that requires equipment to be worn but its equipment
 *     type access is provided by another state.
 * *** Anything else that is similar in style.
 * 
 * Version 1.13: February 26, 2021
 * * Documentation Update!
 * ** For <JS type Slip Damage> and <JS type Slip Heal> notetags, added the
 *    following notes:
 * *** When these states are applied via action effects, the slip calculations
 *     are one time calculations made upon applying and the damage is cached to
 *     be used for future on regeneration calculations.
 * *** For that reason, do not include game mechanics here such as adding
 *     states, buffs, debuffs, etc. as this notetag is meant for calculations
 *     only. Use the VisuStella Battle Core's <JS Pre-Regenerate> and
 *     <JS Post-Regenerate> notetags for game mechanics instead.
 * *** Passive states and states with the <JS Slip Refresh> notetag are exempt
 *     from the one time calculation and recalculated each regeneration phase.
 * * Feature Update!
 * ** Changed slip refresh requirements to entail <JS Slip Refresh> notetag for
 *    extra clarity. Update made by Olivia.
 * 
 * Version 1.12: February 19, 2021
 * * Feature Update
 * ** Changed the way passive state infinite stacking as a blanket coverage.
 *    Update made by Olivia.
 * 
 * Version 1.11: February 12, 2021
 * * Bug Fixes!
 * ** Added a check to prevent passive states from infinitely stacking. Fix
 *    made by Olivia.
 * 
 * Version 1.10: January 15, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameters added
 * *** Plugin Parameters > Skill Settings > Background Type
 * 
 * Version 1.09: January 1, 2021
 * * Bug Fixes!
 * ** Custom JS TP slip damage and healing should now work properly.
 *    Fix made by Yanfly.
 * 
 * Version 1.08: December 25, 2020
 * * Bug Fixes!
 * ** <JS On Add State> should no longer trigger multiple times for the death
 *    state. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for updated feature(s)!
 * * Feature Update!
 * ** <No Death Clear> can now allow the affected state to be added to an
 *    already dead battler. Update made by Yanfly.
 * 
 * Version 1.07: December 18, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New notetags added by Yanfly:
 * *** <Passive Condition Multiclass: id>
 * *** <Passive Condition Multiclass: id, id, id>
 * *** <Passive Condition Multiclass: name>
 * *** <Passive Condition Multiclass: name, name, name>
 * ** New Plugin Parameter added by Yanfly.
 * *** Plugin Parameters > States > General > Action End Update
 * **** States with "Action End" auto-removal will also update turns at the end
 *      of each action instead of all actions.
 * ***** Turn this off if you wish for state turn updates to function like they
 *       do by default for "Action End".
 * 
 * Version 1.06: December 4, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.05: November 15, 2020
 * * Bug Fixes!
 * ** The alignment of the Skill Type Window is now fixed and will reflect upon
 *    the default settings. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** <State x Category Remove: All> notetag added by Yanfly.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.04: September 27, 2020
 * * Documentation Update
 * ** "Use Updated Layout" plugin parameters now have the added clause:
 *    "This will override the Core Engine windows settings." to reduce
 *    confusion. Added by Irina.
 * 
 * Version 1.03: September 13, 2020
 * * Bug Fixes!
 * ** <JS type Slip Damage> custom notetags now work for passive states. Fix
 *    made by Olivia.
 * ** Setting the Command Window style to "Text Only" will no longer add in
 *    the icon text codes. Bug fixed by Yanfly.
 * 
 * Version 1.02: August 30, 2020
 * * Bug Fixes!
 * ** The JS Notetags for Add, Erase, and Expire states are now fixed. Fix made
 *    by Yanfly.
 * * Documentation Update!
 * ** <Show if learned Skill: x> and <Hide if learned Skill: x> notetags have
 *    the following added to their descriptions:
 * *** This does not apply to skills added by traits on actors, classes, any
 *     equipment, or states. These are not considered learned skills. They are
 *     considered temporary skills.
 * * New Features!
 * ** Notetags added by Yanfly:
 * *** <Show if has Skill: x>
 * *** <Show if have All Skills: x,x,x>
 * *** <Show if have Any Skills: x,x,x>
 * *** <Show if has Skill: name>
 * *** <Show if have All Skills: name, name, name>
 * *** <Show if have Any Skills: name, name, name>
 * *** <Hide if has Skill: x>
 * *** <Hide if have All Skills: x,x,x>
 * *** <Hide if have Any Skills: x,x,x>
 * *** <Hide if has Skill: name>
 * *** <Hide if have All Skills: name, name, name>
 * *** <Hide if have Any Skills: name, name, name>
 * *** These have been added to remove the confusion regarding learned skills
 *     as skills added through trait effects are not considered learned skills
 *     by RPG Maker MZ.
 * 
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** Passive states from Elements & Status Menu Core are now functional.
 *    Fix made by Olivia.
 * * Compatibility Update
 * ** Extended functions to allow for better compatibility.
 * * Updated documentation
 * ** Explains that passive states are not directly applied and are therefore
 *    not affected by code such as "a.isStateAffected(10)".
 * ** Instead, use "a.states().includes($dataStates[10])"
 * ** "Use #rrggbb for a hex color." lines now replaced with
 *    "For a hex color, use #rrggbb with VisuMZ_1_MessageCore"
 *
 * Version 1.00: August 20, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Begin
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillActorPaySkillCost
 * @text Skill Cost: Emulate Actor Pay
 * @desc Target actor(s) emulates paying for skill cost.
 *
 * @arg ActorIDs:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) will pay skill cost.
 * @default ["1"]
 *
 * @arg SkillID:num
 * @text Skill ID
 * @type skill
 * @desc What is the ID of the skill to emulate paying the skill cost for?
 * @default 99
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillEnemyPaySkillCost
 * @text Skill Cost: Emulate Enemy Pay
 * @desc Target enemy(s) emulates paying for skill cost.
 *
 * @arg EnemyIndex:arraynum
 * @text Enemy Index(es)
 * @type actr[]
 * @desc Select which enemy index(es) will pay skill cost.
 * @default ["1"]
 *
 * @arg SkillID:num
 * @text Skill ID
 * @type skill
 * @desc What is the ID of the skill to emulate paying the skill cost for?
 * @default 99
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_StateTurns
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsActorChangeBy
 * @text State Turns: Actor State Turns Change By
 * @desc Changes actor(s) state turns by an amount.
 * Only works on states that can have turns.
 *
 * @arg ActorIDs:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns By
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default +1
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if actor(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsActorChangeTo
 * @text State Turns: Actor State Turns Change To
 * @desc Changes actor(s) state turns to a specific value.
 * Only works on states that can have turns.
 *
 * @arg ActorIDs:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns To
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default 10
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if actor(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsEnemyChangeBy
 * @text State Turns: Enemy State Turns Change By
 * @desc Changes enemy(s) state turns by an amount.
 * Only works on states that can have turns.
 *
 * @arg EnemyIndex:arraynum
 * @text Enemy Index(es)
 * @type actr[]
 * @desc Select which enemy index(es) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns By
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default +1
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if enemy(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command StateTurnsEnemyChangeTo
 * @text State Turns: Enemy State Turns Change To
 * @desc Changes enemy(s) state turns to a specific value.
 * Only works on states that can have turns.
 *
 * @arg EnemyIndex:arraynum
 * @text Enemy Index(es)
 * @type actr[]
 * @desc Select which enemy index(es) to affect.
 * @default ["1"]
 *
 * @arg StateID:num
 * @text State ID
 * @type state
 * @desc What is the ID of the state you wish to change turns for?
 * Only works on states that can have turns.
 * @default 5
 *
 * @arg Turns:eval
 * @text Change Turns To
 * @desc How many turns should the state be changed to?
 * You may use JavaScript code.
 * @default 10
 *
 * @arg AutoAddState:eval
 * @text Auto-Add State?
 * @type boolean
 * @on Auto-Add
 * @off Don't Add
 * @desc Automatically adds state if enemy(s) does not have it applied?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_End
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param SkillsStatesCore
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Skills:struct
 * @text Skill Settings
 * @type struct<Skills>
 * @desc Adjust general skill settings here.
 * @default {"General":"","EnableLayout:eval":"true","LayoutStyle:str":"upper/left","SkillTypeWindow":"","CmdStyle:str":"auto","CmdTextAlign:str":"left","ListWindow":"","ListWindowCols:num":"1","ShopStatusWindow":"","ShowShopStatus:eval":"true","SkillSceneAdjustSkillList:eval":"true","SkillMenuStatusRect:func":"\"const ww = this.shopStatusWidth();\\nconst wh = this._itemWindow.height;\\nconst wx = Graphics.boxWidth - this.shopStatusWidth();\\nconst wy = this._itemWindow.y;\\nreturn new Rectangle(wx, wy, ww, wh);\"","SkillTypes":"","HiddenSkillTypes:arraynum":"[]","BattleHiddenSkillTypes:arraynum":"[]","IconStypeNorm:num":"78","IconStypeMagic:num":"79","CustomJS":"","SkillConditionJS:func":"\"// Declare Variables\\nconst skill = arguments[0];\\nconst user = this;\\nconst target = this;\\nconst a = this;\\nconst b = this;\\nlet enabled = true;\\n\\n// Perform Checks\\n\\n\\n// Return boolean\\nreturn enabled;\""}
 *
 * @param Costs:arraystruct
 * @text Skill Cost Types
 * @parent Skills:struct
 * @type struct<Cost>[]
 * @desc A list of all the skill cost types added by this plugin
 * and the code that controls them in-game.
 * @default ["{\"Name:str\":\"HP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"20\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<HP COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<HP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.mhp / 100);\\\\n}\\\\nif (note.match(/<JS HP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS HP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<HP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<HP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<HP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<HP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nif (cost <= 0) {\\\\n    return true;\\\\n} else {\\\\n    return user._hp > cost;\\\\n}\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._hp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.hp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mhp;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.hp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.hpGaugeColor1();\\\\nconst color2 = ColorManager.hpGaugeColor2();\\\\nconst label = TextManager.hpA;\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = bitmapWidth;\\\\nconst lh = bitmapHeight;\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.hpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"MP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"23\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = Math.floor(skill.mpCost * user.mcr);\\\\nif (note.match(/<MP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.mmp / 100);\\\\n}\\\\nif (note.match(/<JS MP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS MP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<MP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<MP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<MP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<MP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn user._mp >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._mp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.mp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mmp;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.mpGaugeColor1();\\\\nconst color2 = ColorManager.mpGaugeColor2();\\\\nconst label = TextManager.mpA;\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = bitmapWidth;\\\\nconst lh = bitmapHeight;\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.mpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"TP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"29\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = skill.tpCost;\\\\nif (note.match(/<TP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.maxTp() / 100);\\\\n}\\\\nif (note.match(/<JS TP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS TP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<TP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<TP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<TP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<TP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn user._tp >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._tp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.tp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.maxTp();\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.tp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.tpGaugeColor1();\\\\nconst color2 = ColorManager.tpGaugeColor2();\\\\nconst label = TextManager.tpA;\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = bitmapWidth;\\\\nconst lh = bitmapHeight;\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.tpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Gold\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"17\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<GOLD COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<GOLD COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * $gameParty.gold() / 100);\\\\n}\\\\nif (note.match(/<JS GOLD COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS GOLD COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<GOLD COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<GOLD COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<GOLD COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<GOLD COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn $gameParty.gold() >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\n$gameParty.loseGold(cost);\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.currencyUnit;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn $gameParty.maxGold();\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn $gameParty.gold();\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\n\\\\n// Draw Label\\\\nconst label = TextManager.currencyUnit;\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = sprite.bitmapWidth();\\\\nconst lh = sprite.bitmapHeight();\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = sprite.bitmapWidth() - 2;\\\\nconst vh = sprite.bitmapHeight();\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.normalColor();\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Potion\",\"Settings\":\"\",\"Icon:num\":\"176\",\"FontColor:str\":\"0\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<POTION COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<JS POTION COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS POTION COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<POTION COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<POTION COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<POTION COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<POTION COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return Boolean\\\\nif (user.isActor() && cost > 0) {\\\\n    return $gameParty.numItems(item) >= cost;\\\\n} else {\\\\n    return true;\\\\n}\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst item = $dataItems[7];\\\\n\\\\n// Process Payment\\\\nif (user.isActor()) {\\\\n    $gameParty.loseItem(item, cost);\\\\n}\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = settings.Name;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '×%1'.format(cost);\\\\n\\\\n// Text: Add Icon\\\\ntext += '\\\\\\\\\\\\\\\\I[%1]'.format(item.iconIndex);\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return value\\\\nreturn $gameParty.maxItems(item);\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return value\\\\nreturn $gameParty.numItems(item);\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Settings\\\\nconst color1 = ColorManager.textColor(30);\\\\nconst color2 = ColorManager.textColor(31);\\\\n\\\\n// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst item = $dataItems[7];\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\nconst bitmapWidth = sprite.bitmapWidth();\\\\nconst bitmapHeight = sprite.textHeight ? sprite.textHeight() : sprite.bitmapHeight();\\\\nconst gaugeHeight = sprite.gaugeHeight();\\\\n\\\\n// Draw Gauge\\\\nconst gx = 0;\\\\nconst gy = bitmapHeight - gaugeHeight;\\\\nconst gw = bitmapWidth - gx;\\\\nconst gh = gaugeHeight;\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Icon\\\\nconst iconIndex = item.iconIndex;\\\\nconst iconBitmap = ImageManager.loadSystem(\\\\\\\"IconSet\\\\\\\");\\\\nconst pw = ImageManager.iconWidth;\\\\nconst ph = ImageManager.iconHeight;\\\\nconst sx = (iconIndex % 16) * pw;\\\\nconst sy = Math.floor(iconIndex / 16) * ph;\\\\nbitmap.blt(iconBitmap, sx, sy, pw, ph, 0, 0, 24, 24);\\\\n\\\\n// Draw Value\\\\nconst vw = bitmapWidth - 2;\\\\nconst vh = bitmapHeight;\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.normalColor();\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Item Cost\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"0\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = {\\\\n    items: {},\\\\n    weapons: {},\\\\n    armors: {},\\\\n};\\\\n\\\\n// Gather Cost Notetags\\\\n{ // Item Costs\\\\n    const notetag = /<ITEM COST:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n    const matches = note.match(notetag);\\\\n    if (matches) {\\\\n        for (const currentMatch of matches) {\\\\n            currentMatch.match(notetag);\\\\n            const amount = Number(RegExp.$1);\\\\n            const name = String(RegExp.$2).toUpperCase().trim();\\\\n            const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n            if (entry) {\\\\n                cost.items[entry.id] = amount;\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Weapon Costs\\\\n    const notetag = /<WEAPON COST:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n    const matches = note.match(notetag);\\\\n    if (matches) {\\\\n        for (const currentMatch of matches) {\\\\n            currentMatch.match(notetag);\\\\n            const amount = Number(RegExp.$1);\\\\n            const name = String(RegExp.$2).toUpperCase().trim();\\\\n            const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n            if (entry) {\\\\n                cost.weapons[entry.id] = amount;\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Armor Costs\\\\n    const notetag = /<ARMOR COST:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n    const matches = note.match(notetag);\\\\n    if (matches) {\\\\n        for (const currentMatch of matches) {\\\\n            currentMatch.match(notetag);\\\\n            const amount = Number(RegExp.$1);\\\\n            const name = String(RegExp.$2).toUpperCase().trim();\\\\n            const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n            if (entry) {\\\\n                cost.armors[entry.id] = amount;\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Declare Trait Objects\\\\nconst traitObjects = user.traitObjects();\\\\n\\\\n// Apply Cost Rate Modifiers\\\\nfor (const traitObject of traitObjects) {\\\\n    if (!traitObject) continue;\\\\n    const objNote = traitObject.note || '';\\\\n    { // Item Cost Rate Modifiers\\\\n        const notetag = /<ITEM COST:[ ](\\\\\\\\d+)([%％])[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const rate = Number(RegExp.$1) * 0.01;\\\\n                const name = String(RegExp.$3).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id]) {\\\\n                    cost.items[entry.id] = Math.ceil(cost.items[entry.id] * rate);\\\\n                    if (cost.items[entry.id] <= 0) cost.items[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Weapon Cost Rate Modifiers\\\\n        const notetag = /<WEAPON COST:[ ](\\\\\\\\d+)([%％])[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const rate = Number(RegExp.$1) * 0.01;\\\\n                const name = String(RegExp.$3).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id]) {\\\\n                    cost.weapons[entry.id] = Math.ceil(cost.weapons[entry.id] * rate);\\\\n                    if (cost.weapons[entry.id] <= 0) cost.weapons[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Armor Cost Rate Modifiers\\\\n        const notetag = /<ARMOR COST:[ ](\\\\\\\\d+)([%％])[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const rate = Number(RegExp.$1) * 0.01;\\\\n                const name = String(RegExp.$3).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id]) {\\\\n                    cost.armors[entry.id] = Math.ceil(cost.armors[entry.id] * rate);\\\\n                    if (cost.armors[entry.id] <= 0) cost.armors[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Apply Flat Cost Modifiers\\\\nfor (const traitObject of traitObjects) {\\\\n    if (!traitObject) continue;\\\\n    const objNote = traitObject.note || '';\\\\n    { // Item Flat Cost Modifiers\\\\n        const notetag = /<ITEM COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const flat = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id]) {\\\\n                    cost.items[entry.id] += flat;\\\\n                    if (cost.items[entry.id] <= 0) cost.items[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Weapon Flat Cost Modifiers\\\\n        const notetag = /<WEAPON COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const flat = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id]) {\\\\n                    cost.weapons[entry.id] += flat;\\\\n                    if (cost.weapons[entry.id] <= 0) cost.weapons[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Armor Flat Cost Modifiers\\\\n        const notetag = /<ARMOR COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const flat = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id]) {\\\\n                    cost.armors[entry.id] += flat;\\\\n                    if (cost.armors[entry.id] <= 0) cost.armors[entry.id] = 0;\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Set Cost Limits\\\\n{ // Item Cost Limits\\\\n    { // Maximum Cost\\\\n        const notetag = /<ITEM COST MAX:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const max = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id] !== undefined) {\\\\n                    cost.items[entry.id] = Math.min(max, cost.items[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Minimum Cost\\\\n        const notetag = /<ITEM COST MIN:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const min = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.items[entry.id] !== undefined) {\\\\n                    cost.items[entry.id] = Math.max(min, cost.items[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Weapon Cost Limits\\\\n    { // Maximum Cost\\\\n        const notetag = /<WEAPON COST MAX:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const max = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id] !== undefined) {\\\\n                    cost.weapons[entry.id] = Math.min(max, cost.weapons[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Minimum Cost\\\\n        const notetag = /<WEAPON COST MIN:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const min = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.weapons[entry.id] !== undefined) {\\\\n                    cost.weapons[entry.id] = Math.max(min, cost.weapons[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Armor Cost Limits\\\\n    { // Maximum Cost\\\\n        const notetag = /<ARMOR COST MAX:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const max = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id] !== undefined) {\\\\n                    cost.armors[entry.id] = Math.min(max, cost.armors[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Minimum Cost\\\\n        const notetag = /<ARMOR COST MIN:[ ](\\\\\\\\d+)[ ](.*)>/gi;\\\\n        const matches = note.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const min = Number(RegExp.$1);\\\\n                const name = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name);\\\\n                if (entry && cost.armors[entry.id] !== undefined) {\\\\n                    cost.armors[entry.id] = Math.max(min, cost.armors[entry.id]);\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Apply Replacement Costs\\\\nfor (const traitObject of traitObjects) {\\\\n    if (!traitObject) continue;\\\\n    const objNote = traitObject.note || '';\\\\n    { // Item Replacement Costs\\\\n        const notetag = /<REPLACE ITEM (.*) COST:[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const name1 = String(RegExp.$1).toUpperCase().trim();\\\\n                const name2 = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry1 = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name1);\\\\n                const entry2 = $dataItems.find(obj => obj && obj.name.toUpperCase().trim() === name2);\\\\n                if (entry1 && entry2 && cost.items[entry1.id]) {\\\\n                    cost.items[entry2.id] = cost.items[entry1.id];\\\\n                    delete cost.items[entry1.id];\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Weapon Replacement Costs\\\\n        const notetag = /<REPLACE WEAPON (.*) COST:[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const name1 = String(RegExp.$1).toUpperCase().trim();\\\\n                const name2 = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry1 = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name1);\\\\n                const entry2 = $dataWeapons.find(obj => obj && obj.name.toUpperCase().trim() === name2);\\\\n                if (entry1 && entry2 && cost.weapons[entry1.id]) {\\\\n                    cost.weapons[entry2.id] = cost.weapons[entry1.id];\\\\n                    delete cost.items[entry1.id];\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n    { // Armor Replacement Costs\\\\n        const notetag = /<REPLACE ARMOR (.*) COST:[ ](.*)>/gi;\\\\n        const matches = objNote.match(notetag);\\\\n        if (matches) {\\\\n            for (const currentMatch of matches) {\\\\n                currentMatch.match(notetag);\\\\n                const name1 = String(RegExp.$1).toUpperCase().trim();\\\\n                const name2 = String(RegExp.$2).toUpperCase().trim();\\\\n                const entry1 = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name1);\\\\n                const entry2 = $dataArmors.find(obj => obj && obj.name.toUpperCase().trim() === name2);\\\\n                if (entry1 && entry2 && cost.armors[entry1.id]) {\\\\n                    cost.armors[entry2.id] = cost.armors[entry1.id];\\\\n                    delete cost.items[entry1.id];\\\\n                }\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Return cost data\\\\nreturn cost;\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Check Individual Costs\\\\n{ // Check Item Costs\\\\n    for (let id in cost.items) {\\\\n        const obj = $dataItems[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.items[id];\\\\n            const ownedAmount = $gameParty.numItems(obj);\\\\n            if (costAmount > ownedAmount) return false;\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Weapon Costs\\\\n    for (let id in cost.weapons) {\\\\n        const obj = $dataWeapons[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.weapons[id];\\\\n            const ownedAmount = $gameParty.numItems(obj);\\\\n            if (costAmount > ownedAmount) return false;\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Armor Costs\\\\n    for (let id in cost.armors) {\\\\n        const obj = $dataArmors[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.armors[id];\\\\n            const ownedAmount = $gameParty.numItems(obj);\\\\n            if (costAmount > ownedAmount) return false;\\\\n        }\\\\n    }\\\\n}\\\\n\\\\n// Return True\\\\nreturn true;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\n{ // Check Item Costs\\\\n    for (let id in cost.items) {\\\\n        const obj = $dataItems[id];\\\\n        if (obj && obj.consumable) {\\\\n            if (obj.itypeId !== 2) {\\\\n                const costAmount = cost.items[id];\\\\n                $gameParty.loseItem(obj, costAmount);\\\\n            }\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Weapon Costs\\\\n    for (let id in cost.weapons) {\\\\n        const obj = $dataWeapons[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.weapons[id];\\\\n            $gameParty.loseItem(obj, costAmount);\\\\n        }\\\\n    }\\\\n}\\\\n{ // Check Armor Costs\\\\n    for (let id in cost.armors) {\\\\n        const obj = $dataArmors[id];\\\\n        if (obj) {\\\\n            const costAmount = cost.armors[id];\\\\n            $gameParty.loseItem(obj, costAmount);\\\\n        }\\\\n    }\\\\n}\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Check Keys\\\\nconst keys = ['items', 'weapons', 'armors'];\\\\n\\\\n// Return False\\\\nreturn keys.some(key => Object.keys(cost[key]).length > 0);\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = settings.Name;\\\\nconst icon = settings.Icon;\\\\nconst keys = ['items', 'weapons', 'armors'];\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\nfor (const key of keys) {\\\\n    const database = [$dataItems, $dataWeapons, $dataArmors][keys.indexOf(key)];\\\\n    const costData = cost[key];\\\\n    const idList = Object.keys(costData).sort((a, b) => a - b);\\\\n    for (const id of idList) {\\\\n        const obj = database[id];\\\\n        const iconIndex = obj.iconIndex;\\\\n        const costAmount = costData[id];\\\\n        text += '\\\\\\\\\\\\\\\\I[%1]×%2 '.format(iconIndex, costAmount);\\\\n    }\\\\n}\\\\n\\\\n// Return text\\\\nreturn text.trim();\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn 0;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn 0;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Don't Draw Anything\\\\n// This does not work as a gauge.\\\"\"}"]
 *
 * @param Toggles:struct
 * @text Skill Toggle Settings
 * @parent Skills:struct
 * @type struct<Toggles>
 * @desc Settings in regards to how skill toggles function.
 * @default {"Default":"","DefaultToggle:eval":"true","ToggleOffAnimationID:num":"62","Appear":"","ToggleOnTextColor:str":"24","Vocab":"","ToggleType:str":"Toggle","ToggleOn:str":"\\FS[22]\\C[0][ON]","ToggleOff:str":"\\FS[22]\\C[8][OFF]","ToggleOffLocation:str":"back"}
 *
 * @param Gauge:struct
 * @text Gauge Settings
 * @parent Skills:struct
 * @type struct<Gauge>
 * @desc Settings in regards to how skill cost gauges function and appear.
 * @default {"Labels":"","LabelFontMainType:str":"main","MatchLabelColor:eval":"true","MatchLabelGaugeColor:num":"2","PresetLabelGaugeColor:num":"16","LabelOutlineSolid:eval":"true","LabelOutlineWidth:num":"3","Values":"","ValueFontMainType:str":"number","ValueOutlineSolid:eval":"true","ValueOutlineWidth:num":"3"}
 *
 * @param BreakSkills
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param States:struct
 * @text State Settings
 * @type struct<States>
 * @desc Adjust general state settings here.
 * @default {"General":"","ReapplyRules:str":"greater","MaxTurns:num":"99","ActionEndUpdate:eval":"true","Turns":"","ShowTurns:eval":"true","TurnFontSize:num":"16","TurnOffsetX:num":"-4","TurnOffsetY:num":"-6","ColorNeutral:str":"0","ColorPositive:str":"24","ColorNegative:str":"27","Data":"","ShowData:eval":"true","DataFontSize:num":"12","DataOffsetX:num":"0","DataOffsetY:num":"8","CustomJS":"","onAddStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\"","onEraseStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\""}
 *
 * @param Buffs:struct
 * @text Buff/Debuff Settings
 * @parent States:struct
 * @type struct<Buffs>
 * @desc Adjust general buff/debuff settings here.
 * @default {"General":"","ReapplyRules:str":"greater","MaxTurns:num":"99","Stacking":"","StackBuffMax:num":"2","StackDebuffMax:num":"2","MultiplierJS:func":"\"// Declare Variables\\nconst user = this;\\nconst paramId = arguments[0];\\nconst buffLevel = arguments[1];\\nlet rate = 1;\\n\\n// Perform Calculations\\nrate += buffLevel * 0.25;\\n\\n// Return Rate\\nreturn Math.max(0, rate);\"","Turns":"","ShowTurns:eval":"true","TurnFontSize:num":"16","TurnOffsetX:num":"-4","TurnOffsetY:num":"-6","ColorBuff:str":"24","ColorDebuff:str":"27","Data":"","ShowData:eval":"false","DataFontSize:num":"12","DataOffsetX:num":"0","DataOffsetY:num":"8","CustomJS":"","onAddBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onAddDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onEraseBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onEraseDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\""}
 *
 * @param PassiveStates:struct
 * @text Passive States
 * @parent States:struct
 * @type struct<PassiveStates>
 * @desc Adjust passive state settings here.
 * @default {"List":"","Global:arraynum":"[]","Actor:arraynum":"[]","Enemy:arraynum":"[]","CustomJS":"","PassiveConditionJS:func":"\"// Declare Variables\\nconst state = arguments[0];\\nconst stateId = state.id;\\nconst user = this;\\nconst target = this;\\nconst a = this;\\nconst b = this;\\nlet condition = true;\\n\\n// Perform Checks\\n\\n\\n// Return boolean\\nreturn condition;\""}
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
/* ----------------------------------------------------------------------------
 * General Skill Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Skills:
 *
 * @param General
 *
 * @param EnableLayout:eval
 * @text Use Updated Layout
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use the Updated Skill Menu Layout provided by this plugin?
 * This will override the Core Engine windows settings.
 * @default true
 *
 * @param LayoutStyle:str
 * @text Layout Style
 * @parent General
 * @type select
 * @option Upper Help, Left Input
 * @value upper/left
 * @option Upper Help, Right Input
 * @value upper/right
 * @option Lower Help, Left Input
 * @value lower/left
 * @option Lower Help, Right Input
 * @value lower/right
 * @desc If using an updated layout, how do you want to style
 * the menu scene layout?
 * @default upper/left
 *
 * @param SkillTypeWindow
 * @text Skill Type Window
 *
 * @param CmdStyle:str
 * @text Style
 * @parent SkillTypeWindow
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Skill Type Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent SkillTypeWindow
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Skill Type Window.
 * @default left
 * 
 * @param CmdWidth:num
 * @text Window Width
 * @parent SkillTypeWindow
 * @type number
 * @min 1
 * @desc What is the desired pixel width of this window?
 * Default: 240
 * @default 240
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListWindowCols:num
 * @text Columns
 * @parent ListWindow
 * @type number
 * @min 1
 * @desc Number of maximum columns.
 * @default 1
 *
 * @param ShopStatusWindow
 * @text Shop Status Window
 *
 * @param ShowShopStatus:eval
 * @text Show in Skill Menu?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Show
 * @off Don't Show
 * @desc Show the Shop Status Window in the Skill Menu?
 * This is enabled if the Updated Layout is on.
 * @default true
 *
 * @param SkillSceneAdjustSkillList:eval
 * @text Adjust List Window?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the Skill List Window in the Skill Menu if using the Shop Status Window?
 * @default true
 *
 * @param SkillSceneStatusBgType:num
 * @text Background Type
 * @parent ShopStatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param SkillMenuStatusRect:func
 * @text JS: X, Y, W, H
 * @parent ShopStatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this Shop Status Window in the Skill Menu.
 * @default "const ww = this.shopStatusWidth();\nconst wh = this._itemWindow.height;\nconst wx = Graphics.boxWidth - this.shopStatusWidth();\nconst wy = this._itemWindow.y;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param SkillTypes
 * @text Skill Types
 *
 * @param HiddenSkillTypes:arraynum
 * @text Hidden Skill Types
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of the Skill Types you want hidden from view ingame.
 * @default []
 *
 * @param BattleHiddenSkillTypes:arraynum
 * @text Hidden During Battle
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of the Skill Types you want hidden during battle only.
 * @default []
 *
 * @param IconStypeNorm:num
 * @text Icon: Normal Type
 * @parent SkillTypes
 * @desc Icon used for normal skill types that aren't assigned any icons.
 * @default 78
 *
 * @param IconStypeMagic:num
 * @text Icon: Magic Type
 * @parent SkillTypes
 * @desc Icon used for magic skill types that aren't assigned any icons.
 * @default 79
 *
 * @param SortSkillTypesAbc:arraynum
 * @text Sort: Alphabetical
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of Skill Types you want sorted alphabetically.
 * @default []
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param SkillConditionJS:func
 * @text JS: Skill Conditions
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide skill condition check.
 * @default "// Declare Variables\nconst skill = arguments[0];\nconst user = this;\nconst target = this;\nconst a = this;\nconst b = this;\nlet enabled = true;\n\n// Perform Checks\n\n\n// Return boolean\nreturn enabled;"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Cost Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Cost:
 *
 * @param Name:str
 * @text Name
 * @desc A name for this Skill Cost Type.
 * @default Untitled
 *
 * @param Settings
 *
 * @param Icon:num
 * @text Icon
 * @parent Settings
 * @desc Icon used for this Skill Cost Type.
 * Use 0 for no icon.
 * @default 0
 *
 * @param FontColor:str
 * @text Font Color
 * @parent Settings
 * @desc Text Color used to display this cost.
 * For a hex color, use #rrggbb with VisuMZ_1_MessageCore
 * @default 0
 *
 * @param FontSize:num
 * @text Font Size
 * @parent Settings
 * @type number
 * @min 1
 * @desc Font size used to display this cost.
 * @default 22
 *
 * @param Cost
 * @text Cost Processing
 *
 * @param CalcJS:func
 * @text JS: Cost Calculation
 * @parent Cost
 * @type note
 * @desc Code on how to calculate this resource cost for the skill.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nlet cost = 0;\n\n// Return cost value\nreturn Math.round(Math.max(0, cost));"
 *
 * @param CanPayJS:func
 * @text JS: Can Pay Cost?
 * @parent Cost
 * @type note
 * @desc Code on calculating whether or not the user is able to pay the cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Return Boolean\nreturn true;"
 *
 * @param PayJS:func
 * @text JS: Paying Cost
 * @parent Cost
 * @type note
 * @desc Code for if met, this is the actual process of paying of the cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Process Payment\n"
 *
 * @param Windows
 * @text Window Display
 *
 * @param ShowJS:func
 * @text JS: Show Cost?
 * @parent  Windows
 * @type note
 * @desc Code for determining if the cost is shown or not.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Return Boolean\nreturn cost > 0;"
 *
 * @param TextJS:func
 * @text JS: Cost Text
 * @parent  Windows
 * @type note
 * @desc Code to determine the text (with Text Code support) used for the displayed cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\nconst settings = arguments[2];\nconst fontSize = settings.FontSize;\nconst color = settings.FontColor;\nconst name = settings.Name;\nconst icon = settings.Icon;\nlet text = '';\n\n// Text: Change Font Size\ntext += '\\\\FS[%1]'.format(fontSize);\n\n// Text: Add Color\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\n    text += '\\\\HexColor<#%1>'.format(String(RegExp.$1));\n} else {\n    text += '\\\\C[%1]'.format(color);\n}\n\n// Text: Add Cost\ntext += '%1 %2'.format(cost, name);\n\n// Text: Add Icon\nif (icon  > 0) {\n    text += '\\\\I[%1]'.format(icon);\n}\n\n// Return text\nreturn text;"
 *
 * @param Gauges
 * @text Gauge Display
 *
 * @param GaugeMaxJS:func
 * @text JS: Maximum Value
 * @parent  Gauges
 * @type note
 * @desc Code to determine the maximum value used for this Skill Cost resource for gauges.
 * @default "// Declare Variables\nconst user = this;\n\n// Return value\nreturn 0;"
 *
 * @param GaugeCurrentJS:func
 * @text JS: Current Value
 * @parent  Gauges
 * @type note
 * @desc Code to determine the current value used for this Skill Cost resource for gauges.
 * @default "// Declare Variables\nconst user = this;\n\n// Return value\nreturn 0;"
 *
 * @param GaugeDrawJS:func
 * @text JS: Draw Gauge
 * @parent  Gauges
 * @type note
 * @desc Code to determine how to draw the Skill Cost resource for this gauge type.
 * @default "// Declare Variables\nconst sprite = this;\nconst settings = sprite._costSettings;\nconst bitmap = sprite.bitmap;\nconst user = sprite._battler;\nconst currentValue = sprite.currentDisplayedValue();\n\n// Draw Gauge\nconst color1 = ColorManager.textColor(30);\nconst color2 = ColorManager.textColor(31);\nconst gx = 0;\nconst gy = sprite.bitmapHeight() - sprite.gaugeHeight();\nconst gw = sprite.bitmapWidth() - gx;\nconst gh = sprite.gaugeHeight();\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\n\n// Draw Label\nconst label = settings.Name;\nconst lx = 4;\nconst ly = 0;\nconst lw = sprite.bitmapWidth();\nconst lh = sprite.bitmapHeight();\nsprite.setupLabelFont();\nbitmap.paintOpacity = 255;\nbitmap.drawText(label, lx, ly, lw, lh, \"left\");\n\n// Draw Value\nconst vw = sprite.bitmapWidth() - 2;\nconst vh = sprite.bitmapHeight();\nsprite.setupValueFont();\nbitmap.textColor = ColorManager.normalColor();\nbitmap.drawText(currentValue, 0, 0, vw, vh, \"right\");"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Toggle Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Toggles:
 *
 * @param Default
 *
 * @param DefaultToggle:eval
 * @text Default Toggle
 * @parent Default
 * @type boolean
 * @on ON
 * @off OFF
 * @desc What is the default toggle setting for toggle skills?
 * @default true
 *
 * @param ToggleOffAnimationID:num
 * @text Toggle Off Animation
 * @parent Default
 * @type animation
 * @desc Play this animation when a skill is toggled off.
 * Requires VisuMZ_0_CoreEngine.
 * @default 62
 *
 * @param Appear
 * @text Appearance
 *
 * @param ToggleOnTextColor:str
 * @text Toggle On Text Color
 * @parent Appear
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param Vocab
 * @text Vocabulary
 *
 * @param ToggleType:str
 * @text Toggle Type
 * @parent Vocab
 * @desc Skill toggle displayed in the status window.
 * @default Toggle
 *
 * @param ToggleOn:str
 * @text Toggle On
 * @parent Vocab
 * @desc Text displayed for a skill that's toggled on
 * @default \FS[22]\C[0][ON]
 *
 * @param ToggleOff:str
 * @text Toggle Off
 * @parent Vocab
 * @desc Text displayed for a skill that's toggled off
 * @default \FS[22]\C[8][OFF]
 *
 * @param ToggleOffLocation:str
 * @text Off Text Location
 * @parent ToggleOff:str
 * @type select
 * @option front
 * @option back
 * @desc Where is the [OFF] text located in the skill cost?
 * @default back
 *
 */
/* ----------------------------------------------------------------------------
 * Gauge Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Gauge:
 *
 * @param Labels
 *
 * @param LabelFontMainType:str
 * @text Font Type
 * @parent Labels
 * @type select
 * @option main
 * @option number
 * @desc Which font type should be used for labels?
 * @default main
 *
 * @param MatchLabelColor:eval
 * @text Match Label Color
 * @parent Labels
 * @type boolean
 * @on Match
 * @off Preset
 * @desc Match the label color to the Gauge Color being used?
 * @default true
 *
 * @param MatchLabelGaugeColor:num
 * @text Match: Gauge # ?
 * @parent MatchLabelColor:eval
 * @type number
 * @min 1
 * @max 2
 * @desc Which Gauge Color should be matched?
 * @default 2
 *
 * @param PresetLabelGaugeColor:str
 * @text Preset: Gauge Color
 * @parent MatchLabelColor:eval
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 16
 *
 * @param LabelOutlineSolid:eval
 * @text Solid Outline
 * @parent Labels
 * @type boolean
 * @on Solid
 * @off Semi-Transparent
 * @desc Make the label outline a solid black color?
 * @default true
 *
 * @param LabelOutlineWidth:num
 * @text Outline Width
 * @parent Labels
 * @type number
 * @min 0
 * @desc What width do you wish to use for your outline?
 * Use 0 to not use an outline.
 * @default 3
 *
 * @param Values
 *
 * @param ValueFontMainType:str
 * @text Font Type
 * @parent Values
 * @type select
 * @option main
 * @option number
 * @desc Which font type should be used for values?
 * @default number
 *
 * @param ValueOutlineSolid:eval
 * @text Solid Outline
 * @parent Values
 * @type boolean
 * @on Solid
 * @off Semi-Transparent
 * @desc Make the value outline a solid black color?
 * @default true
 *
 * @param ValueOutlineWidth:num
 * @text Outline Width
 * @parent Values
 * @type number
 * @min 0
 * @desc What width do you wish to use for your outline?
 * Use 0 to not use an outline.
 * @default 3
 *
 */
/* ----------------------------------------------------------------------------
 * General State Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~States:
 *
 * @param General
 *
 * @param ReapplyRules:str
 * @text Reapply Rules
 * @parent General
 * @type select
 * @option Ignore: State doesn't get added.
 * @value ignore
 * @option Reset: Turns get reset.
 * @value reset
 * @option Greater: Turns take greater value (current vs reset).
 * @value greater
 * @option Add: Turns add upon existing turns.
 * @value add
 * @desc These are the rules when reapplying states.
 * @default greater
 *
 * @param MaxTurns:num
 * @text Maximum Turns
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of turns to let states go up to.
 * This can be changed with the <Max Turns: x> notetag.
 * @default 9999
 *
 * @param ActionEndUpdate:eval
 * @text Action End Update
 * @parent General
 * @type boolean
 * @on Update Each Action
 * @off Don't Change
 * @desc Refer to "Major Changes" in Help File for explanation.
 * @default true
 *
 * @param TurnEndOnMap:num
 * @text Turn End on Map
 * @parent General
 * @type number
 * @desc Update any state and buff turns on the map after
 * this many steps. Use 0 to disable.
 * @default 20
 *
 * @param Turns
 * @text Turn Display
 *
 * @param ShowTurns:eval
 * @text Show Turns?
 * @parent Turns
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display state turns on top of window icons and sprites?
 * @default true
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @type number
 * @min 1
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param TurnOffsetX:num
 * @text Offset X
 * @parent Turns
 * @desc Offset the X position of the turn display.
 * @default -4
 *
 * @param TurnOffsetY:num
 * @text Offset Y
 * @parent Turns
 * @desc Offset the Y position of the turn display.
 * @default -6
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param ColorNeutral:str
 * @text Turn Color: Neutral
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param ColorPositive:str
 * @text Turn Color: Positive
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorNegative:str
 * @text Turn Color: Negative
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param Data
 * @text Data Display
 *
 * @param ShowData:eval
 * @text Show Data?
 * @parent Data
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display state data on top of window icons and sprites?
 * @default true
 *
 * @param DataFontSize:num
 * @text Data Font Size
 * @parent Data
 * @type number
 * @min 1
 * @desc Font size used for displaying state data.
 * @default 12
 *
 * @param DataOffsetX:num
 * @text Offset X
 * @parent Data
 * @desc Offset the X position of the state data display.
 * @default 0
 *
 * @param DataOffsetY:num
 * @text Offset Y
 * @parent Data
 * @desc Offset the Y position of the state data display.
 * @default 8
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param onAddStateJS:func
 * @text JS: On Add State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state is added.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseStateJS:func
 * @text JS: On Erase State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state is erased.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireStateJS:func
 * @text JS: On Expire State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state has expired.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * General Buff/Debuff Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Buffs:
 *
 * @param General
 *
 * @param ReapplyRules:str
 * @text Reapply Rules
 * @parent General
 * @type select
 * @option Ignore: Buff/Debuff doesn't get added.
 * @value ignore
 * @option Reset: Turns get reset.
 * @value reset
 * @option Greater: Turns take greater value (current vs reset).
 * @value greater
 * @option Add: Turns add upon existing turns.
 * @value add
 * @desc These are the rules when reapplying buffs/debuffs.
 * @default greater
 *
 * @param MaxTurns:num
 * @text Maximum Turns
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of turns to let buffs and debuffs go up to.
 * @default 9999
 *
 * @param Stacking
 *
 * @param StackBuffMax:num
 * @text Max Stacks: Buff
 * @parent Stacking
 * @type number
 * @min 1
 * @desc Maximum number of stacks for buffs.
 * @default 2
 *
 * @param StackDebuffMax:num
 * @text Max Stacks: Debuff
 * @parent Stacking
 * @type number
 * @min 1
 * @desc Maximum number of stacks for debuffs.
 * @default 2
 *
 * @param MultiplierJS:func
 * @text JS: Buff/Debuff Rate
 * @parent Stacking
 * @type note
 * @desc Code to determine how much buffs and debuffs affect parameters.
 * @default "// Declare Variables\nconst user = this;\nconst paramId = arguments[0];\nconst buffLevel = arguments[1];\nlet rate = 1;\n\n// Perform Calculations\nrate += buffLevel * 0.25;\n\n// Return Rate\nreturn Math.max(0, rate);"
 *
 * @param Turns
 * @text Turns Display
 *
 * @param ShowTurns:eval
 * @text Show Turns?
 * @parent Turns
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display buff and debuff turns on top of window icons and sprites?
 * @default true
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @type number
 * @min 1
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param TurnOffsetX:num
 * @text Offset X
 * @parent Turns
 * @desc Offset the X position of the turn display.
 * @default -4
 *
 * @param TurnOffsetY:num
 * @text Offset Y
 * @parent Turns
 * @desc Offset the Y position of the turn display.
 * @default -6
 *
 * @param ColorBuff:str
 * @text Turn Color: Buffs
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorDebuff:str
 * @text Turn Color: Debuffs
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param Data
 * @text Rate Display
 *
 * @param ShowData:eval
 * @text Show Rate?
 * @parent Data
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display buff and debuff rate on top of window icons and sprites?
 * @default false
 *
 * @param DataFontSize:num
 * @text Rate Font Size
 * @parent Data
 * @type number
 * @min 1
 * @desc Font size used for displaying rate.
 * @default 12
 *
 * @param DataOffsetX:num
 * @text Offset X
 * @parent Data
 * @desc Offset the X position of the rate display.
 * @default 0
 *
 * @param DataOffsetY:num
 * @text Offset Y
 * @parent Data
 * @desc Offset the Y position of the rate display.
 * @default 8
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param onAddBuffJS:func
 * @text JS: On Add Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff is added.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onAddDebuffJS:func
 * @text JS: On Add Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff is added.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseBuffJS:func
 * @text JS: On Erase Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff is erased.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseDebuffJS:func
 * @text JS: On Erase Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff is erased.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireBuffJS:func
 * @text JS: On Expire Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff has expired.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireDebuffJS:func
 * @text JS: On Expire Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff has expired.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Passive State Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~PassiveStates:
 *
 * @param List
 *
 * @param Global:arraynum
 * @text Global Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect actors and enemies.
 * @default []
 *
 * @param Actor:arraynum
 * @text Actor-Only Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect actors only.
 * @default []
 *
 * @param Enemy:arraynum
 * @text Enemy Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect enemies only.
 * @default []
 *
 * @param Cache
 *
 * @param RefreshCacheSwitch:eval
 * @text Switch Refresh?
 * @parent Cache
 * @type boolean
 * @on Refresh
 * @off No Changes
 * @desc Refresh all battle members when switches are changed in battle?
 * @default false
 *
 * @param RefreshCacheVar:eval
 * @text Variable Refresh?
 * @parent Cache
 * @type boolean
 * @on Refresh
 * @off No Changes
 * @desc Refresh all battle members when variables are changed in battle?
 * @default false
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param PassiveConditionJS:func
 * @text JS: Condition Check
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide passive condition check.
 * @default "// Declare Variables\nconst state = arguments[0];\nconst stateId = state.id;\nconst user = this;\nconst target = this;\nconst a = this;\nconst b = this;\nlet condition = true;\n\n// Perform Checks\n\n\n// Return boolean\nreturn condition;"
 *
 */
//=============================================================================

function _0x3e38(_0x4bd7cf,_0x21d29c){const _0x5b591b=_0x5b59();return _0x3e38=function(_0x3e38dc,_0x70c7db){_0x3e38dc=_0x3e38dc-0x1d5;let _0x224910=_0x5b591b[_0x3e38dc];return _0x224910;},_0x3e38(_0x4bd7cf,_0x21d29c);}const _0x42a407=_0x3e38;(function(_0x46ee01,_0x39e19e){const _0x4b2546=_0x3e38,_0x252711=_0x46ee01();while(!![]){try{const _0x13ff34=-parseInt(_0x4b2546(0x2ee))/0x1*(parseInt(_0x4b2546(0x4c2))/0x2)+-parseInt(_0x4b2546(0x438))/0x3*(-parseInt(_0x4b2546(0x46a))/0x4)+parseInt(_0x4b2546(0x416))/0x5*(-parseInt(_0x4b2546(0x219))/0x6)+parseInt(_0x4b2546(0x27d))/0x7+parseInt(_0x4b2546(0x431))/0x8+parseInt(_0x4b2546(0x491))/0x9*(-parseInt(_0x4b2546(0x379))/0xa)+parseInt(_0x4b2546(0x221))/0xb*(parseInt(_0x4b2546(0x46b))/0xc);if(_0x13ff34===_0x39e19e)break;else _0x252711['push'](_0x252711['shift']());}catch(_0x59c9bd){_0x252711['push'](_0x252711['shift']());}}}(_0x5b59,0xd1827));var label=_0x42a407(0x354),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x42a407(0x474)](function(_0x4b21fb){const _0xc5ae78=_0x42a407;return _0x4b21fb['status']&&_0x4b21fb[_0xc5ae78(0x4cb)][_0xc5ae78(0x33a)]('['+label+']');})[0x0];VisuMZ[label][_0x42a407(0x4c4)]=VisuMZ[label]['Settings']||{},VisuMZ[_0x42a407(0x3d5)]=function(_0x409661,_0x3698fe){const _0x2ac6f2=_0x42a407;for(const _0x5d01fb in _0x3698fe){if(_0x5d01fb[_0x2ac6f2(0x2f9)](/(.*):(.*)/i)){const _0x4ba614=String(RegExp['$1']),_0x5093dd=String(RegExp['$2'])[_0x2ac6f2(0x308)]()[_0x2ac6f2(0x45d)]();let _0xad1487,_0x52d33d,_0x1d4ca7;switch(_0x5093dd){case'NUM':_0xad1487=_0x3698fe[_0x5d01fb]!==''?Number(_0x3698fe[_0x5d01fb]):0x0;break;case'ARRAYNUM':_0x52d33d=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):[],_0xad1487=_0x52d33d[_0x2ac6f2(0x39d)](_0x7fb918=>Number(_0x7fb918));break;case _0x2ac6f2(0x28d):_0xad1487=_0x3698fe[_0x5d01fb]!==''?eval(_0x3698fe[_0x5d01fb]):null;break;case _0x2ac6f2(0x3ae):_0x52d33d=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):[],_0xad1487=_0x52d33d[_0x2ac6f2(0x39d)](_0x1727a8=>eval(_0x1727a8));break;case _0x2ac6f2(0x365):_0xad1487=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):'';break;case _0x2ac6f2(0x43a):_0x52d33d=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):[],_0xad1487=_0x52d33d[_0x2ac6f2(0x39d)](_0x2aacc9=>JSON[_0x2ac6f2(0x1de)](_0x2aacc9));break;case _0x2ac6f2(0x36b):_0xad1487=_0x3698fe[_0x5d01fb]!==''?new Function(JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb])):new Function(_0x2ac6f2(0x2a5));break;case _0x2ac6f2(0x225):_0x52d33d=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):[],_0xad1487=_0x52d33d[_0x2ac6f2(0x39d)](_0x200e6d=>new Function(JSON[_0x2ac6f2(0x1de)](_0x200e6d)));break;case _0x2ac6f2(0x4b1):_0xad1487=_0x3698fe[_0x5d01fb]!==''?String(_0x3698fe[_0x5d01fb]):'';break;case _0x2ac6f2(0x3ef):_0x52d33d=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):[],_0xad1487=_0x52d33d[_0x2ac6f2(0x39d)](_0x4184e7=>String(_0x4184e7));break;case _0x2ac6f2(0x436):_0x1d4ca7=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):{},_0x409661[_0x4ba614]={},VisuMZ[_0x2ac6f2(0x3d5)](_0x409661[_0x4ba614],_0x1d4ca7);continue;case _0x2ac6f2(0x456):_0x52d33d=_0x3698fe[_0x5d01fb]!==''?JSON[_0x2ac6f2(0x1de)](_0x3698fe[_0x5d01fb]):[],_0xad1487=_0x52d33d['map'](_0x468c07=>VisuMZ['ConvertParams']({},JSON[_0x2ac6f2(0x1de)](_0x468c07)));break;default:continue;}_0x409661[_0x4ba614]=_0xad1487;}}return _0x409661;},(_0x58bf2e=>{const _0x1ae0ec=_0x42a407,_0x25ecf1=_0x58bf2e['name'];for(const _0x4a91e6 of dependencies){if(!Imported[_0x4a91e6]){alert(_0x1ae0ec(0x3dd)[_0x1ae0ec(0x311)](_0x25ecf1,_0x4a91e6)),SceneManager[_0x1ae0ec(0x1f9)]();break;}}const _0x5a6a52=_0x58bf2e[_0x1ae0ec(0x4cb)];if(_0x5a6a52[_0x1ae0ec(0x2f9)](/\[Version[ ](.*?)\]/i)){const _0x208588=Number(RegExp['$1']);_0x208588!==VisuMZ[label][_0x1ae0ec(0x3ba)]&&(alert(_0x1ae0ec(0x2ca)[_0x1ae0ec(0x311)](_0x25ecf1,_0x208588)),SceneManager[_0x1ae0ec(0x1f9)]());}if(_0x5a6a52['match'](/\[Tier[ ](\d+)\]/i)){const _0x443bfc=Number(RegExp['$1']);_0x443bfc<tier?(alert(_0x1ae0ec(0x445)[_0x1ae0ec(0x311)](_0x25ecf1,_0x443bfc,tier)),SceneManager[_0x1ae0ec(0x1f9)]()):tier=Math[_0x1ae0ec(0x327)](_0x443bfc,tier);}VisuMZ[_0x1ae0ec(0x3d5)](VisuMZ[label][_0x1ae0ec(0x4c4)],_0x58bf2e[_0x1ae0ec(0x4b5)]);})(pluginData),PluginManager[_0x42a407(0x3c8)](pluginData[_0x42a407(0x425)],'SkillActorPaySkillCost',_0x3395f2=>{const _0x353aef=_0x42a407;VisuMZ['ConvertParams'](_0x3395f2,_0x3395f2);const _0x543cfb=_0x3395f2['ActorIDs']||[],_0x5af630=Number(_0x3395f2[_0x353aef(0x4c0)]),_0x2d8edb=$dataSkills[_0x5af630];if(!_0x2d8edb)return;for(const _0x1dc3af of _0x543cfb){const _0x1c7bef=$gameActors['actor'](_0x1dc3af);if(!_0x1c7bef)continue;_0x1c7bef['paySkillCost'](_0x2d8edb);}}),PluginManager[_0x42a407(0x3c8)](pluginData[_0x42a407(0x425)],'SkillEnemyPaySkillCost',_0x1c1f61=>{const _0xb765b7=_0x42a407;VisuMZ[_0xb765b7(0x3d5)](_0x1c1f61,_0x1c1f61);const _0x4c1975=_0x1c1f61['EnemyIndex']||[],_0x70c707=Number(_0x1c1f61['SkillID']),_0x1222bd=$dataSkills[_0x70c707];if(!_0x1222bd)return;for(const _0x27e91d of _0x4c1975){const _0x17329f=$gameTroop['members']()[_0x27e91d];if(!_0x17329f)continue;_0x17329f[_0xb765b7(0x238)](_0x1222bd);}}),PluginManager[_0x42a407(0x3c8)](pluginData['name'],_0x42a407(0x2fe),_0x3b2b50=>{const _0x34ad52=_0x42a407;VisuMZ[_0x34ad52(0x3d5)](_0x3b2b50,_0x3b2b50);const _0x47ebfe=_0x3b2b50['ActorIDs']||[],_0xfdbef9=Number(_0x3b2b50[_0x34ad52(0x4b7)]),_0x576c73=Number(_0x3b2b50[_0x34ad52(0x399)]),_0x2b5631=_0x3b2b50[_0x34ad52(0x472)];for(const _0x2ffb8a of _0x47ebfe){const _0x3a42f3=$gameActors[_0x34ad52(0x465)](_0x2ffb8a);if(!_0x3a42f3)continue;_0x2b5631&&!_0x3a42f3[_0x34ad52(0x3c6)](_0xfdbef9)?(_0x3a42f3[_0x34ad52(0x2a1)](_0xfdbef9),_0x3a42f3['setStateTurns'](_0xfdbef9,_0x576c73)):_0x3a42f3[_0x34ad52(0x4e5)](_0xfdbef9,_0x576c73);}}),PluginManager[_0x42a407(0x3c8)](pluginData[_0x42a407(0x425)],_0x42a407(0x4b0),_0x576238=>{const _0x1e4518=_0x42a407;VisuMZ[_0x1e4518(0x3d5)](_0x576238,_0x576238);const _0x233a00=_0x576238[_0x1e4518(0x383)]||[],_0x116901=Number(_0x576238[_0x1e4518(0x4b7)]),_0x269b01=Math[_0x1e4518(0x327)](Number(_0x576238[_0x1e4518(0x399)]),0x0),_0x33fc8f=_0x576238[_0x1e4518(0x472)];for(const _0x4f2bb4 of _0x233a00){const _0x3c0b9d=$gameActors[_0x1e4518(0x465)](_0x4f2bb4);if(!_0x3c0b9d)continue;_0x33fc8f&&!_0x3c0b9d[_0x1e4518(0x3c6)](_0x116901)&&_0x3c0b9d['addState'](_0x116901),_0x3c0b9d[_0x1e4518(0x4d1)](_0x116901,_0x269b01);}}),PluginManager[_0x42a407(0x3c8)](pluginData[_0x42a407(0x425)],_0x42a407(0x45e),_0x2d9c38=>{const _0x43f4bf=_0x42a407;if(!$gameParty[_0x43f4bf(0x310)]())return;VisuMZ[_0x43f4bf(0x3d5)](_0x2d9c38,_0x2d9c38);const _0x4114f9=_0x2d9c38[_0x43f4bf(0x4e6)]||[],_0x13671d=Number(_0x2d9c38[_0x43f4bf(0x4b7)]),_0x22d336=Number(_0x2d9c38[_0x43f4bf(0x399)]),_0x5774fc=_0x2d9c38['AutoAddState'];for(const _0x23bd1f of _0x4114f9){const _0x53a961=$gameTroop[_0x43f4bf(0x3cb)]()[_0x23bd1f];if(!_0x53a961)continue;_0x5774fc&&!_0x53a961[_0x43f4bf(0x3c6)](_0x13671d)?(_0x53a961[_0x43f4bf(0x2a1)](_0x13671d),_0x53a961[_0x43f4bf(0x4d1)](_0x13671d,_0x22d336)):_0x53a961[_0x43f4bf(0x4e5)](_0x13671d,_0x22d336);}}),PluginManager[_0x42a407(0x3c8)](pluginData['name'],_0x42a407(0x306),_0x1e2b73=>{const _0x1a3d2f=_0x42a407;if(!$gameParty[_0x1a3d2f(0x310)]())return;VisuMZ[_0x1a3d2f(0x3d5)](_0x1e2b73,_0x1e2b73);const _0x1fae9b=_0x1e2b73[_0x1a3d2f(0x4e6)]||[],_0x1e869a=Number(_0x1e2b73['StateID']),_0x183752=Math[_0x1a3d2f(0x327)](Number(_0x1e2b73['Turns']),0x0),_0x1919df=_0x1e2b73[_0x1a3d2f(0x472)];for(const _0x371f0d of _0x1fae9b){const _0x2cae5d=$gameTroop['members']()[_0x371f0d];if(!_0x2cae5d)continue;_0x1919df&&!_0x2cae5d[_0x1a3d2f(0x3c6)](_0x1e869a)&&_0x2cae5d['addState'](_0x1e869a),_0x2cae5d[_0x1a3d2f(0x4d1)](_0x1e869a,_0x183752);}}),VisuMZ[_0x42a407(0x354)][_0x42a407(0x434)]=Scene_Boot[_0x42a407(0x35e)][_0x42a407(0x2b7)],Scene_Boot['prototype'][_0x42a407(0x2b7)]=function(){const _0x300056=_0x42a407;VisuMZ[_0x300056(0x354)]['Scene_Boot_onDatabaseLoaded']['call'](this),this[_0x300056(0x213)](),VisuMZ[_0x300056(0x354)]['CheckIncompatibleStates']();},Scene_Boot[_0x42a407(0x35e)][_0x42a407(0x213)]=function(){const _0x3097ac=_0x42a407;this[_0x3097ac(0x25f)]();if(VisuMZ[_0x3097ac(0x3b1)])return;this[_0x3097ac(0x2d4)](),this[_0x3097ac(0x1d9)]();},Scene_Boot[_0x42a407(0x35e)][_0x42a407(0x2d4)]=function(){const _0x500441=_0x42a407;for(const _0x2e6154 of $dataSkills){if(!_0x2e6154)continue;VisuMZ[_0x500441(0x354)][_0x500441(0x40f)](_0x2e6154),VisuMZ[_0x500441(0x354)]['Parse_Notetags_Skill_Sorting'](_0x2e6154),VisuMZ[_0x500441(0x354)][_0x500441(0x2f7)](_0x2e6154);}},Scene_Boot[_0x42a407(0x35e)][_0x42a407(0x1d9)]=function(){const _0x2b4a36=_0x42a407;for(const _0x1753fa of $dataStates){if(!_0x1753fa)continue;VisuMZ[_0x2b4a36(0x354)][_0x2b4a36(0x378)](_0x1753fa),VisuMZ['SkillsStatesCore'][_0x2b4a36(0x3c4)](_0x1753fa),VisuMZ['SkillsStatesCore']['Parse_Notetags_State_SlipEffectJS'](_0x1753fa),VisuMZ[_0x2b4a36(0x354)][_0x2b4a36(0x45f)](_0x1753fa);}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x429)]=VisuMZ['ParseSkillNotetags'],VisuMZ[_0x42a407(0x429)]=function(_0x8ac8e9){const _0x13d46e=_0x42a407;VisuMZ[_0x13d46e(0x354)]['ParseSkillNotetags']['call'](this,_0x8ac8e9),VisuMZ[_0x13d46e(0x354)][_0x13d46e(0x40f)](_0x8ac8e9),VisuMZ['SkillsStatesCore']['Parse_Notetags_Skill_Sorting'](_0x8ac8e9),VisuMZ['SkillsStatesCore']['Parse_Notetags_Skill_JS'](_0x8ac8e9);},VisuMZ['SkillsStatesCore']['ParseStateNotetags']=VisuMZ[_0x42a407(0x45b)],VisuMZ[_0x42a407(0x45b)]=function(_0x13031e){const _0x19e9fc=_0x42a407;VisuMZ[_0x19e9fc(0x354)]['ParseStateNotetags'][_0x19e9fc(0x215)](this,_0x13031e),VisuMZ[_0x19e9fc(0x354)]['Parse_Notetags_State_Category'](_0x13031e),VisuMZ[_0x19e9fc(0x354)][_0x19e9fc(0x3c4)](_0x13031e),VisuMZ[_0x19e9fc(0x354)][_0x19e9fc(0x2f5)](_0x13031e),VisuMZ[_0x19e9fc(0x354)][_0x19e9fc(0x45f)](_0x13031e);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x40f)]=function(_0x516c80){const _0x1f6a81=_0x42a407,_0x3eee29=_0x516c80[_0x1f6a81(0x382)];_0x3eee29[_0x1f6a81(0x2f9)](/<MP COST:[ ](\d+)>/i)&&(_0x516c80[_0x1f6a81(0x39c)]=Number(RegExp['$1'])),_0x3eee29[_0x1f6a81(0x2f9)](/<TP COST:[ ](\d+)>/i)&&(_0x516c80[_0x1f6a81(0x277)]=Number(RegExp['$1']));},VisuMZ[_0x42a407(0x354)][_0x42a407(0x208)]=function(_0xf6f7bb){const _0x2cab5e=_0x42a407;if(!_0xf6f7bb)return;_0xf6f7bb[_0x2cab5e(0x469)]=0x32;const _0x1aedc4=_0xf6f7bb['note']||'';_0x1aedc4['match'](/<(?:|ID )SORT(?:|ING)[ ]PRIORITY:[ ](\d+)>/i)&&(_0xf6f7bb[_0x2cab5e(0x469)]=Number(RegExp['$1']));},VisuMZ['SkillsStatesCore']['skillEnableJS']={},VisuMZ[_0x42a407(0x354)]['skillVisibleJS']={},VisuMZ['SkillsStatesCore']['Parse_Notetags_Skill_JS']=function(_0x32a2e9){const _0x21958a=_0x42a407,_0x9ddaf9=_0x32a2e9[_0x21958a(0x382)];if(_0x9ddaf9[_0x21958a(0x2f9)](/<JS SKILL ENABLE>\s*([\s\S]*)\s*<\/JS SKILL ENABLE>/i)){const _0x4b26d9=String(RegExp['$1']),_0x36e438=_0x21958a(0x44e)[_0x21958a(0x311)](_0x4b26d9);VisuMZ[_0x21958a(0x354)][_0x21958a(0x205)][_0x32a2e9['id']]=new Function(_0x21958a(0x355),_0x36e438);}if(_0x9ddaf9[_0x21958a(0x2f9)](/<JS SKILL VISIBLE>\s*([\s\S]*)\s*<\/JS SKILL VISIBLE>/i)){const _0x29ab7f=String(RegExp['$1']),_0x293a25=_0x21958a(0x3eb)[_0x21958a(0x311)](_0x29ab7f);VisuMZ[_0x21958a(0x354)][_0x21958a(0x408)][_0x32a2e9['id']]=new Function('skill',_0x293a25);}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x378)]=function(_0xf41ca4){const _0x43f162=_0x42a407;_0xf41ca4[_0x43f162(0x4ef)]=[_0x43f162(0x29e),_0x43f162(0x43d)];const _0x19beaf=_0xf41ca4[_0x43f162(0x382)],_0x2b97c3=_0x19beaf[_0x43f162(0x2f9)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);if(_0x2b97c3)for(const _0x1fe5be of _0x2b97c3){_0x1fe5be[_0x43f162(0x2f9)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);const _0x19b252=String(RegExp['$1'])['toUpperCase']()[_0x43f162(0x45d)]()[_0x43f162(0x3bf)](',');for(const _0x418b20 of _0x19b252){_0xf41ca4[_0x43f162(0x4ef)]['push'](_0x418b20['trim']());}}if(_0x19beaf[_0x43f162(0x2f9)](/<(?:CATEGORY|CATEGORIES)>\s*([\s\S]*)\s*<\/(?:CATEGORY|CATEGORIES)>/i)){const _0x50a713=RegExp['$1'][_0x43f162(0x3bf)](/[\r\n]+/);for(const _0x4d8282 of _0x50a713){_0xf41ca4[_0x43f162(0x4ef)]['push'](_0x4d8282[_0x43f162(0x308)]()[_0x43f162(0x45d)]());}}_0x19beaf[_0x43f162(0x2f9)](/<POSITIVE STATE>/i)&&_0xf41ca4[_0x43f162(0x4ef)]['push'](_0x43f162(0x391)),_0x19beaf[_0x43f162(0x2f9)](/<NEGATIVE STATE>/i)&&_0xf41ca4[_0x43f162(0x4ef)][_0x43f162(0x1e7)](_0x43f162(0x467));},VisuMZ[_0x42a407(0x354)][_0x42a407(0x314)]={},VisuMZ['SkillsStatesCore']['Parse_Notetags_State_PassiveJS']=function(_0x1278b5){const _0x1f9fc9=_0x42a407,_0x37cd52=_0x1278b5[_0x1f9fc9(0x382)];if(_0x37cd52[_0x1f9fc9(0x2f9)](/<JS PASSIVE CONDITION>\s*([\s\S]*)\s*<\/JS PASSIVE CONDITION>/i)){const _0x43be0a=String(RegExp['$1']),_0xca93d2='\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20condition\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20condition;\x0a\x20\x20\x20\x20\x20\x20\x20\x20'['format'](_0x43be0a);VisuMZ[_0x1f9fc9(0x354)]['statePassiveConditionJS'][_0x1278b5['id']]=new Function(_0x1f9fc9(0x449),_0xca93d2);}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x206)]={},VisuMZ[_0x42a407(0x354)][_0x42a407(0x4f0)]={},VisuMZ[_0x42a407(0x354)][_0x42a407(0x48f)]={},VisuMZ['SkillsStatesCore'][_0x42a407(0x3e3)]={},VisuMZ[_0x42a407(0x354)][_0x42a407(0x33e)]={},VisuMZ[_0x42a407(0x354)][_0x42a407(0x455)]={},VisuMZ[_0x42a407(0x354)]['Parse_Notetags_State_SlipEffectJS']=function(_0x6a3d44){const _0x4d7052=_0x42a407,_0x26616d=_0x6a3d44['note'],_0x3d9602=_0x4d7052(0x4fe);if(_0x26616d[_0x4d7052(0x2f9)](/<JS HP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS HP SLIP DAMAGE>/i)){const _0x3055aa=String(RegExp['$1']),_0x42d428=_0x3d9602[_0x4d7052(0x311)](_0x3055aa,_0x4d7052(0x32b),-0x1,_0x4d7052(0x283));VisuMZ[_0x4d7052(0x354)][_0x4d7052(0x206)][_0x6a3d44['id']]=new Function(_0x4d7052(0x4b9),_0x42d428);}else{if(_0x26616d[_0x4d7052(0x2f9)](/<JS HP SLIP HEAL>\s*([\s\S]*)\s*<\/JS HP SLIP HEAL>/i)){const _0x406969=String(RegExp['$1']),_0x18f1de=_0x3d9602[_0x4d7052(0x311)](_0x406969,'heal',0x1,_0x4d7052(0x283));VisuMZ[_0x4d7052(0x354)][_0x4d7052(0x4f0)][_0x6a3d44['id']]=new Function('stateId',_0x18f1de);}}if(_0x26616d[_0x4d7052(0x2f9)](/<JS MP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS MP SLIP DAMAGE>/i)){const _0x1e2d04=String(RegExp['$1']),_0x2e717c=_0x3d9602[_0x4d7052(0x311)](_0x1e2d04,_0x4d7052(0x32b),-0x1,_0x4d7052(0x2b3));VisuMZ[_0x4d7052(0x354)]['stateMpSlipDamageJS'][_0x6a3d44['id']]=new Function('stateId',_0x2e717c);}else{if(_0x26616d[_0x4d7052(0x2f9)](/<JS MP SLIP HEAL>\s*([\s\S]*)\s*<\/JS MP SLIP HEAL>/i)){const _0x3bbec2=String(RegExp['$1']),_0x48d687=_0x3d9602[_0x4d7052(0x311)](_0x3bbec2,'heal',0x1,_0x4d7052(0x2b3));VisuMZ[_0x4d7052(0x354)][_0x4d7052(0x3e3)][_0x6a3d44['id']]=new Function('stateId',_0x48d687);}}if(_0x26616d[_0x4d7052(0x2f9)](/<JS TP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS TP SLIP DAMAGE>/i)){const _0x57c89b=String(RegExp['$1']),_0x42b182=_0x3d9602[_0x4d7052(0x311)](_0x57c89b,'damage',-0x1,'slipTp');VisuMZ['SkillsStatesCore'][_0x4d7052(0x33e)][_0x6a3d44['id']]=new Function(_0x4d7052(0x4b9),_0x42b182);}else{if(_0x26616d['match'](/<JS TP SLIP HEAL>\s*([\s\S]*)\s*<\/JS TP SLIP HEAL>/i)){const _0x4aa9b6=String(RegExp['$1']),_0x220d97=_0x3d9602[_0x4d7052(0x311)](_0x4aa9b6,_0x4d7052(0x2de),0x1,_0x4d7052(0x395));VisuMZ['SkillsStatesCore']['stateTpSlipHealJS'][_0x6a3d44['id']]=new Function(_0x4d7052(0x4b9),_0x220d97);}}},VisuMZ['SkillsStatesCore'][_0x42a407(0x34d)]={},VisuMZ[_0x42a407(0x354)][_0x42a407(0x433)]={},VisuMZ[_0x42a407(0x354)]['stateExpireJS']={},VisuMZ[_0x42a407(0x354)][_0x42a407(0x45f)]=function(_0x2039fe){const _0x5523aa=_0x42a407,_0x41d81d=_0x2039fe[_0x5523aa(0x382)],_0x3cb6d7=_0x5523aa(0x403);if(_0x41d81d['match'](/<JS ON ADD STATE>\s*([\s\S]*)\s*<\/JS ON ADD STATE>/i)){const _0x1cd252=String(RegExp['$1']),_0x54bcef=_0x3cb6d7[_0x5523aa(0x311)](_0x1cd252);VisuMZ[_0x5523aa(0x354)][_0x5523aa(0x34d)][_0x2039fe['id']]=new Function(_0x5523aa(0x4b9),_0x54bcef);}if(_0x41d81d[_0x5523aa(0x2f9)](/<JS ON ERASE STATE>\s*([\s\S]*)\s*<\/JS ON ERASE STATE>/i)){const _0x14ac56=String(RegExp['$1']),_0x5a87b4=_0x3cb6d7[_0x5523aa(0x311)](_0x14ac56);VisuMZ['SkillsStatesCore'][_0x5523aa(0x433)][_0x2039fe['id']]=new Function('stateId',_0x5a87b4);}if(_0x41d81d['match'](/<JS ON EXPIRE STATE>\s*([\s\S]*)\s*<\/JS ON EXPIRE STATE>/i)){const _0x57ddf6=String(RegExp['$1']),_0x40e1ad=_0x3cb6d7['format'](_0x57ddf6);VisuMZ[_0x5523aa(0x354)][_0x5523aa(0x428)][_0x2039fe['id']]=new Function(_0x5523aa(0x4b9),_0x40e1ad);}},VisuMZ[_0x42a407(0x354)]['CheckIncompatibleStates']=function(){const _0x183d56=_0x42a407;if(!VisuMZ[_0x183d56(0x354)][_0x183d56(0x4c4)][_0x183d56(0x42b)]['ActionEndUpdate'])return;for(const _0xb420cc of $dataStates){if(!_0xb420cc)continue;_0xb420cc[_0x183d56(0x24a)]===0x4&&_0xb420cc[_0x183d56(0x20a)]===0x1&&(_0xb420cc[_0x183d56(0x20a)]=0x2);}},VisuMZ[_0x42a407(0x354)]['createKeyJS']=function(_0x518b45,_0x574055){const _0x42f150=_0x42a407;if(VisuMZ[_0x42f150(0x358)])return VisuMZ['createKeyJS'](_0x518b45,_0x574055);let _0x3ad00c='';if($dataActors[_0x42f150(0x33a)](_0x518b45))_0x3ad00c='Actor-%1-%2'[_0x42f150(0x311)](_0x518b45['id'],_0x574055);if($dataClasses[_0x42f150(0x33a)](_0x518b45))_0x3ad00c=_0x42f150(0x330)[_0x42f150(0x311)](_0x518b45['id'],_0x574055);if($dataSkills[_0x42f150(0x33a)](_0x518b45))_0x3ad00c=_0x42f150(0x271)[_0x42f150(0x311)](_0x518b45['id'],_0x574055);if($dataItems[_0x42f150(0x33a)](_0x518b45))_0x3ad00c=_0x42f150(0x201)[_0x42f150(0x311)](_0x518b45['id'],_0x574055);if($dataWeapons['includes'](_0x518b45))_0x3ad00c=_0x42f150(0x1e2)[_0x42f150(0x311)](_0x518b45['id'],_0x574055);if($dataArmors[_0x42f150(0x33a)](_0x518b45))_0x3ad00c=_0x42f150(0x447)[_0x42f150(0x311)](_0x518b45['id'],_0x574055);if($dataEnemies[_0x42f150(0x33a)](_0x518b45))_0x3ad00c=_0x42f150(0x2a0)[_0x42f150(0x311)](_0x518b45['id'],_0x574055);if($dataStates[_0x42f150(0x33a)](_0x518b45))_0x3ad00c='State-%1-%2'['format'](_0x518b45['id'],_0x574055);return _0x3ad00c;},DataManager['getClassIdWithName']=function(_0x44ca44){const _0x50dc9d=_0x42a407;_0x44ca44=_0x44ca44[_0x50dc9d(0x308)]()['trim'](),this['_classIDs']=this[_0x50dc9d(0x30a)]||{};if(this[_0x50dc9d(0x30a)][_0x44ca44])return this['_classIDs'][_0x44ca44];for(const _0x1e032a of $dataClasses){if(!_0x1e032a)continue;let _0x281cf4=_0x1e032a[_0x50dc9d(0x425)];_0x281cf4=_0x281cf4[_0x50dc9d(0x300)](/\x1I\[(\d+)\]/gi,''),_0x281cf4=_0x281cf4[_0x50dc9d(0x300)](/\\I\[(\d+)\]/gi,''),this[_0x50dc9d(0x30a)][_0x281cf4[_0x50dc9d(0x308)]()[_0x50dc9d(0x45d)]()]=_0x1e032a['id'];}return this[_0x50dc9d(0x30a)][_0x44ca44]||0x0;},DataManager[_0x42a407(0x23e)]=function(_0x1e0edd){const _0x1d99ee=_0x42a407;this[_0x1d99ee(0x48d)]=this[_0x1d99ee(0x48d)]||{};if(this[_0x1d99ee(0x48d)][_0x1e0edd['id']])return this[_0x1d99ee(0x48d)][_0x1e0edd['id']];this[_0x1d99ee(0x48d)][_0x1e0edd['id']]=[_0x1e0edd[_0x1d99ee(0x421)]];if(_0x1e0edd[_0x1d99ee(0x382)]['match'](/<SKILL[ ](?:TYPE|TYPES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1ee858=JSON[_0x1d99ee(0x1de)]('['+RegExp['$1']['match'](/\d+/g)+']');this[_0x1d99ee(0x48d)][_0x1e0edd['id']]=this['_stypeIDs'][_0x1e0edd['id']]['concat'](_0x1ee858);}else{if(_0x1e0edd[_0x1d99ee(0x382)]['match'](/<SKILL[ ](?:TYPE|TYPES):[ ](.*)>/i)){const _0x509077=RegExp['$1'][_0x1d99ee(0x3bf)](',');for(const _0x2b3982 of _0x509077){const _0x20003a=DataManager[_0x1d99ee(0x2f3)](_0x2b3982);if(_0x20003a)this[_0x1d99ee(0x48d)][_0x1e0edd['id']][_0x1d99ee(0x1e7)](_0x20003a);}}}return this['_stypeIDs'][_0x1e0edd['id']];},DataManager[_0x42a407(0x2f3)]=function(_0xa95dae){const _0x377c82=_0x42a407;_0xa95dae=_0xa95dae[_0x377c82(0x308)]()[_0x377c82(0x45d)](),this['_stypeIDs']=this['_stypeIDs']||{};if(this['_stypeIDs'][_0xa95dae])return this[_0x377c82(0x48d)][_0xa95dae];for(let _0x2bb7de=0x1;_0x2bb7de<0x64;_0x2bb7de++){if(!$dataSystem[_0x377c82(0x38f)][_0x2bb7de])continue;let _0x2ad597=$dataSystem[_0x377c82(0x38f)][_0x2bb7de][_0x377c82(0x308)]()[_0x377c82(0x45d)]();_0x2ad597=_0x2ad597[_0x377c82(0x300)](/\x1I\[(\d+)\]/gi,''),_0x2ad597=_0x2ad597[_0x377c82(0x300)](/\\I\[(\d+)\]/gi,''),this[_0x377c82(0x48d)][_0x2ad597]=_0x2bb7de;}return this[_0x377c82(0x48d)][_0xa95dae]||0x0;},DataManager['getSkillIdWithName']=function(_0xf51592){const _0x1817a6=_0x42a407;_0xf51592=_0xf51592[_0x1817a6(0x308)]()[_0x1817a6(0x45d)](),this[_0x1817a6(0x371)]=this[_0x1817a6(0x371)]||{};if(this[_0x1817a6(0x371)][_0xf51592])return this[_0x1817a6(0x371)][_0xf51592];for(const _0x3f1d16 of $dataSkills){if(!_0x3f1d16)continue;this['_skillIDs'][_0x3f1d16[_0x1817a6(0x425)][_0x1817a6(0x308)]()[_0x1817a6(0x45d)]()]=_0x3f1d16['id'];}return this[_0x1817a6(0x371)][_0xf51592]||0x0;},DataManager[_0x42a407(0x3ff)]=function(_0x1a7a7e){const _0x4d6454=_0x42a407;_0x1a7a7e=_0x1a7a7e[_0x4d6454(0x308)]()[_0x4d6454(0x45d)](),this[_0x4d6454(0x2bc)]=this[_0x4d6454(0x2bc)]||{};if(this[_0x4d6454(0x2bc)][_0x1a7a7e])return this[_0x4d6454(0x2bc)][_0x1a7a7e];for(const _0x26f367 of $dataStates){if(!_0x26f367)continue;this[_0x4d6454(0x2bc)][_0x26f367[_0x4d6454(0x425)][_0x4d6454(0x308)]()['trim']()]=_0x26f367['id'];}return this[_0x4d6454(0x2bc)][_0x1a7a7e]||0x0;},DataManager['stateMaximumTurns']=function(_0x21dcb9){const _0xdd5a32=_0x42a407;this[_0xdd5a32(0x3a5)]=this['_stateMaxTurns']||{};if(this[_0xdd5a32(0x3a5)][_0x21dcb9])return this[_0xdd5a32(0x3a5)][_0x21dcb9];return $dataStates[_0x21dcb9][_0xdd5a32(0x382)][_0xdd5a32(0x2f9)](/<MAX TURNS:[ ](\d+)>/i)?this['_stateMaxTurns'][_0x21dcb9]=Number(RegExp['$1']):this[_0xdd5a32(0x3a5)][_0x21dcb9]=VisuMZ[_0xdd5a32(0x354)][_0xdd5a32(0x4c4)]['States']['MaxTurns'],this[_0xdd5a32(0x3a5)][_0x21dcb9];},DataManager[_0x42a407(0x2f0)]=function(_0x28fb06){const _0x310989=_0x42a407;if(!_0x28fb06)return{};this[_0x310989(0x44a)]=this[_0x310989(0x44a)]||{};if(this[_0x310989(0x44a)][_0x28fb06['id']]!==undefined)return this['_skillChangesFromState'][_0x28fb06['id']];const _0x4e1762=_0x28fb06['note']||'',_0x5ca3bf={};{const _0x4e25a9=_0x4e1762[_0x310989(0x2f9)](/<SKILL CHANGE(?:|S):[ ](.*)[ ]>>>[ ](.*)>/gi);if(_0x4e25a9)for(const _0x4f6f96 of _0x4e25a9){_0x4f6f96[_0x310989(0x2f9)](/<SKILL CHANGE(?:|S):[ ](.*)[ ]>>>[ ](.*)>/gi);let _0xd1e423=String(RegExp['$1']),_0x3d9cd9=String(RegExp['$2']);VisuMZ[_0x310989(0x354)][_0x310989(0x27a)](_0x5ca3bf,_0xd1e423,_0x3d9cd9);}}if(_0x4e1762[_0x310989(0x2f9)](/<SKILL CHANGE(?:|S)>\s*([\s\S]*)\s*<\/SKILL CHANGE(?:|S)>/i)){const _0x265291=String(RegExp['$1'])[_0x310989(0x3bf)](/[\r\n]+/)['remove']('');for(const _0x5685dc of _0x265291){if(_0x5685dc[_0x310989(0x2f9)](/(.*)[ ]>>>[ ](.*)/i)){let _0x303d4d=String(RegExp['$1']),_0x12b7c4=String(RegExp['$2']);VisuMZ[_0x310989(0x354)][_0x310989(0x27a)](_0x5ca3bf,_0x303d4d,_0x12b7c4);}}}return this[_0x310989(0x44a)][_0x28fb06['id']]=_0x5ca3bf,this['_skillChangesFromState'][_0x28fb06['id']];},VisuMZ['SkillsStatesCore']['ParseSkillChangessIntoData']=function(_0x9b6533,_0x204697,_0x2f3063){const _0x46df5e=_0x42a407;/^\d+$/[_0x46df5e(0x1eb)](_0x204697)?_0x204697=Number(_0x204697):_0x204697=DataManager['getSkillIdWithName'](_0x204697),/^\d+$/[_0x46df5e(0x1eb)](_0x2f3063)?_0x2f3063=Number(_0x2f3063):_0x2f3063=DataManager[_0x46df5e(0x502)](_0x2f3063),_0x9b6533[_0x204697]=_0x2f3063;},DataManager[_0x42a407(0x442)]=function(_0x4be887){const _0x5291c6=_0x42a407;if(!DataManager[_0x5291c6(0x3ea)](_0x4be887))return![];this[_0x5291c6(0x4df)]=this['_cache_isToggleSkill']||{};if(this['_cache_isToggleSkill'][_0x4be887['id']]!==undefined)return this[_0x5291c6(0x4df)][_0x4be887['id']];this[_0x5291c6(0x4df)][_0x4be887['id']]=![];const _0x353996=_0x4be887['note']||'';if(_0x353996[_0x5291c6(0x2f9)](/<TOGGLE>/i))this['_cache_isToggleSkill'][_0x4be887['id']]=!![];else{if(_0x353996[_0x5291c6(0x2f9)](/<INITIAL TOGGLE: ON>/i))this['_cache_isToggleSkill'][_0x4be887['id']]=!![];else{if(_0x353996[_0x5291c6(0x2f9)](/<INITIAL TOGGLE: OFF>/i))this[_0x5291c6(0x4df)][_0x4be887['id']]=!![];else _0x353996['match'](/<TOGGLE EXCLU(?:DE|SION) GROUP(?:|S):[ ](.*)>/i)&&(this['_cache_isToggleSkill'][_0x4be887['id']]=!![]);}}return this[_0x5291c6(0x345)](_0x353996)&&(this[_0x5291c6(0x4df)][_0x4be887['id']]=![]),this['_cache_isToggleSkill'][_0x4be887['id']];},DataManager[_0x42a407(0x345)]=function(_0x17b2e3){const _0x1cb312=_0x42a407;if(Imported[_0x1cb312(0x3bd)]){const _0x21177f=VisuMZ[_0x1cb312(0x2d9)][_0x1cb312(0x230)];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x21177f[_0x1cb312(0x2f8)]))return!![];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x21177f[_0x1cb312(0x3ce)]))return!![];if(_0x17b2e3['match'](_0x21177f[_0x1cb312(0x451)]))return!![];}if(Imported[_0x1cb312(0x42c)]){const _0xf0866f=VisuMZ[_0x1cb312(0x49b)][_0x1cb312(0x230)];if(_0x17b2e3[_0x1cb312(0x2f9)](_0xf0866f[_0x1cb312(0x320)]))return!![];if(_0x17b2e3[_0x1cb312(0x2f9)](_0xf0866f[_0x1cb312(0x37e)]))return!![];if(_0x17b2e3[_0x1cb312(0x2f9)](_0xf0866f[_0x1cb312(0x298)]))return!![];}if(Imported['VisuMZ_3_InputComboSkills']){const _0x2d49c2=VisuMZ[_0x1cb312(0x4ad)][_0x1cb312(0x230)];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x2d49c2['InputKey']))return!![];}if(Imported[_0x1cb312(0x28b)]){const _0x438f88=VisuMZ[_0x1cb312(0x28a)][_0x1cb312(0x230)];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x438f88[_0x1cb312(0x37d)]))return!![];}if(Imported[_0x1cb312(0x301)]){const _0x4a9943=VisuMZ['ItemAmplifySkills']['RegExp'];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x4a9943[_0x1cb312(0x200)]))return!![];}if(Imported['VisuMZ_3_ItemConcoctSkills']){const _0x486047=VisuMZ[_0x1cb312(0x49d)][_0x1cb312(0x230)];if(_0x17b2e3['match'](_0x486047['CanConcoct']))return!![];}if(Imported[_0x1cb312(0x1e6)]){const _0x249d75=VisuMZ[_0x1cb312(0x3ee)][_0x1cb312(0x230)];if(_0x17b2e3['match'](_0x249d75[_0x1cb312(0x21b)]))return!![];}if(Imported[_0x1cb312(0x47c)]){const _0x46ce53=VisuMZ['SkillContainers']['RegExp'];if(_0x17b2e3['match'](_0x46ce53[_0x1cb312(0x41e)]))return!![];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x46ce53[_0x1cb312(0x224)]))return!![];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x46ce53[_0x1cb312(0x4be)]))return!![];if(_0x17b2e3[_0x1cb312(0x2f9)](_0x46ce53['ForceListRange']))return!![];}return![];},DataManager[_0x42a407(0x4b4)]=function(_0x52e680){const _0x286e14=_0x42a407,_0x59ed48=_0x52e680?_0x52e680[_0x286e14(0x382)]||'':'';if(_0x59ed48[_0x286e14(0x2f9)](/<INITIAL TOGGLE: ON>/i))return!![];else{if(_0x59ed48[_0x286e14(0x2f9)](/<INITIAL TOGGLE: OFF>/i))return![];}return VisuMZ[_0x286e14(0x354)]['Settings'][_0x286e14(0x303)]['DefaultToggle'];},DataManager[_0x42a407(0x2c1)]=function(_0x1ec6f1){const _0x2753ab=_0x42a407;if(!this[_0x2753ab(0x3ea)](_0x1ec6f1))return[];this[_0x2753ab(0x400)]=this['_cache_toggleExclusionGroups']||{};if(this[_0x2753ab(0x400)][_0x1ec6f1['id']]!==undefined)return this['_cache_toggleExclusionGroups'][_0x1ec6f1['id']];let _0x2736f3=[];const _0x3aa8ea=_0x1ec6f1[_0x2753ab(0x382)]||'';return _0x3aa8ea['match'](/<TOGGLE EXCLU(?:DE|SION) GROUP(?:|S):[ ](.*)>/i)&&(_0x2736f3=String(RegExp['$1'])[_0x2753ab(0x3bf)](',')['map'](_0x4fd767=>_0x4fd767[_0x2753ab(0x308)]()['trim']())),this[_0x2753ab(0x400)][_0x1ec6f1['id']]=_0x2736f3,this[_0x2753ab(0x400)][_0x1ec6f1['id']];},TextManager['toggleType']=VisuMZ[_0x42a407(0x354)][_0x42a407(0x4c4)]['Toggles'][_0x42a407(0x4ce)]??_0x42a407(0x4da),TextManager[_0x42a407(0x22e)]=VisuMZ[_0x42a407(0x354)][_0x42a407(0x4c4)][_0x42a407(0x303)]['ToggleOn']??_0x42a407(0x2d8),TextManager['toggleOff']=VisuMZ['SkillsStatesCore'][_0x42a407(0x4c4)][_0x42a407(0x303)][_0x42a407(0x370)]??_0x42a407(0x464),TextManager[_0x42a407(0x389)]=VisuMZ['SkillsStatesCore'][_0x42a407(0x4c4)][_0x42a407(0x303)]['ToggleOffLocation']??'back',ColorManager[_0x42a407(0x20b)]=function(_0x2451ef,_0x33eae9){const _0xe6eabb=_0x42a407;return _0x33eae9=String(_0x33eae9),this['_colorCache']=this[_0xe6eabb(0x477)]||{},_0x33eae9[_0xe6eabb(0x2f9)](/#(.*)/i)?this['_colorCache'][_0x2451ef]=_0xe6eabb(0x48b)[_0xe6eabb(0x311)](String(RegExp['$1'])):this[_0xe6eabb(0x477)][_0x2451ef]=this[_0xe6eabb(0x415)](Number(_0x33eae9)),this[_0xe6eabb(0x477)][_0x2451ef];},ColorManager[_0x42a407(0x3e6)]=function(_0x4cae71){const _0x25573a=_0x42a407;return _0x4cae71=String(_0x4cae71),_0x4cae71['match'](/#(.*)/i)?'#%1'[_0x25573a(0x311)](String(RegExp['$1'])):this[_0x25573a(0x415)](Number(_0x4cae71));},ColorManager[_0x42a407(0x348)]=function(_0x252d21){const _0x5ccb39=_0x42a407;if(typeof _0x252d21===_0x5ccb39(0x47a))_0x252d21=$dataStates[_0x252d21];const _0x1b51a3=_0x5ccb39(0x4dd)[_0x5ccb39(0x311)](_0x252d21['id']);this[_0x5ccb39(0x477)]=this[_0x5ccb39(0x477)]||{};if(this[_0x5ccb39(0x477)][_0x1b51a3])return this[_0x5ccb39(0x477)][_0x1b51a3];const _0x12d7ae=this[_0x5ccb39(0x495)](_0x252d21);return this['getColorDataFromPluginParameters'](_0x1b51a3,_0x12d7ae);},ColorManager['retrieveStateColor']=function(_0x17d0ac){const _0x453d2e=_0x42a407,_0x545c40=_0x17d0ac['note'];if(_0x545c40['match'](/<TURN COLOR:[ ](.*)>/i))return String(RegExp['$1']);else{if(_0x545c40[_0x453d2e(0x2f9)](/<POSITIVE STATE>/i))return VisuMZ['SkillsStatesCore'][_0x453d2e(0x4c4)]['States'][_0x453d2e(0x458)];else return _0x545c40['match'](/<NEGATIVE STATE>/i)?VisuMZ['SkillsStatesCore'][_0x453d2e(0x4c4)]['States']['ColorNegative']:VisuMZ['SkillsStatesCore'][_0x453d2e(0x4c4)][_0x453d2e(0x42b)][_0x453d2e(0x349)];}},ColorManager['buffColor']=function(){const _0xa181b1=_0x42a407,_0x27619a=_0xa181b1(0x3f5);this[_0xa181b1(0x477)]=this[_0xa181b1(0x477)]||{};if(this[_0xa181b1(0x477)][_0x27619a])return this[_0xa181b1(0x477)][_0x27619a];const _0x35f972=VisuMZ['SkillsStatesCore'][_0xa181b1(0x4c4)][_0xa181b1(0x48e)][_0xa181b1(0x43f)];return this['getColorDataFromPluginParameters'](_0x27619a,_0x35f972);},ColorManager[_0x42a407(0x2db)]=function(){const _0x253343=_0x42a407,_0x44bdb9=_0x253343(0x1f2);this[_0x253343(0x477)]=this[_0x253343(0x477)]||{};if(this[_0x253343(0x477)][_0x44bdb9])return this['_colorCache'][_0x44bdb9];const _0x12cae2=VisuMZ[_0x253343(0x354)]['Settings'][_0x253343(0x48e)][_0x253343(0x267)];return this[_0x253343(0x20b)](_0x44bdb9,_0x12cae2);},SceneManager[_0x42a407(0x377)]=function(){const _0x20406b=_0x42a407;return this['_scene']&&this[_0x20406b(0x2c6)][_0x20406b(0x28e)]===Scene_Battle;},VisuMZ[_0x42a407(0x354)]['BattleManager_endAction']=BattleManager[_0x42a407(0x3e9)],BattleManager[_0x42a407(0x3e9)]=function(){const _0x46a036=_0x42a407;this[_0x46a036(0x2c3)](),VisuMZ[_0x46a036(0x354)][_0x46a036(0x1df)][_0x46a036(0x215)](this);},BattleManager[_0x42a407(0x2c3)]=function(){const _0x2e57e5=_0x42a407,_0x303dd5=VisuMZ['SkillsStatesCore'][_0x2e57e5(0x4c4)][_0x2e57e5(0x42b)];if(!_0x303dd5)return;if(_0x303dd5[_0x2e57e5(0x2a8)]===![])return;if(!this[_0x2e57e5(0x280)])return;this[_0x2e57e5(0x280)][_0x2e57e5(0x2c3)]();},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2c3)]=function(){const _0x2c69a1=_0x42a407;if(BattleManager[_0x2c69a1(0x4f8)]!==_0x2c69a1(0x427))return;if(this['_lastStatesActionEndFrameCount']===Graphics['frameCount'])return;this[_0x2c69a1(0x236)]=Graphics[_0x2c69a1(0x21a)];for(const _0x217fbb of this[_0x2c69a1(0x2fb)]){const _0x40ef43=$dataStates[_0x217fbb];if(!_0x40ef43)continue;if(_0x40ef43[_0x2c69a1(0x20a)]!==0x1)continue;this[_0x2c69a1(0x2f1)][_0x217fbb]>0x0&&this[_0x2c69a1(0x2f1)][_0x217fbb]--;}this[_0x2c69a1(0x4ec)](0x1);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3e1)]=function(){const _0x86317b=_0x42a407,_0x1d9ef4=VisuMZ['SkillsStatesCore']['Settings'][_0x86317b(0x42b)];for(const _0x615e99 of this[_0x86317b(0x2fb)]){const _0x244aa3=$dataStates[_0x615e99];if(_0x1d9ef4&&_0x1d9ef4['ActionEndUpdate']!==![]){if(_0x244aa3&&_0x244aa3[_0x86317b(0x20a)]===0x1)continue;}this['_stateTurns'][_0x615e99]>0x0&&this[_0x86317b(0x2f1)][_0x615e99]--;}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x29c)]=Game_Switches[_0x42a407(0x35e)][_0x42a407(0x4a6)],Game_Switches[_0x42a407(0x35e)][_0x42a407(0x4a6)]=function(){const _0x42c0e0=_0x42a407;VisuMZ['SkillsStatesCore'][_0x42c0e0(0x29c)][_0x42c0e0(0x215)](this);const _0x173299=VisuMZ[_0x42c0e0(0x354)][_0x42c0e0(0x4c4)][_0x42c0e0(0x426)]['RefreshCacheSwitch']??!![];if(!_0x173299)return;if(SceneManager[_0x42c0e0(0x377)]())for(const _0x2b867e of BattleManager[_0x42c0e0(0x4f6)]()){if(_0x2b867e)_0x2b867e['refresh']();}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x259)]=Game_Variables[_0x42a407(0x35e)]['onChange'],Game_Variables['prototype'][_0x42a407(0x4a6)]=function(){const _0x557a0d=_0x42a407;VisuMZ['SkillsStatesCore']['Game_Variables_onChange'][_0x557a0d(0x215)](this);const _0x1bc4df=VisuMZ[_0x557a0d(0x354)][_0x557a0d(0x4c4)][_0x557a0d(0x426)][_0x557a0d(0x2be)]??!![];if(!_0x1bc4df)return;if(SceneManager[_0x557a0d(0x377)]())for(const _0x4eb61b of BattleManager[_0x557a0d(0x4f6)]()){if(_0x4eb61b)_0x4eb61b[_0x557a0d(0x503)]();}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x463)]=Game_Action[_0x42a407(0x35e)][_0x42a407(0x2f2)],Game_Action[_0x42a407(0x35e)][_0x42a407(0x2f2)]=function(_0xa221fa){const _0x41bfb9=_0x42a407;VisuMZ[_0x41bfb9(0x354)]['Game_Action_applyItemUserEffect']['call'](this,_0xa221fa),this['applySkillsStatesCoreEffects'](_0xa221fa);},Game_Action[_0x42a407(0x35e)][_0x42a407(0x25d)]=function(_0x2dec59){const _0x36ae4c=_0x42a407;this[_0x36ae4c(0x1fb)](_0x2dec59),this[_0x36ae4c(0x437)](_0x2dec59),this[_0x36ae4c(0x278)](_0x2dec59),this[_0x36ae4c(0x344)](_0x2dec59);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x34c)]=Game_Action[_0x42a407(0x35e)][_0x42a407(0x37b)],Game_Action[_0x42a407(0x35e)]['testApply']=function(_0x525cf0){const _0x53d59b=_0x42a407;if(this[_0x53d59b(0x390)](_0x525cf0))return!![];return VisuMZ[_0x53d59b(0x354)][_0x53d59b(0x34c)]['call'](this,_0x525cf0);},Game_Action[_0x42a407(0x35e)]['testSkillStatesCoreNotetags']=function(_0x33c28b){const _0x15d2bf=_0x42a407;if(!this['item']())return;const _0x1363b1=this[_0x15d2bf(0x2eb)]()[_0x15d2bf(0x382)];if(_0x1363b1[_0x15d2bf(0x2f9)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](.*)>/i)){const _0x39168a=String(RegExp['$1']);if(_0x33c28b[_0x15d2bf(0x2fa)](_0x39168a))return!![];}if(_0x1363b1[_0x15d2bf(0x2f9)](/<SET STATE[ ](\d+)[ ]TURNS:[ ](.*)>/i)){const _0x185ad1=Number(RegExp['$1']);if(_0x33c28b[_0x15d2bf(0x3c6)](_0x185ad1))return!![];}else{if(_0x1363b1[_0x15d2bf(0x2f9)](/<SET STATE[ ](.*)[ ]TURNS:[ ](.*)>/i)){const _0x5668e2=DataManager['getStateIdWithName'](RegExp['$1']);if(_0x33c28b[_0x15d2bf(0x3c6)](_0x5668e2))return!![];}}return![];},Game_Action[_0x42a407(0x35e)][_0x42a407(0x1fb)]=function(_0x13baa5){const _0x23748e=_0x42a407;if(_0x13baa5[_0x23748e(0x374)]()['length']<=0x0)return;const _0x154f39=this[_0x23748e(0x2eb)]()[_0x23748e(0x382)];{const _0x665502=_0x154f39[_0x23748e(0x2f9)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ]ALL>/gi);if(_0x665502)for(const _0x1e3722 of _0x665502){_0x1e3722['match'](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ]ALL>/i);const _0x3d7b78=String(RegExp['$1']);_0x13baa5[_0x23748e(0x2af)](_0x3d7b78);}}{const _0x1a833e=_0x154f39['match'](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](\d+)>/gi);if(_0x1a833e)for(const _0x572283 of _0x1a833e){_0x572283[_0x23748e(0x2f9)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](\d+)>/i);const _0x266dc0=String(RegExp['$1']),_0x4e9374=Number(RegExp['$2']);_0x13baa5[_0x23748e(0x452)](_0x266dc0,_0x4e9374);}}},Game_Action[_0x42a407(0x35e)]['applyStateTurnManipulationEffects']=function(_0xc862b4){const _0x59bfbd=_0x42a407,_0x4ec32d=this[_0x59bfbd(0x2eb)]()[_0x59bfbd(0x382)],_0x19fa87=_0x4ec32d[_0x59bfbd(0x2f9)](/<SET STATE[ ](.*)[ ]TURNS:[ ](\d+)>/gi);if(_0x19fa87)for(const _0x45b60a of _0x19fa87){let _0x865cb1=0x0,_0x160240=0x0;if(_0x45b60a['match'](/<SET STATE[ ](\d+)[ ]TURNS:[ ](\d+)>/i))_0x865cb1=Number(RegExp['$1']),_0x160240=Number(RegExp['$2']);else _0x45b60a[_0x59bfbd(0x2f9)](/<SET STATE[ ](.*)[ ]TURNS:[ ](\d+)>/i)&&(_0x865cb1=DataManager[_0x59bfbd(0x3ff)](RegExp['$1']),_0x160240=Number(RegExp['$2']));_0xc862b4[_0x59bfbd(0x4d1)](_0x865cb1,_0x160240),this[_0x59bfbd(0x1f5)](_0xc862b4);}const _0x295396=_0x4ec32d[_0x59bfbd(0x2f9)](/<STATE[ ](.*)[ ]TURNS:[ ]([\+\-]\d+)>/gi);if(_0x295396)for(const _0x248639 of _0x295396){let _0x3b7446=0x0,_0x26516d=0x0;if(_0x248639['match'](/<STATE[ ](\d+)[ ]TURNS:[ ]([\+\-]\d+)>/i))_0x3b7446=Number(RegExp['$1']),_0x26516d=Number(RegExp['$2']);else _0x248639[_0x59bfbd(0x2f9)](/<STATE[ ](.*)[ ]TURNS:[ ]([\+\-]\d+)>/i)&&(_0x3b7446=DataManager['getStateIdWithName'](RegExp['$1']),_0x26516d=Number(RegExp['$2']));_0xc862b4[_0x59bfbd(0x4e5)](_0x3b7446,_0x26516d),this['makeSuccess'](_0xc862b4);}},Game_Action[_0x42a407(0x35e)][_0x42a407(0x278)]=function(_0x1a9a5b){const _0x17e7e6=_0x42a407,_0x2d9614=[_0x17e7e6(0x38d),_0x17e7e6(0x405),_0x17e7e6(0x25e),'DEF',_0x17e7e6(0x435),_0x17e7e6(0x2aa),_0x17e7e6(0x24e),_0x17e7e6(0x31d)],_0x315782=this['item']()[_0x17e7e6(0x382)],_0xef5cbe=_0x315782[_0x17e7e6(0x2f9)](/<SET[ ](.*)[ ]BUFF TURNS:[ ](\d+)>/gi);if(_0xef5cbe)for(const _0x5f09ec of _0xef5cbe){_0x5f09ec['match'](/<SET[ ](.*)[ ]BUFF TURNS:[ ](\d+)>/i);const _0x184319=_0x2d9614['indexOf'](String(RegExp['$1'])[_0x17e7e6(0x308)]()),_0x627718=Number(RegExp['$2']);_0x184319>=0x0&&(_0x1a9a5b[_0x17e7e6(0x254)](_0x184319,_0x627718),this['makeSuccess'](_0x1a9a5b));}const _0x459013=_0x315782[_0x17e7e6(0x2f9)](/<(.*)[ ]BUFF TURNS:[ ]([\+\-]\d+)>/gi);if(_0x459013)for(const _0x1363f0 of _0xef5cbe){_0x1363f0[_0x17e7e6(0x2f9)](/<(.*)[ ]BUFF TURNS:[ ]([\+\-]\d+)>/i);const _0x996d3d=_0x2d9614['indexOf'](String(RegExp['$1'])['toUpperCase']()),_0x1822b4=Number(RegExp['$2']);_0x996d3d>=0x0&&(_0x1a9a5b[_0x17e7e6(0x3f8)](_0x996d3d,_0x1822b4),this['makeSuccess'](_0x1a9a5b));}},Game_Action['prototype'][_0x42a407(0x344)]=function(_0x5c15dd){const _0x514a81=_0x42a407,_0x3f21b4=['MAXHP',_0x514a81(0x405),_0x514a81(0x25e),_0x514a81(0x27f),'MAT',_0x514a81(0x2aa),_0x514a81(0x24e),_0x514a81(0x31d)],_0xebb48b=this[_0x514a81(0x2eb)]()[_0x514a81(0x382)],_0x566bb2=_0xebb48b['match'](/<SET[ ](.*)[ ]DEBUFF TURNS:[ ](\d+)>/gi);if(_0x566bb2)for(const _0x14f8b2 of _0x566bb2){_0x14f8b2[_0x514a81(0x2f9)](/<SET[ ](.*)[ ]DEBUFF TURNS:[ ](\d+)>/i);const _0x265646=_0x3f21b4[_0x514a81(0x3c0)](String(RegExp['$1'])[_0x514a81(0x308)]()),_0x3a9e22=Number(RegExp['$2']);_0x265646>=0x0&&(_0x5c15dd[_0x514a81(0x4f9)](_0x265646,_0x3a9e22),this[_0x514a81(0x1f5)](_0x5c15dd));}const _0x87d557=_0xebb48b[_0x514a81(0x2f9)](/<(.*)[ ]DEBUFF TURNS:[ ]([\+\-]\d+)>/gi);if(_0x87d557)for(const _0x1a8d15 of _0x566bb2){_0x1a8d15[_0x514a81(0x2f9)](/<(.*)[ ]DEBUFF TURNS:[ ]([\+\-]\d+)>/i);const _0x1d3d8=_0x3f21b4[_0x514a81(0x3c0)](String(RegExp['$1'])[_0x514a81(0x308)]()),_0x5daad4=Number(RegExp['$2']);_0x1d3d8>=0x0&&(_0x5c15dd['addDebuffTurns'](_0x1d3d8,_0x5daad4),this[_0x514a81(0x1f5)](_0x5c15dd));}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x4c3)]=Game_BattlerBase[_0x42a407(0x35e)]['initMembers'],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3c5)]=function(){const _0x2e9ab5=_0x42a407;this['_cache']={},this[_0x2e9ab5(0x485)](),VisuMZ[_0x2e9ab5(0x354)]['Game_BattlerBase_initMembers'][_0x2e9ab5(0x215)](this);},Game_BattlerBase[_0x42a407(0x35e)]['initMembersSkillsStatesCore']=function(){const _0x56045b=_0x42a407;this[_0x56045b(0x1ea)]='',this[_0x56045b(0x307)]={},this[_0x56045b(0x44d)]={},this['_stateOrigin']={},this[_0x56045b(0x31a)]={};},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x453)]=function(_0x3757c1){const _0x186485=_0x42a407;return this[_0x186485(0x3ad)]=this[_0x186485(0x3ad)]||{},this[_0x186485(0x3ad)][_0x3757c1]!==undefined;},VisuMZ[_0x42a407(0x354)][_0x42a407(0x4d2)]=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x503)],Game_BattlerBase[_0x42a407(0x35e)]['refresh']=function(){const _0x42a4ea=_0x42a407;this[_0x42a4ea(0x3ad)]={},VisuMZ[_0x42a4ea(0x354)][_0x42a4ea(0x4d2)][_0x42a4ea(0x215)](this);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x352)]=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x240)],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x240)]=function(_0x34c9f5){const _0x5310bd=_0x42a407;let _0x461024=this[_0x5310bd(0x3c6)](_0x34c9f5);VisuMZ[_0x5310bd(0x354)][_0x5310bd(0x352)]['call'](this,_0x34c9f5);if(_0x461024&&!this[_0x5310bd(0x3c6)](_0x34c9f5))this[_0x5310bd(0x2ab)](_0x34c9f5);},Game_BattlerBase[_0x42a407(0x35e)]['onRemoveState']=function(_0x45f2e4){const _0x41a4b3=_0x42a407;this[_0x41a4b3(0x3cd)](_0x45f2e4),this[_0x41a4b3(0x481)](_0x45f2e4);},VisuMZ['SkillsStatesCore'][_0x42a407(0x4af)]=Game_Battler[_0x42a407(0x35e)][_0x42a407(0x396)],Game_Battler[_0x42a407(0x35e)]['onBattleEnd']=function(){const _0x2af03c=_0x42a407;VisuMZ['SkillsStatesCore'][_0x2af03c(0x4af)]['call'](this),this['clearAllStateOrigins'](),this[_0x2af03c(0x411)]=0x0,this['_prevPassiveJsCounter']=0x0;},VisuMZ['SkillsStatesCore']['Game_BattlerBase_resetStateCounts']=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x4b3)],Game_BattlerBase['prototype'][_0x42a407(0x4b3)]=function(_0x58308c){const _0x17ba19=_0x42a407,_0x1788a3=$dataStates[_0x58308c],_0x5b3ace=this[_0x17ba19(0x228)](_0x58308c),_0x1b685=this[_0x17ba19(0x444)](_0x1788a3)['toLowerCase']()[_0x17ba19(0x45d)]();switch(_0x1b685){case'ignore':if(_0x5b3ace<=0x0)this[_0x17ba19(0x288)](_0x58308c);break;case _0x17ba19(0x245):this[_0x17ba19(0x288)](_0x58308c);break;case _0x17ba19(0x242):this[_0x17ba19(0x288)](_0x58308c),this[_0x17ba19(0x2f1)][_0x58308c]=Math['max'](this[_0x17ba19(0x2f1)][_0x58308c],_0x5b3ace);break;case _0x17ba19(0x496):this['prepareResetStateCounts'](_0x58308c),this[_0x17ba19(0x2f1)][_0x58308c]+=_0x5b3ace;break;default:this[_0x17ba19(0x288)](_0x58308c);break;}if(this[_0x17ba19(0x3c6)](_0x58308c)){const _0x3491ac=DataManager['stateMaximumTurns'](_0x58308c);this['_stateTurns'][_0x58308c]=this[_0x17ba19(0x2f1)][_0x58308c][_0x17ba19(0x492)](0x0,_0x3491ac);}},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x288)]=function(_0x290213){const _0x429fda=_0x42a407;VisuMZ['SkillsStatesCore'][_0x429fda(0x4a9)][_0x429fda(0x215)](this,_0x290213);},Game_BattlerBase[_0x42a407(0x35e)]['getStateReapplyRulings']=function(_0x4a6207){const _0xe88d02=_0x42a407,_0x8e3a6e=_0x4a6207[_0xe88d02(0x382)];return _0x8e3a6e[_0xe88d02(0x2f9)](/<REAPPLY RULES:[ ](.*)>/i)?String(RegExp['$1']):VisuMZ[_0xe88d02(0x354)][_0xe88d02(0x4c4)][_0xe88d02(0x42b)]['ReapplyRules'];},VisuMZ[_0x42a407(0x354)]['Game_BattlerBase_overwriteBuffTurns']=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x2b0)],Game_BattlerBase[_0x42a407(0x35e)]['overwriteBuffTurns']=function(_0x1fe2b4,_0x2fd429){const _0x54d6ca=_0x42a407,_0x3607e1=VisuMZ[_0x54d6ca(0x354)][_0x54d6ca(0x4c4)][_0x54d6ca(0x48e)][_0x54d6ca(0x27b)],_0x78f4e4=this[_0x54d6ca(0x2ce)](_0x1fe2b4);switch(_0x3607e1){case _0x54d6ca(0x293):if(_0x78f4e4<=0x0)this[_0x54d6ca(0x27e)][_0x1fe2b4]=_0x2fd429;break;case _0x54d6ca(0x245):this[_0x54d6ca(0x27e)][_0x1fe2b4]=_0x2fd429;break;case _0x54d6ca(0x242):this['_buffTurns'][_0x1fe2b4]=Math[_0x54d6ca(0x327)](_0x78f4e4,_0x2fd429);break;case'add':this[_0x54d6ca(0x27e)][_0x1fe2b4]+=_0x2fd429;break;default:VisuMZ[_0x54d6ca(0x354)][_0x54d6ca(0x3f1)][_0x54d6ca(0x215)](this,_0x1fe2b4,_0x2fd429);break;}const _0x96925=VisuMZ[_0x54d6ca(0x354)][_0x54d6ca(0x4c4)]['Buffs'][_0x54d6ca(0x44f)];this['_buffTurns'][_0x1fe2b4]=this[_0x54d6ca(0x27e)][_0x1fe2b4][_0x54d6ca(0x492)](0x0,_0x96925);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x388)]=function(){const _0x4c49b7=_0x42a407;if(this[_0x4c49b7(0x3ad)][_0x4c49b7(0x21d)]!==undefined)return this[_0x4c49b7(0x3ad)][_0x4c49b7(0x21d)];this['_cache'][_0x4c49b7(0x21d)]=![];const _0xafb884=this['states']();for(const _0x4f5457 of _0xafb884){if(!_0x4f5457)continue;if(_0x4f5457['note'][_0x4c49b7(0x2f9)](/<GROUP DEFEAT>/i)){this[_0x4c49b7(0x3ad)]['groupDefeat']=!![];break;}}return this['_cache'][_0x4c49b7(0x21d)];},VisuMZ[_0x42a407(0x354)][_0x42a407(0x3de)]=Game_Unit[_0x42a407(0x35e)]['deadMembers'],Game_Unit[_0x42a407(0x35e)][_0x42a407(0x369)]=function(){const _0x287841=_0x42a407;let _0x3e8b9c=VisuMZ['SkillsStatesCore'][_0x287841(0x3de)][_0x287841(0x215)](this);return BattleManager[_0x287841(0x317)]&&(_0x3e8b9c=_0x3e8b9c['concat'](this['members']()[_0x287841(0x474)](_0x532248=>_0x532248[_0x287841(0x388)]()))),_0x3e8b9c;},VisuMZ[_0x42a407(0x354)][_0x42a407(0x237)]=Game_BattlerBase[_0x42a407(0x35e)]['clearStates'],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x417)]=function(){const _0x917ced=_0x42a407;this['getStateRetainType']()!==''?this['clearStatesWithStateRetain']():(VisuMZ[_0x917ced(0x354)][_0x917ced(0x237)][_0x917ced(0x215)](this),this[_0x917ced(0x485)]());},Game_Actor[_0x42a407(0x35e)][_0x42a407(0x417)]=function(){const _0x1b34c5=_0x42a407;this['_stateSteps']=this[_0x1b34c5(0x40d)]||{},Game_Battler[_0x1b34c5(0x35e)]['clearStates'][_0x1b34c5(0x215)](this);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x226)]=function(){const _0x16ef79=_0x42a407,_0x58a4c5=this[_0x16ef79(0x374)]();for(const _0x564b46 of _0x58a4c5){if(_0x564b46&&this[_0x16ef79(0x397)](_0x564b46))this['eraseState'](_0x564b46['id']);}this[_0x16ef79(0x3ad)]={};},Game_BattlerBase[_0x42a407(0x35e)]['canClearState']=function(_0x9f068e){const _0x532f13=_0x42a407,_0x3ea6b3=this[_0x532f13(0x329)]();if(_0x3ea6b3!==''){const _0xf27a4a=_0x9f068e[_0x532f13(0x382)];if(_0x3ea6b3==='death'&&_0xf27a4a[_0x532f13(0x2f9)](/<NO DEATH CLEAR>/i))return![];if(_0x3ea6b3===_0x532f13(0x32c)&&_0xf27a4a[_0x532f13(0x2f9)](/<NO RECOVER ALL CLEAR>/i))return![];}return this[_0x532f13(0x3c6)](_0x9f068e['id']);},Game_BattlerBase[_0x42a407(0x35e)]['getStateRetainType']=function(){const _0x4793f6=_0x42a407;return this[_0x4793f6(0x1ea)];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x498)]=function(_0x3d7448){const _0x659839=_0x42a407;this[_0x659839(0x1ea)]=_0x3d7448;},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x272)]=function(){const _0x20d223=_0x42a407;this[_0x20d223(0x1ea)]='';},VisuMZ[_0x42a407(0x354)]['Game_BattlerBase_die']=Game_BattlerBase['prototype'][_0x42a407(0x2e9)],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x2e9)]=function(){const _0x241777=_0x42a407;this['setStateRetainType'](_0x241777(0x364)),VisuMZ[_0x241777(0x354)][_0x241777(0x20e)][_0x241777(0x215)](this),this[_0x241777(0x272)]();},VisuMZ[_0x42a407(0x354)][_0x42a407(0x2bb)]=Game_BattlerBase['prototype']['recoverAll'],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x439)]=function(){const _0x4d98ed=_0x42a407;this[_0x4d98ed(0x498)](_0x4d98ed(0x32c)),VisuMZ['SkillsStatesCore'][_0x4d98ed(0x2bb)][_0x4d98ed(0x215)](this),this[_0x4d98ed(0x272)]();},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x413)]=function(_0x2e988d,_0x3e6d4d,_0x24ebb4){return _0x3e6d4d;},Game_BattlerBase['prototype']['canPaySkillCost']=function(_0x384a44){const _0x5554dc=_0x42a407;for(settings of VisuMZ[_0x5554dc(0x354)]['Settings'][_0x5554dc(0x38e)]){let _0x5529a3=settings[_0x5554dc(0x432)][_0x5554dc(0x215)](this,_0x384a44);_0x5529a3=this['adjustSkillCost'](_0x384a44,_0x5529a3,settings);if(!settings['CanPayJS'][_0x5554dc(0x215)](this,_0x384a44,_0x5529a3))return![];}return!![];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x238)]=function(_0x585815){const _0x2ed237=_0x42a407;for(settings of VisuMZ[_0x2ed237(0x354)]['Settings']['Costs']){let _0x11604f=settings['CalcJS'][_0x2ed237(0x215)](this,_0x585815);_0x11604f=this['adjustSkillCost'](_0x585815,_0x11604f,settings),settings[_0x2ed237(0x1fe)]['call'](this,_0x585815,_0x11604f);}},VisuMZ['SkillsStatesCore'][_0x42a407(0x499)]=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x289)],Game_BattlerBase[_0x42a407(0x35e)]['meetsSkillConditions']=function(_0x321b12){const _0x33a7d0=_0x42a407;if(!_0x321b12)return![];if(!VisuMZ[_0x33a7d0(0x354)][_0x33a7d0(0x499)][_0x33a7d0(0x215)](this,_0x321b12))return![];if(!this[_0x33a7d0(0x26e)](_0x321b12))return![];if(!this['meetsSkillConditionsEnableJS'](_0x321b12))return![];if(!this[_0x33a7d0(0x39f)](_0x321b12))return![];return!![];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x26e)]=function(_0x468ef4){const _0x2b6f56=_0x42a407;if(!this[_0x2b6f56(0x1e5)](_0x468ef4))return![];return!![];},Game_BattlerBase['prototype'][_0x42a407(0x1e5)]=function(_0x3c083d){const _0x3fbcea=_0x42a407,_0x23124a=_0x3c083d[_0x3fbcea(0x382)];if(_0x23124a[_0x3fbcea(0x2f9)](/<ENABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x54a592=JSON[_0x3fbcea(0x1de)]('['+RegExp['$1'][_0x3fbcea(0x2f9)](/\d+/g)+']');for(const _0x7cebb6 of _0x54a592){if(!$gameSwitches['value'](_0x7cebb6))return![];}return!![];}if(_0x23124a[_0x3fbcea(0x2f9)](/<ENABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x4b630c=JSON[_0x3fbcea(0x1de)]('['+RegExp['$1'][_0x3fbcea(0x2f9)](/\d+/g)+']');for(const _0x4ddc5d of _0x4b630c){if(!$gameSwitches['value'](_0x4ddc5d))return![];}return!![];}if(_0x23124a[_0x3fbcea(0x2f9)](/<ENABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x24c022=JSON[_0x3fbcea(0x1de)]('['+RegExp['$1'][_0x3fbcea(0x2f9)](/\d+/g)+']');for(const _0x3abbe5 of _0x24c022){if($gameSwitches['value'](_0x3abbe5))return!![];}return![];}if(_0x23124a['match'](/<DISABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x490a85=JSON[_0x3fbcea(0x1de)]('['+RegExp['$1'][_0x3fbcea(0x2f9)](/\d+/g)+']');for(const _0x2cf30f of _0x490a85){if(!$gameSwitches[_0x3fbcea(0x353)](_0x2cf30f))return!![];}return![];}if(_0x23124a['match'](/<DISABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2eb636=JSON[_0x3fbcea(0x1de)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x5b1abf of _0x2eb636){if(!$gameSwitches[_0x3fbcea(0x353)](_0x5b1abf))return!![];}return![];}if(_0x23124a[_0x3fbcea(0x2f9)](/<DISABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x53bb9e=JSON[_0x3fbcea(0x1de)]('['+RegExp['$1'][_0x3fbcea(0x2f9)](/\d+/g)+']');for(const _0x4927e8 of _0x53bb9e){if($gameSwitches[_0x3fbcea(0x353)](_0x4927e8))return![];}return!![];}return!![];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x2dd)]=function(_0x496800){const _0xeed83f=_0x42a407,_0x16ef54=_0x496800['note'],_0x465598=VisuMZ[_0xeed83f(0x354)][_0xeed83f(0x205)];return _0x465598[_0x496800['id']]?_0x465598[_0x496800['id']][_0xeed83f(0x215)](this,_0x496800):!![];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x39f)]=function(_0x183283){const _0x3c2708=_0x42a407;return VisuMZ[_0x3c2708(0x354)][_0x3c2708(0x4c4)][_0x3c2708(0x3ca)][_0x3c2708(0x4a0)]['call'](this,_0x183283);},VisuMZ[_0x42a407(0x354)]['Game_BattlerBase_skillMpCost']=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3e4)],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3e4)]=function(_0xd6426e){const _0x38195b=_0x42a407;for(settings of VisuMZ[_0x38195b(0x354)]['Settings'][_0x38195b(0x38e)]){if(settings[_0x38195b(0x316)][_0x38195b(0x308)]()==='MP'){let _0x4d2b8c=settings['CalcJS'][_0x38195b(0x215)](this,_0xd6426e);return _0x4d2b8c=this[_0x38195b(0x413)](_0xd6426e,_0x4d2b8c,settings),_0x4d2b8c;}}return VisuMZ[_0x38195b(0x354)]['Game_BattlerBase_skillMpCost'][_0x38195b(0x215)](this,_0xd6426e);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x407)]=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x274)],Game_BattlerBase[_0x42a407(0x35e)]['skillTpCost']=function(_0xf3e352){const _0x1deb10=_0x42a407;for(settings of VisuMZ[_0x1deb10(0x354)][_0x1deb10(0x4c4)][_0x1deb10(0x38e)]){if(settings[_0x1deb10(0x316)][_0x1deb10(0x308)]()==='TP'){let _0x321d62=settings[_0x1deb10(0x432)][_0x1deb10(0x215)](this,_0xf3e352);return _0x321d62=this[_0x1deb10(0x413)](_0xf3e352,_0x321d62,settings),_0x321d62;}}return VisuMZ[_0x1deb10(0x354)][_0x1deb10(0x407)][_0x1deb10(0x215)](this,_0xf3e352);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x44c)]=function(_0x6e69dd){const _0x376806=_0x42a407;if(typeof _0x6e69dd===_0x376806(0x47a))_0x6e69dd=$dataStates[_0x6e69dd];return this[_0x376806(0x374)]()[_0x376806(0x33a)](_0x6e69dd);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x22f)]=Game_BattlerBase['prototype'][_0x42a407(0x374)],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x374)]=function(){const _0x13bd26=_0x42a407;let _0x2247ab=VisuMZ['SkillsStatesCore']['Game_BattlerBase_states'][_0x13bd26(0x215)](this);if($gameTemp[_0x13bd26(0x470)])return _0x2247ab;return $gameTemp[_0x13bd26(0x470)]=!![],this[_0x13bd26(0x3b2)](_0x2247ab),$gameTemp[_0x13bd26(0x470)]=undefined,_0x2247ab;},Game_BattlerBase[_0x42a407(0x35e)]['addPassiveStates']=function(_0x314089){const _0xe96147=_0x42a407,_0x245bae=this[_0xe96147(0x351)]();for(state of _0x245bae){if(!state)continue;if(!this[_0xe96147(0x479)](state)&&_0x314089['includes'](state))continue;_0x314089[_0xe96147(0x1e7)](state);}_0x245bae[_0xe96147(0x247)]>0x0&&_0x314089['sort']((_0x1435f9,_0x2387a7)=>{const _0x357522=_0xe96147,_0x379146=_0x1435f9[_0x357522(0x296)],_0x5ddf2a=_0x2387a7[_0x357522(0x296)];if(_0x379146!==_0x5ddf2a)return _0x5ddf2a-_0x379146;return _0x1435f9-_0x2387a7;});},Game_BattlerBase[_0x42a407(0x35e)]['isPassiveStateStackable']=function(_0x314d0b){const _0x346712=_0x42a407;return _0x314d0b[_0x346712(0x382)][_0x346712(0x2f9)](/<PASSIVE STACKABLE>/i);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x37f)]=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x231)],Game_BattlerBase[_0x42a407(0x35e)]['traitsSet']=function(_0x19c58f){const _0x5037ab=_0x42a407;this[_0x5037ab(0x2b2)]=!![];let _0xd577d4=VisuMZ[_0x5037ab(0x354)]['Game_BattlerBase_traitsSet'][_0x5037ab(0x215)](this,_0x19c58f);return this[_0x5037ab(0x2b2)]=undefined,_0xd577d4;},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x32f)]=function(){const _0x47b028=_0x42a407;let _0x20da69=[];this['_passiveStateResults']=this[_0x47b028(0x2c0)]||{};for(;;){_0x20da69=[];let _0x45b91b=!![];for(const _0x2b40c4 of this[_0x47b028(0x3ad)][_0x47b028(0x351)]){const _0x2b482e=$dataStates[_0x2b40c4];if(!_0x2b482e)continue;let _0x26dff2=this[_0x47b028(0x309)](_0x2b482e);this['_passiveStateResults'][_0x2b40c4]!==_0x26dff2&&(_0x45b91b=![],this[_0x47b028(0x2c0)][_0x2b40c4]=_0x26dff2);if(!_0x26dff2)continue;_0x20da69[_0x47b028(0x1e7)](_0x2b482e);}if(_0x45b91b)break;else{if(!this[_0x47b028(0x2b2)])this[_0x47b028(0x503)]();this['createPassiveStatesCache']();}}return _0x20da69;},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x309)]=function(_0x41c7e8){const _0x3a6ca0=_0x42a407;if(!this[_0x3a6ca0(0x20f)](_0x41c7e8))return![];if(!this[_0x3a6ca0(0x41a)](_0x41c7e8))return![];if(!this['meetsPassiveStateConditionJS'](_0x41c7e8))return![];if(!this[_0x3a6ca0(0x2e8)](_0x41c7e8))return![];return!![];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x20f)]=function(_0x4d3de1){return!![];},Game_Actor[_0x42a407(0x35e)][_0x42a407(0x20f)]=function(_0x28fd50){const _0x2b266a=_0x42a407,_0x291df5=DataManager[_0x2b266a(0x44b)](_0x28fd50);if(_0x291df5[_0x2b266a(0x290)][_0x2b266a(0x247)]>0x0){const _0x3d9272=_0x291df5[_0x2b266a(0x290)];if(!_0x3d9272['includes'](this['currentClass']()))return![];}if(_0x291df5[_0x2b266a(0x4de)][_0x2b266a(0x247)]>0x0){const _0x34e3e5=_0x291df5[_0x2b266a(0x4de)];let _0x457f0c=[this[_0x2b266a(0x290)]()];Imported[_0x2b266a(0x3da)]&&this[_0x2b266a(0x47e)]&&(_0x457f0c=this[_0x2b266a(0x47e)]());if(_0x34e3e5['filter'](_0x39168f=>_0x457f0c[_0x2b266a(0x33a)](_0x39168f))[_0x2b266a(0x247)]<=0x0)return![];}return Game_BattlerBase['prototype'][_0x2b266a(0x20f)]['call'](this,_0x28fd50);},DataManager[_0x42a407(0x44b)]=function(_0x1b65e1){const _0x45b3ec=_0x42a407,_0x4448df={'currentClass':[],'multiClass':[]};if(!_0x1b65e1)return _0x4448df;this[_0x45b3ec(0x2df)]=this[_0x45b3ec(0x2df)]||{};if(this[_0x45b3ec(0x2df)][_0x1b65e1['id']]!==undefined)return this[_0x45b3ec(0x2df)][_0x1b65e1['id']];const _0x353744=_0x1b65e1[_0x45b3ec(0x382)]||'';if(_0x353744[_0x45b3ec(0x2f9)](/<PASSIVE CONDITION[ ](?:CLASS|CLASSES):[ ](.*)>/i)){const _0x2ffcb2=String(RegExp['$1'])[_0x45b3ec(0x3bf)](',')['map'](_0x25740a=>_0x25740a[_0x45b3ec(0x45d)]());_0x4448df[_0x45b3ec(0x290)]=VisuMZ['SkillsStatesCore']['ParseClassIDs'](_0x2ffcb2);}if(_0x353744[_0x45b3ec(0x2f9)](/<PASSIVE CONDITION[ ](?:MULTICLASS|MULTICLASSES):[ ](.*)>/i)){const _0x12d619=String(RegExp['$1'])[_0x45b3ec(0x3bf)](',')['map'](_0x144cce=>_0x144cce[_0x45b3ec(0x45d)]());_0x4448df[_0x45b3ec(0x4de)]=VisuMZ['SkillsStatesCore'][_0x45b3ec(0x20c)](_0x12d619);}return this['_cache_getPassiveStateConditionClassesData'][_0x1b65e1['id']]=_0x4448df,this[_0x45b3ec(0x2df)][_0x1b65e1['id']];},VisuMZ['SkillsStatesCore'][_0x42a407(0x20c)]=function(_0x2489cd){const _0x1bed44=_0x42a407,_0x4c8cdc=[];for(let _0x2d3cf2 of _0x2489cd){_0x2d3cf2=(String(_0x2d3cf2)||'')[_0x1bed44(0x45d)]();const _0x4540c3=/^\d+$/['test'](_0x2d3cf2);_0x4540c3?_0x4c8cdc[_0x1bed44(0x1e7)](Number(_0x2d3cf2)):_0x4c8cdc[_0x1bed44(0x1e7)](DataManager[_0x1bed44(0x2b6)](_0x2d3cf2));}return _0x4c8cdc[_0x1bed44(0x39d)](_0x308a98=>$dataClasses[Number(_0x308a98)])[_0x1bed44(0x361)](null);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x41a)]=function(_0x5e5cd7){const _0x4f998b=_0x42a407,_0x314456=DataManager['getPassiveStateConditionSwitchData'](_0x5e5cd7);if(_0x314456[_0x4f998b(0x420)]&&_0x314456['allSwitchOn'][_0x4f998b(0x247)]>0x0){const _0x3cf61f=_0x314456[_0x4f998b(0x420)];for(const _0x173111 of _0x3cf61f){if(!$gameSwitches['value'](_0x173111))return![];}}if(_0x314456[_0x4f998b(0x31c)]&&_0x314456[_0x4f998b(0x31c)][_0x4f998b(0x247)]>0x0){const _0x3d6e58=_0x314456['anySwitchOn'];let _0x5e973a=!![];for(const _0xbd534b of _0x3d6e58){if($gameSwitches[_0x4f998b(0x353)](_0xbd534b)){_0x5e973a=![];break;}}if(_0x5e973a)return![];}if(_0x314456['allSwitchOff']&&_0x314456[_0x4f998b(0x305)][_0x4f998b(0x247)]>0x0){const _0x96d176=_0x314456[_0x4f998b(0x305)];for(const _0x25db69 of _0x96d176){if($gameSwitches[_0x4f998b(0x353)](_0x25db69))return![];}}if(_0x314456[_0x4f998b(0x47b)]&&_0x314456[_0x4f998b(0x47b)][_0x4f998b(0x247)]>0x0){const _0x19a1bf=_0x314456[_0x4f998b(0x47b)];let _0x173b1b=!![];for(const _0x3e412c of _0x19a1bf){if(!$gameSwitches[_0x4f998b(0x353)](_0x3e412c)){_0x173b1b=![];break;}}if(_0x173b1b)return![];}return!![];},DataManager[_0x42a407(0x2dc)]=function(_0x13a035){const _0x57fc49=_0x42a407;let _0x395f9d={'allSwitchOn':[],'anySwitchOn':[],'allSwitchOff':[],'anySwitchOff':[]};if(!_0x13a035)return _0x395f9d;const _0x41cfad=_0x13a035['id'];this[_0x57fc49(0x263)]=this[_0x57fc49(0x263)]||{};if(this[_0x57fc49(0x263)][_0x41cfad]!==undefined)return this[_0x57fc49(0x263)][_0x41cfad];const _0x1e0810=_0x13a035[_0x57fc49(0x382)]||'';return _0x1e0810[_0x57fc49(0x2f9)](/PASSIVE CONDITION(?:| ALL)[ ](?:SWITCH|SWITCHES)[ ]ON:[ ](.*)>/i)&&(_0x395f9d[_0x57fc49(0x420)]=String(RegExp['$1'])[_0x57fc49(0x3bf)](',')[_0x57fc49(0x39d)](_0x1be6a1=>Number(_0x1be6a1)),console['log'](_0x395f9d)),_0x1e0810[_0x57fc49(0x2f9)](/PASSIVE CONDITION ANY[ ](?:SWITCH|SWITCHES)[ ]ON:[ ](.*)>/i)&&(_0x395f9d[_0x57fc49(0x31c)]=String(RegExp['$1'])[_0x57fc49(0x3bf)](',')[_0x57fc49(0x39d)](_0x14e823=>Number(_0x14e823))),_0x1e0810['match'](/PASSIVE CONDITION(?:| ALL)[ ](?:SWITCH|SWITCHES)[ ]OFF:[ ](.*)>/i)&&(_0x395f9d[_0x57fc49(0x305)]=String(RegExp['$1'])['split'](',')['map'](_0x1f5af9=>Number(_0x1f5af9))),_0x1e0810['match'](/PASSIVE CONDITION ANY[ ](?:SWITCH|SWITCHES)[ ]OFF:[ ](.*)>/i)&&(_0x395f9d['anySwitchOff']=String(RegExp['$1'])[_0x57fc49(0x3bf)](',')[_0x57fc49(0x39d)](_0x1297ae=>Number(_0x1297ae))),this[_0x57fc49(0x263)][_0x41cfad]=_0x395f9d,this[_0x57fc49(0x263)][_0x41cfad];},Game_BattlerBase[_0x42a407(0x35e)]['meetsPassiveStateConditionJS']=function(_0x17ded8){const _0x249575=_0x42a407,_0x468536=VisuMZ[_0x249575(0x354)][_0x249575(0x314)];if(_0x468536[_0x17ded8['id']]){this[_0x249575(0x411)]=this['_prevPassiveJsFrameCount']||0x0,this['_prevPassiveJsCounter']=this['_prevPassiveJsCounter']||0x0;this[_0x249575(0x411)]!==Graphics[_0x249575(0x21a)]&&(this[_0x249575(0x411)]=Graphics['frameCount'],this['_prevPassiveJsResults']={},this[_0x249575(0x4ee)]=0x0);this[_0x249575(0x4ee)]++;if(this[_0x249575(0x4ee)]>=0x1e)return this[_0x249575(0x2e4)][_0x17ded8['id']]??!![];else{const _0x5722c0=_0x468536[_0x17ded8['id']][_0x249575(0x215)](this,_0x17ded8);return this[_0x249575(0x2e4)][_0x17ded8['id']]=_0x5722c0,_0x5722c0;}}else return!![];},Game_BattlerBase[_0x42a407(0x35e)]['meetsPassiveStateGlobalConditionJS']=function(_0x3311e7){const _0x518ca4=_0x42a407;return VisuMZ[_0x518ca4(0x354)]['Settings'][_0x518ca4(0x426)][_0x518ca4(0x25c)]['call'](this,_0x3311e7);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x351)]=function(){const _0x14b7e4=_0x42a407;if(this[_0x14b7e4(0x453)](_0x14b7e4(0x351)))return this[_0x14b7e4(0x32f)]();if(this['_checkingVisuMzPassiveStateObjects'])return[];return this[_0x14b7e4(0x295)]=!![],this[_0x14b7e4(0x36a)](),this[_0x14b7e4(0x295)]=undefined,this[_0x14b7e4(0x32f)]();},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x36a)]=function(){const _0x306607=_0x42a407;this['_checkingVisuMzPassiveStateObjects']=!![],this['_cache'][_0x306607(0x351)]=[],this[_0x306607(0x33d)](),this[_0x306607(0x3d4)](),this[_0x306607(0x273)](),Game_BattlerBase[_0x306607(0x4d6)]&&this[_0x306607(0x3c2)](),this['_cache'][_0x306607(0x351)]=this[_0x306607(0x3ad)][_0x306607(0x351)][_0x306607(0x4d8)]((_0x1ff393,_0x5a6351)=>_0x1ff393-_0x5a6351),this['_checkingVisuMzPassiveStateObjects']=undefined;},Game_BattlerBase['prototype']['addPassiveStatesFromOtherPlugins']=function(){const _0x1bbbf0=_0x42a407;if(Imported[_0x1bbbf0(0x262)])this['addPassiveStatesTraitSets']();},Game_BattlerBase['prototype']['passiveStateObjects']=function(){return[];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3d4)]=function(){const _0x137549=_0x42a407,_0x54d338=this['_cache'][_0x137549(0x351)]||[],_0x2d785f=this[_0x137549(0x33c)]();this['_cache'][_0x137549(0x351)]=_0x54d338||[];for(const _0x348b95 of _0x2d785f){if(!_0x348b95)continue;const _0x4395dd=DataManager[_0x137549(0x450)](_0x348b95);for(const _0x3b3085 of _0x4395dd){this[_0x137549(0x3ad)][_0x137549(0x351)]['push'](_0x3b3085);}}},DataManager[_0x42a407(0x450)]=function(_0x218572){const _0x13ad5d=_0x42a407;if(!_0x218572)return[];const _0x569466=VisuMZ['SkillsStatesCore'][_0x13ad5d(0x358)](_0x218572,'passiveStateIDs');this['_cache_getPassiveStatesFromObj']=this[_0x13ad5d(0x48a)]||{};if(this[_0x13ad5d(0x48a)][_0x569466]!==undefined)return this[_0x13ad5d(0x48a)][_0x569466];const _0x431d87=[],_0x561d28=_0x218572[_0x13ad5d(0x382)]||'',_0xb73e8d=/<PASSIVE (?:STATE|STATES):[ ](.*)>/gi,_0x51acee=_0x561d28[_0x13ad5d(0x2f9)](_0xb73e8d);if(_0x51acee)for(const _0x3c9f61 of _0x51acee){_0x3c9f61[_0x13ad5d(0x2f9)](_0xb73e8d);const _0xb78bcb=String(RegExp['$1'])[_0x13ad5d(0x3bf)](',')[_0x13ad5d(0x39d)](_0x2d313d=>_0x2d313d['trim']());for(const _0x36137c of _0xb78bcb){const _0x2e7a53=/^\d+$/['test'](_0x36137c);let _0x33d001=0x0;_0x2e7a53?_0x33d001=Number(_0x36137c):_0x33d001=DataManager[_0x13ad5d(0x3ff)](_0x36137c),_0x33d001&&_0x431d87[_0x13ad5d(0x1e7)](_0x33d001);}}return this[_0x13ad5d(0x48a)][_0x569466]=_0x431d87,this[_0x13ad5d(0x48a)][_0x569466];},Game_BattlerBase[_0x42a407(0x35e)]['addPassiveStatesByPluginParameters']=function(){const _0x46d182=_0x42a407,_0x6b19af=VisuMZ[_0x46d182(0x354)][_0x46d182(0x4c4)][_0x46d182(0x426)][_0x46d182(0x2c7)];this[_0x46d182(0x3ad)]['passiveStates']=this[_0x46d182(0x3ad)][_0x46d182(0x351)][_0x46d182(0x260)](_0x6b19af);},Game_BattlerBase['AURA_SYSTEM_ENABLED']=![],Scene_Boot[_0x42a407(0x35e)]['process_VisuMZ_SkillsStatesCore_CheckForAuras']=function(){const _0x1fd593=_0x42a407,_0x719090=[$dataActors,$dataClasses,$dataSkills,$dataWeapons,$dataArmors,$dataEnemies];for(const _0x2af8a4 of _0x719090){for(const _0x12d7db of _0x2af8a4){if(!_0x12d7db)continue;const _0x3ae904=_0x12d7db[_0x1fd593(0x382)]||'';if(_0x3ae904['match'](/<(?:AURA|MIASMA) (?:STATE|STATES):[ ](.*)>/gi)){Game_BattlerBase[_0x1fd593(0x4d6)]=!![];break;}}}},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3c2)]=function(){const _0x9e32ed=_0x42a407;if(this[_0x9e32ed(0x319)]())return;if(!this[_0x9e32ed(0x4bd)]())return;const _0x280529=this[_0x9e32ed(0x3ad)][_0x9e32ed(0x351)]||[],_0x26aaa4=this,_0x4bfc00=this[_0x9e32ed(0x2f4)]()[_0x9e32ed(0x2fc)](!![],_0x26aaa4),_0x5e38b5=$gameParty[_0x9e32ed(0x310)]()?this['opponentsUnit']()[_0x9e32ed(0x2fc)](![],_0x26aaa4):[];this['_cache']['passiveStates']=_0x280529||[],this[_0x9e32ed(0x3ad)][_0x9e32ed(0x351)]=this[_0x9e32ed(0x3ad)][_0x9e32ed(0x351)][_0x9e32ed(0x260)](_0x4bfc00)[_0x9e32ed(0x260)](_0x5e38b5);},Game_Unit[_0x42a407(0x35e)][_0x42a407(0x2fc)]=function(_0x200ada,_0x39de59){const _0x5bcd89=_0x42a407;let _0x47e04c=[];const _0x526aed=this===$gameParty?this[_0x5bcd89(0x4a5)]():this[_0x5bcd89(0x3cb)]();for(const _0x1e0ef7 of _0x526aed){if(!_0x1e0ef7)continue;if(!_0x1e0ef7[_0x5bcd89(0x4bd)]())continue;const _0x45d4f8=_0x1e0ef7[_0x5bcd89(0x33c)]();for(const _0x1ebd9c of _0x45d4f8){if(!_0x1ebd9c)continue;if(!VisuMZ['SkillsStatesCore'][_0x5bcd89(0x252)](_0x1ebd9c,_0x200ada,_0x1e0ef7,_0x39de59))continue;let _0xb22fd6=DataManager[_0x5bcd89(0x4f1)](_0x1ebd9c,_0x200ada);for(const _0x444ed8 of _0xb22fd6){if(!VisuMZ[_0x5bcd89(0x354)][_0x5bcd89(0x4c7)](_0x444ed8,_0x200ada,_0x1e0ef7,_0x39de59))continue;_0x47e04c[_0x5bcd89(0x1e7)](_0x444ed8),!_0x39de59[_0x5bcd89(0x3c6)](_0x444ed8)&&_0x39de59['setStateOrigin'](_0x444ed8,_0x1e0ef7);}}}return _0x47e04c;},DataManager[_0x42a407(0x4f1)]=function(_0x5b4d9b,_0x516f82){const _0x445443=_0x42a407;if(!_0x5b4d9b)return[];const _0x5d05cf=_0x516f82?'auraStateIDs':_0x445443(0x270),_0x51b85d=VisuMZ[_0x445443(0x354)][_0x445443(0x358)](_0x5b4d9b,_0x5d05cf);this['_cache_getAuraPassiveStatesFromObj']=this[_0x445443(0x234)]||{};if(this[_0x445443(0x234)][_0x51b85d]!==undefined)return this[_0x445443(0x234)][_0x51b85d];const _0x442473=[],_0x437d45=_0x5b4d9b[_0x445443(0x382)]||'',_0x2ee237=_0x516f82?/<AURA (?:STATE|STATES):[ ](.*)>/gi:/<MIASMA (?:STATE|STATES):[ ](.*)>/gi,_0x5f346d=_0x437d45['match'](_0x2ee237);if(_0x5f346d)for(const _0x5b41b3 of _0x5f346d){_0x5b41b3[_0x445443(0x2f9)](_0x2ee237);const _0x57cb1e=String(RegExp['$1'])['split'](',')[_0x445443(0x39d)](_0xad0f0b=>_0xad0f0b[_0x445443(0x45d)]());for(const _0x29918f of _0x57cb1e){const _0x2b8164=/^\d+$/[_0x445443(0x1eb)](_0x29918f);let _0x5d70b7=0x0;_0x2b8164?_0x5d70b7=Number(_0x29918f):_0x5d70b7=DataManager[_0x445443(0x3ff)](_0x29918f),_0x5d70b7&&_0x442473[_0x445443(0x1e7)](_0x5d70b7);}}return this['_cache_getAuraPassiveStatesFromObj'][_0x51b85d]=_0x442473,this[_0x445443(0x234)][_0x51b85d];},VisuMZ[_0x42a407(0x354)]['MeetsAuraObjConditions']=function(_0x363051,_0x5e0dfe,_0x5bd6c2,_0x20ae05){const _0x15cea3=_0x42a407;if(!_0x363051)return![];if(_0x363051['autoRemovalTiming']!==undefined&&_0x363051[_0x15cea3(0x227)]!==undefined)return![];const _0x32e8f3=_0x363051['note']||'';if(!VisuMZ[_0x15cea3(0x354)][_0x15cea3(0x2da)](_0x32e8f3,_0x5e0dfe,_0x5bd6c2,_0x20ae05))return![];return!![];},VisuMZ['SkillsStatesCore'][_0x42a407(0x4c7)]=function(_0x389948,_0x438466,_0x83df2a,_0x4f8999){const _0x5dc513=_0x42a407,_0x32fc18=$dataStates[_0x389948];if(!_0x32fc18)return![];const _0x228eb9=_0x32fc18[_0x5dc513(0x382)]||'';if(!VisuMZ['SkillsStatesCore'][_0x5dc513(0x2da)](_0x228eb9,_0x438466,_0x83df2a,_0x4f8999))return![];return!![];},VisuMZ[_0x42a407(0x354)]['MeetsAuraNoteConditions']=function(_0xb19bff,_0x184b8b,_0x7eb2f8,_0x24d91e){const _0x54fcca=_0x42a407;_0xb19bff=_0xb19bff||'';if(_0x7eb2f8[_0x54fcca(0x319)]()){if(_0x184b8b&&_0xb19bff[_0x54fcca(0x2f9)](/<ALLOW DEAD AURA>/i)){}else{if(!_0x184b8b&&_0xb19bff[_0x54fcca(0x2f9)](/<ALLOW DEAD MIASMA>/i)){}else{if(_0x184b8b&&_0xb19bff[_0x54fcca(0x2f9)](/<DEAD AURA ONLY>/i)){}else{if(!_0x184b8b&&_0xb19bff[_0x54fcca(0x2f9)](/<DEAD MIASMA ONLY>/i)){}else return![];}}}}else{if(_0x184b8b&&_0xb19bff['match'](/<DEAD AURA ONLY>/i))return![];else{if(!_0x184b8b&&_0xb19bff[_0x54fcca(0x2f9)](/<DEAD MIASMA ONLY>/i))return![];}}if(_0x184b8b){if(_0xb19bff[_0x54fcca(0x2f9)](/<AURA NOT FOR USER>/i)){if(_0x7eb2f8===_0x24d91e)return![];}else{if(_0xb19bff['match'](/<NOT USER AURA>/i)){if(_0x7eb2f8===_0x24d91e)return![];}}}return!![];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x228)]=function(_0x5e4e8f){const _0x336119=_0x42a407;if(typeof _0x5e4e8f!==_0x336119(0x47a))_0x5e4e8f=_0x5e4e8f['id'];return this[_0x336119(0x2f1)][_0x5e4e8f]||0x0;},Game_BattlerBase[_0x42a407(0x35e)]['setStateTurns']=function(_0x27fbf8,_0x597e9b){const _0x759735=_0x42a407;if(typeof _0x27fbf8!==_0x759735(0x47a))_0x27fbf8=_0x27fbf8['id'];if(this[_0x759735(0x3c6)](_0x27fbf8)){const _0x1e3c2d=DataManager[_0x759735(0x4d7)](_0x27fbf8);this['_stateTurns'][_0x27fbf8]=_0x597e9b[_0x759735(0x492)](0x0,_0x1e3c2d);if(this[_0x759735(0x2f1)][_0x27fbf8]<=0x0)this['removeState'](_0x27fbf8);}},Game_BattlerBase['prototype'][_0x42a407(0x4e5)]=function(_0x2bf195,_0x16a82d){const _0x2f6014=_0x42a407;if(typeof _0x2bf195!==_0x2f6014(0x47a))_0x2bf195=_0x2bf195['id'];this[_0x2f6014(0x3c6)](_0x2bf195)&&(_0x16a82d+=this[_0x2f6014(0x228)](_0x2bf195),this[_0x2f6014(0x4d1)](_0x2bf195,_0x16a82d));},VisuMZ[_0x42a407(0x354)][_0x42a407(0x21f)]=Game_BattlerBase[_0x42a407(0x35e)]['eraseBuff'],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x36d)]=function(_0x51c998){const _0x3626b2=_0x42a407,_0x49900c=this[_0x3626b2(0x2c9)][_0x51c998];VisuMZ['SkillsStatesCore'][_0x3626b2(0x21f)]['call'](this,_0x51c998);if(_0x49900c>0x0)this[_0x3626b2(0x3f4)](_0x51c998);if(_0x49900c<0x0)this[_0x3626b2(0x4e7)](_0x51c998);},VisuMZ['SkillsStatesCore'][_0x42a407(0x3a9)]=Game_BattlerBase[_0x42a407(0x35e)]['increaseBuff'],Game_BattlerBase[_0x42a407(0x35e)]['increaseBuff']=function(_0x5f13bc){const _0x3f2e75=_0x42a407;VisuMZ[_0x3f2e75(0x354)][_0x3f2e75(0x3a9)]['call'](this,_0x5f13bc);if(!this['isBuffOrDebuffAffected'](_0x5f13bc))this[_0x3f2e75(0x36d)](_0x5f13bc);},VisuMZ[_0x42a407(0x354)]['Game_BattlerBase_decreaseBuff']=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x459)],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x459)]=function(_0x14732a){const _0x1eaf29=_0x42a407;VisuMZ[_0x1eaf29(0x354)][_0x1eaf29(0x4a4)]['call'](this,_0x14732a);if(!this['isBuffOrDebuffAffected'](_0x14732a))this[_0x1eaf29(0x36d)](_0x14732a);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3f4)]=function(_0x25743a){},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x4e7)]=function(_0x1c90b5){},Game_BattlerBase['prototype'][_0x42a407(0x2f6)]=function(_0x31f71f){const _0x2ddfd7=_0x42a407;return this['_buffs'][_0x31f71f]===VisuMZ[_0x2ddfd7(0x354)][_0x2ddfd7(0x4c4)]['Buffs'][_0x2ddfd7(0x334)];},Game_BattlerBase['prototype'][_0x42a407(0x46e)]=function(_0x3383c5){const _0x5668d1=_0x42a407;return this['_buffs'][_0x3383c5]===-VisuMZ[_0x5668d1(0x354)][_0x5668d1(0x4c4)]['Buffs'][_0x5668d1(0x1e3)];},VisuMZ['SkillsStatesCore']['Game_BattlerBase_buffIconIndex']=Game_BattlerBase[_0x42a407(0x35e)]['buffIconIndex'],Game_BattlerBase[_0x42a407(0x35e)]['buffIconIndex']=function(_0x13c5ce,_0x572f45){const _0x504434=_0x42a407;return _0x13c5ce=_0x13c5ce['clamp'](-0x2,0x2),VisuMZ[_0x504434(0x354)][_0x504434(0x339)][_0x504434(0x215)](this,_0x13c5ce,_0x572f45);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x276)]=function(_0x172e1b){const _0x16aac4=_0x42a407,_0x22319b=this[_0x16aac4(0x2c9)][_0x172e1b];return VisuMZ[_0x16aac4(0x354)][_0x16aac4(0x4c4)]['Buffs'][_0x16aac4(0x375)]['call'](this,_0x172e1b,_0x22319b);},Game_BattlerBase['prototype'][_0x42a407(0x2ce)]=function(_0x25b7dc){return this['_buffTurns'][_0x25b7dc]||0x0;},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3c1)]=function(_0x599b33){return this['buffTurns'](_0x599b33);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x254)]=function(_0x56d97c,_0x112523){const _0x11ec5a=_0x42a407;if(this[_0x11ec5a(0x3b6)](_0x56d97c)){const _0x4f8d50=VisuMZ['SkillsStatesCore'][_0x11ec5a(0x4c4)][_0x11ec5a(0x48e)][_0x11ec5a(0x44f)];this[_0x11ec5a(0x27e)][_0x56d97c]=_0x112523[_0x11ec5a(0x492)](0x0,_0x4f8d50);}},Game_BattlerBase['prototype']['addBuffTurns']=function(_0x35dcd3,_0xfc7323){const _0x7e9adc=_0x42a407;this[_0x7e9adc(0x3b6)](_0x35dcd3)&&(_0xfc7323+=this[_0x7e9adc(0x2ce)](stateId),this[_0x7e9adc(0x254)](_0x35dcd3,_0xfc7323));},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x4f9)]=function(_0x17ac0a,_0xcbee){const _0x1cb193=_0x42a407;if(this['isDebuffAffected'](_0x17ac0a)){const _0x367ce6=VisuMZ['SkillsStatesCore'][_0x1cb193(0x4c4)]['Buffs']['MaxTurns'];this[_0x1cb193(0x27e)][_0x17ac0a]=_0xcbee[_0x1cb193(0x492)](0x0,_0x367ce6);}},Game_BattlerBase[_0x42a407(0x35e)]['addDebuffTurns']=function(_0x415908,_0x5ed18d){const _0x3f5674=_0x42a407;this[_0x3f5674(0x480)](_0x415908)&&(_0x5ed18d+=this[_0x3f5674(0x2ce)](stateId),this[_0x3f5674(0x4f9)](_0x415908,_0x5ed18d));},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x24c)]=function(_0x1b4007){const _0xd09150=_0x42a407;if(typeof _0x1b4007!=='number')_0x1b4007=_0x1b4007['id'];return this[_0xd09150(0x307)]=this['_stateData']||{},this['_stateData'][_0x1b4007]=this[_0xd09150(0x307)][_0x1b4007]||{},this[_0xd09150(0x307)][_0x1b4007];},Game_BattlerBase['prototype']['getStateData']=function(_0x4a3bf8,_0x1b7a34){const _0x2af577=_0x42a407;if(typeof _0x4a3bf8!==_0x2af577(0x47a))_0x4a3bf8=_0x4a3bf8['id'];const _0x5aafc3=this['stateData'](_0x4a3bf8);return _0x5aafc3[_0x1b7a34];},Game_BattlerBase['prototype'][_0x42a407(0x4ff)]=function(_0x42d5c3,_0x1d8fec,_0x193fd2){const _0x4a7ead=_0x42a407;if(typeof _0x42d5c3!==_0x4a7ead(0x47a))_0x42d5c3=_0x42d5c3['id'];const _0x2038d1=this[_0x4a7ead(0x24c)](_0x42d5c3);_0x2038d1[_0x1d8fec]=_0x193fd2;},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3cd)]=function(_0x55c25c){const _0xc45669=_0x42a407;if(typeof _0x55c25c!==_0xc45669(0x47a))_0x55c25c=_0x55c25c['id'];this['_stateData']=this[_0xc45669(0x307)]||{},this['_stateData'][_0x55c25c]={};},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3fe)]=function(_0x3788e9){const _0x2a51d0=_0x42a407;if(typeof _0x3788e9!==_0x2a51d0(0x47a))_0x3788e9=_0x3788e9['id'];return this[_0x2a51d0(0x44d)]=this[_0x2a51d0(0x44d)]||{},this[_0x2a51d0(0x44d)][_0x3788e9]===undefined&&(this[_0x2a51d0(0x44d)][_0x3788e9]=''),this['_stateDisplay'][_0x3788e9];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x3e0)]=function(_0x2add45,_0x4e0c83){const _0xa68ce5=_0x42a407;if(typeof _0x2add45!==_0xa68ce5(0x47a))_0x2add45=_0x2add45['id'];this['_stateDisplay']=this[_0xa68ce5(0x44d)]||{},this[_0xa68ce5(0x44d)][_0x2add45]=_0x4e0c83;},Game_BattlerBase['prototype'][_0x42a407(0x481)]=function(_0x1134f4){const _0x42fa3f=_0x42a407;if(typeof _0x1134f4!==_0x42fa3f(0x47a))_0x1134f4=_0x1134f4['id'];this['_stateDisplay']=this[_0x42fa3f(0x44d)]||{},this['_stateDisplay'][_0x1134f4]='';},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x302)]=function(_0x470092){const _0x361594=_0x42a407;if(typeof _0x470092!=='number')_0x470092=_0x470092['id'];this[_0x361594(0x359)]=this[_0x361594(0x359)]||{},this[_0x361594(0x359)][_0x470092]=this[_0x361594(0x359)][_0x470092]||'user';const _0x238fa0=this[_0x361594(0x359)][_0x470092];return this[_0x361594(0x43e)](_0x238fa0);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x392)]=function(_0x225494,_0x8253b4){const _0x1b9d4c=_0x42a407;this[_0x1b9d4c(0x359)]=this['_stateOrigin']||{};const _0x5c9466=_0x8253b4?this[_0x1b9d4c(0x211)](_0x8253b4):this[_0x1b9d4c(0x287)]();this['_stateOrigin'][_0x225494]=_0x5c9466;},Game_BattlerBase['prototype'][_0x42a407(0x202)]=function(_0x44701e){const _0x181a59=_0x42a407;this[_0x181a59(0x359)]=this[_0x181a59(0x359)]||{},delete this[_0x181a59(0x359)][_0x44701e];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x493)]=function(){this['_stateOrigin']={};},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x287)]=function(){const _0x236af1=_0x42a407,_0x223541=this[_0x236af1(0x4cf)]();return this[_0x236af1(0x211)](_0x223541);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x4cf)]=function(){const _0x38a48b=_0x42a407;if($gameParty[_0x38a48b(0x310)]()){if(BattleManager[_0x38a48b(0x280)])return BattleManager['_subject'];else{if(BattleManager['_currentActor'])return BattleManager[_0x38a48b(0x335)];}}else{const _0x5860bd=SceneManager[_0x38a48b(0x2c6)];if(![Scene_Map,Scene_Item][_0x38a48b(0x33a)](_0x5860bd[_0x38a48b(0x28e)]))return $gameParty[_0x38a48b(0x446)]();}return this;},Game_BattlerBase['prototype'][_0x42a407(0x211)]=function(_0x3dbb9c){const _0x2510fa=_0x42a407;if(!_0x3dbb9c)return _0x2510fa(0x398);if(_0x3dbb9c[_0x2510fa(0x29f)]())return _0x2510fa(0x3f9)[_0x2510fa(0x311)](_0x3dbb9c[_0x2510fa(0x24b)]());else{const _0x18011e=_0x2510fa(0x3af)[_0x2510fa(0x311)](_0x3dbb9c[_0x2510fa(0x241)]()),_0x3fb6e4=_0x2510fa(0x343)[_0x2510fa(0x311)](_0x3dbb9c['index']()),_0x27041d=_0x2510fa(0x3f7)['format']($gameTroop[_0x2510fa(0x410)]());return _0x2510fa(0x333)['format'](_0x18011e,_0x3fb6e4,_0x27041d);}return _0x2510fa(0x398);},Game_BattlerBase['prototype']['getStateOriginByKey']=function(_0x55b1fd){const _0x226bc5=_0x42a407;if(_0x55b1fd==='user')return this;else{if(_0x55b1fd[_0x226bc5(0x2f9)](/<actor-(\d+)>/i))return $gameActors[_0x226bc5(0x465)](Number(RegExp['$1']));else{if($gameParty['inBattle']()&&_0x55b1fd[_0x226bc5(0x2f9)](/<troop-(\d+)>/i)){const _0x4843b0=Number(RegExp['$1']);if(_0x4843b0===$gameTroop[_0x226bc5(0x410)]()){if(_0x55b1fd[_0x226bc5(0x2f9)](/<member-(\d+)>/i))return $gameTroop['members']()[Number(RegExp['$1'])];}}if(_0x55b1fd[_0x226bc5(0x2f9)](/<enemy-(\d+)>/i))return new Game_Enemy(Number(RegExp['$1']),-0x1f4,-0x1f4);}}return this;},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x2ac)]=function(_0x275adb){const _0x4d3fe9=_0x42a407;if(!_0x275adb)return![];if(this[_0x4d3fe9(0x4ab)]())return!![];this['_skillToggle']=this['_skillToggle']||{};if(this[_0x4d3fe9(0x31a)][_0x275adb['id']]===undefined){this[_0x4d3fe9(0x29f)]()?this['_skillToggle'][_0x275adb['id']]=DataManager['defaultToggleSkillSetting'](_0x275adb):this['_skillToggle'][_0x275adb['id']]=!![];if(this[_0x4d3fe9(0x31a)][_0x275adb['id']]&&DataManager['toggleExclusionGroups'](_0x275adb)[_0x4d3fe9(0x247)]>0x0){const _0x1cc1e3=DataManager[_0x4d3fe9(0x2c1)](_0x275adb),_0x1731f9=this[_0x4d3fe9(0x323)]()[_0x4d3fe9(0x474)](_0x52de8a=>_0x52de8a!==_0x275adb)['filter'](_0x50a8a2=>DataManager[_0x4d3fe9(0x442)](_0x50a8a2))[_0x4d3fe9(0x474)](_0x4dd1c1=>DataManager[_0x4d3fe9(0x2c1)](_0x4dd1c1)[_0x4d3fe9(0x31f)](_0x5a4892=>_0x1cc1e3[_0x4d3fe9(0x33a)](_0x5a4892)));_0x1731f9[_0x4d3fe9(0x247)]>0x0&&(this[_0x4d3fe9(0x31a)][_0x275adb['id']]=![]);}if(this[_0x4d3fe9(0x31a)][_0x275adb['id']]){this[_0x4d3fe9(0x503)](),$gameParty[_0x4d3fe9(0x265)]();if($gameParty[_0x4d3fe9(0x310)]())$gameTroop['refreshAllMembers']();}}return this['_skillToggle'][_0x275adb['id']];},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x360)]=function(_0x47b9c8,_0x44e4d2){const _0x56861e=_0x42a407;if(!DataManager['isToggleSkill'](_0x47b9c8))return;if(this[_0x56861e(0x4ab)]())return;this[_0x56861e(0x31a)]=this[_0x56861e(0x31a)]||{};if(_0x44e4d2&&DataManager[_0x56861e(0x2c1)](_0x47b9c8)[_0x56861e(0x247)]>0x0){const _0x54dbd4=DataManager[_0x56861e(0x2c1)](_0x47b9c8),_0x5d2b6b=this[_0x56861e(0x323)]()[_0x56861e(0x474)](_0x533a32=>DataManager['isToggleSkill'](_0x533a32))[_0x56861e(0x474)](_0x5d7794=>DataManager['toggleExclusionGroups'](_0x5d7794)[_0x56861e(0x31f)](_0x583dc2=>_0x54dbd4[_0x56861e(0x33a)](_0x583dc2)));for(const _0x1c81e of _0x5d2b6b){if(!_0x1c81e)continue;this[_0x56861e(0x31a)][_0x1c81e['id']]=![];}}this[_0x56861e(0x31a)][_0x47b9c8['id']]=_0x44e4d2,this[_0x56861e(0x503)](),$gameParty[_0x56861e(0x265)]();if($gameParty[_0x56861e(0x310)]())$gameTroop[_0x56861e(0x265)]();},VisuMZ[_0x42a407(0x354)]['Game_BattlerBase_meetsSkillConditions_Toggle']=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x289)],Game_BattlerBase['prototype']['meetsSkillConditions']=function(_0xae2d96){const _0x5e99a3=_0x42a407;if(DataManager['isToggleSkill'](_0xae2d96)){if(this[_0x5e99a3(0x29f)]()){if($gameParty[_0x5e99a3(0x310)]()){if(this[_0x5e99a3(0x3fa)]())return![];if(this[_0x5e99a3(0x28f)]())return![];}if(this[_0x5e99a3(0x2ac)](_0xae2d96))return!![];}else return![];}return VisuMZ[_0x5e99a3(0x354)][_0x5e99a3(0x257)][_0x5e99a3(0x215)](this,_0xae2d96);},VisuMZ[_0x42a407(0x354)]['Game_Action_isValid']=Game_Action[_0x42a407(0x35e)][_0x42a407(0x4a7)],Game_Action[_0x42a407(0x35e)][_0x42a407(0x4a7)]=function(){const _0x10ee1c=_0x42a407;if(DataManager[_0x10ee1c(0x442)](this[_0x10ee1c(0x2eb)]()))return![];return VisuMZ['SkillsStatesCore']['Game_Action_isValid'][_0x10ee1c(0x215)](this);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x1d8)]=Game_Battler['prototype'][_0x42a407(0x2a1)],Game_Battler[_0x42a407(0x35e)]['addState']=function(_0x3ad2d5){const _0x263fcb=_0x42a407,_0x1ab1bb=this[_0x263fcb(0x36f)](_0x3ad2d5);VisuMZ[_0x263fcb(0x354)][_0x263fcb(0x1d8)][_0x263fcb(0x215)](this,_0x3ad2d5);if(_0x1ab1bb&&this['hasState']($dataStates[_0x3ad2d5])){this[_0x263fcb(0x22b)](_0x3ad2d5);;}},VisuMZ['SkillsStatesCore'][_0x42a407(0x387)]=Game_Battler['prototype'][_0x42a407(0x36f)],Game_Battler[_0x42a407(0x35e)][_0x42a407(0x36f)]=function(_0x38f37f){const _0x1a37b6=_0x42a407,_0x35af05=$dataStates[_0x38f37f];if(_0x35af05&&_0x35af05[_0x1a37b6(0x382)][_0x1a37b6(0x2f9)](/<NO DEATH CLEAR>/i))return!this[_0x1a37b6(0x4d4)](_0x38f37f)&&!this[_0x1a37b6(0x2a4)](_0x38f37f)&&!this[_0x1a37b6(0x3cf)][_0x1a37b6(0x3be)](_0x38f37f);return VisuMZ[_0x1a37b6(0x354)]['Game_Battler_isStateAddable'][_0x1a37b6(0x215)](this,_0x38f37f);},VisuMZ['SkillsStatesCore']['Game_BattlerBase_addNewState']=Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x23d)],Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x23d)]=function(_0x1dce1d){const _0x248770=_0x42a407;VisuMZ[_0x248770(0x354)]['Game_BattlerBase_addNewState'][_0x248770(0x215)](this,_0x1dce1d);if(_0x1dce1d===this[_0x248770(0x26a)]())while(this[_0x248770(0x2fb)][_0x248770(0x474)](_0x53b457=>_0x53b457===this[_0x248770(0x26a)]())[_0x248770(0x247)]>0x1){const _0x1bea30=this[_0x248770(0x2fb)][_0x248770(0x3c0)](this[_0x248770(0x26a)]());this[_0x248770(0x2fb)]['splice'](_0x1bea30,0x1);}},Game_Battler[_0x42a407(0x35e)]['onAddState']=function(_0x49e6ab){const _0x22ed65=_0x42a407;this['setStateOrigin'](_0x49e6ab),this[_0x22ed65(0x2a2)](_0x49e6ab),this[_0x22ed65(0x471)](_0x49e6ab),this[_0x22ed65(0x346)](_0x49e6ab),this[_0x22ed65(0x356)](_0x49e6ab);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2ab)]=function(_0x4f3986){const _0x5d90e3=_0x42a407;this[_0x5d90e3(0x3ac)](_0x4f3986),this['onEraseStateGlobalJS'](_0x4f3986),Game_BattlerBase[_0x5d90e3(0x35e)][_0x5d90e3(0x2ab)][_0x5d90e3(0x215)](this,_0x4f3986);},Game_Battler[_0x42a407(0x35e)]['removeStatesAuto']=function(_0x1de22f){const _0xc70722=_0x42a407;for(const _0x12e6ef of this[_0xc70722(0x374)]()){this['isStateExpired'](_0x12e6ef['id'])&&_0x12e6ef[_0xc70722(0x20a)]===_0x1de22f&&(this[_0xc70722(0x2c2)](_0x12e6ef['id']),this[_0xc70722(0x2d3)](_0x12e6ef['id']),this['onExpireStateGlobalJS'](_0x12e6ef['id']));}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2d3)]=function(_0x39e0c9){const _0x1b207f=_0x42a407;this[_0x1b207f(0x34e)](_0x39e0c9);},Game_Battler[_0x42a407(0x35e)]['onAddStateCustomJS']=function(_0x5009c6){const _0x4d2eec=_0x42a407;if(this[_0x4d2eec(0x279)]||this['_tempBattler'])return;const _0x38bd5f=VisuMZ[_0x4d2eec(0x354)]['stateAddJS'];if(_0x38bd5f[_0x5009c6])_0x38bd5f[_0x5009c6][_0x4d2eec(0x215)](this,_0x5009c6);},Game_Battler['prototype'][_0x42a407(0x3ac)]=function(_0x4be067){const _0x42cfc5=_0x42a407;if(this[_0x42cfc5(0x279)]||this[_0x42cfc5(0x2bf)])return;const _0x410b14=VisuMZ[_0x42cfc5(0x354)]['stateEraseJS'];if(_0x410b14[_0x4be067])_0x410b14[_0x4be067][_0x42cfc5(0x215)](this,_0x4be067);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x34e)]=function(_0x11ff22){const _0xd89008=_0x42a407;if(this[_0xd89008(0x279)]||this[_0xd89008(0x2bf)])return;const _0x350d92=VisuMZ[_0xd89008(0x354)][_0xd89008(0x428)];if(_0x350d92[_0x11ff22])_0x350d92[_0x11ff22][_0xd89008(0x215)](this,_0x11ff22);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x356)]=function(_0x34d63f){const _0x205b1f=_0x42a407;if(this[_0x205b1f(0x279)]||this[_0x205b1f(0x2bf)])return;try{VisuMZ['SkillsStatesCore'][_0x205b1f(0x4c4)][_0x205b1f(0x42b)][_0x205b1f(0x36c)][_0x205b1f(0x215)](this,_0x34d63f);}catch(_0x516453){if($gameTemp[_0x205b1f(0x2bd)]())console[_0x205b1f(0x3ab)](_0x516453);}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x468)]=function(_0x102371){const _0x2d4791=_0x42a407;if(this[_0x2d4791(0x279)]||this[_0x2d4791(0x2bf)])return;try{VisuMZ[_0x2d4791(0x354)][_0x2d4791(0x4c4)][_0x2d4791(0x42b)][_0x2d4791(0x3e8)][_0x2d4791(0x215)](this,_0x102371);}catch(_0x200ed6){if($gameTemp['isPlaytest']())console[_0x2d4791(0x3ab)](_0x200ed6);}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x4ba)]=function(_0x30eb6b){const _0x5f5b7d=_0x42a407;if(this[_0x5f5b7d(0x279)]||this[_0x5f5b7d(0x2bf)])return;try{VisuMZ[_0x5f5b7d(0x354)][_0x5f5b7d(0x4c4)][_0x5f5b7d(0x42b)][_0x5f5b7d(0x38b)]['call'](this,_0x30eb6b);}catch(_0x4d69ea){if($gameTemp[_0x5f5b7d(0x2bd)]())console[_0x5f5b7d(0x3ab)](_0x4d69ea);}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x24f)]=function(_0x2dab8){const _0x397fcb=_0x42a407;return _0x2dab8=_0x2dab8[_0x397fcb(0x308)]()[_0x397fcb(0x45d)](),this[_0x397fcb(0x374)]()[_0x397fcb(0x474)](_0x2ffbbe=>_0x2ffbbe['categories'][_0x397fcb(0x33a)](_0x2dab8));},Game_Battler['prototype'][_0x42a407(0x452)]=function(_0x4d64bc,_0x618673){const _0x174f70=_0x42a407;_0x4d64bc=_0x4d64bc[_0x174f70(0x308)]()['trim'](),_0x618673=_0x618673||0x0;const _0x16eba8=this[_0x174f70(0x24f)](_0x4d64bc),_0x2ec92c=[];for(const _0x2febb2 of _0x16eba8){if(!_0x2febb2)continue;if(_0x618673<=0x0)break;_0x2ec92c[_0x174f70(0x1e7)](_0x2febb2['id']),this[_0x174f70(0x3cf)][_0x174f70(0x3bb)]=!![],_0x618673--;}while(_0x2ec92c['length']>0x0){this['removeState'](_0x2ec92c['shift']());}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2af)]=function(_0x18b88a,_0x463a83){const _0x845efa=_0x42a407;_0x18b88a=_0x18b88a['toUpperCase']()[_0x845efa(0x45d)](),_0x463a83=_0x463a83||[];const _0x323413=this['statesByCategory'](_0x18b88a),_0x59459e=[];for(const _0x548549 of _0x323413){if(!_0x548549)continue;if(_0x463a83[_0x845efa(0x33a)](_0x548549))continue;_0x59459e['push'](_0x548549['id']),this[_0x845efa(0x3cf)][_0x845efa(0x3bb)]=!![];}while(_0x59459e[_0x845efa(0x247)]>0x0){this['removeState'](_0x59459e['shift']());}},Game_Battler['prototype']['isStateCategoryAffected']=function(_0x82c266){const _0x262b65=_0x42a407;return this[_0x262b65(0x1f1)](_0x82c266)>0x0;},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x28c)]=function(_0x3493c7){return this['totalStateCategory'](_0x3493c7)>0x0;},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x1f1)]=function(_0x5c7146){const _0x250101=_0x42a407,_0x1754c7=this['statesByCategory'](_0x5c7146)['filter'](_0x3eb1af=>this[_0x250101(0x3c6)](_0x3eb1af['id']));return _0x1754c7['length'];},Game_Battler['prototype'][_0x42a407(0x26f)]=function(_0x3b8a43){const _0x41345a=_0x42a407,_0x475d47=this[_0x41345a(0x24f)](_0x3b8a43);return _0x475d47[_0x41345a(0x247)];},VisuMZ[_0x42a407(0x354)][_0x42a407(0x33b)]=Game_BattlerBase[_0x42a407(0x35e)]['isStateResist'],Game_BattlerBase['prototype']['isStateResist']=function(_0x34254d){const _0x5a14a4=_0x42a407,_0x4b748a=$dataStates[_0x34254d];if(_0x4b748a&&_0x4b748a[_0x5a14a4(0x4ef)][_0x5a14a4(0x247)]>0x0)for(const _0x258a06 of _0x4b748a[_0x5a14a4(0x4ef)]){if(this[_0x5a14a4(0x461)](_0x258a06))return!![];}return VisuMZ[_0x5a14a4(0x354)]['Game_BattlerBase_isStateResist'][_0x5a14a4(0x215)](this,_0x34254d);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x461)]=function(_0x599751){const _0x10a39c=_0x42a407;let _0x2a92de=_0x10a39c(0x3a1);if(this[_0x10a39c(0x453)](_0x2a92de))return this[_0x10a39c(0x3ad)][_0x2a92de][_0x10a39c(0x33a)](_0x599751);return this[_0x10a39c(0x3ad)][_0x2a92de]=this[_0x10a39c(0x381)](),this[_0x10a39c(0x3ad)][_0x2a92de]['includes'](_0x599751);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x381)]=function(){const _0xf0b15e=_0x42a407,_0x103273=/<RESIST STATE (?:CATEGORY|CATEGORIES):[ ](.*)>/gi,_0x2774a3=/<RESIST STATE (?:CATEGORY|CATEGORIES)>\s*([\s\S]*)\s*<\/RESIST STATE (?:CATEGORY|CATEGORIES)>/i;let _0x2d1aa7=[];for(const _0x217560 of this['traitObjects']()){if(!_0x217560)continue;const _0xdc57b6=_0x217560[_0xf0b15e(0x382)],_0x4ddb35=_0xdc57b6[_0xf0b15e(0x2f9)](_0x103273);if(_0x4ddb35)for(const _0xd45a81 of _0x4ddb35){_0xd45a81[_0xf0b15e(0x2f9)](_0x103273);const _0x4def08=String(RegExp['$1'])[_0xf0b15e(0x3bf)](',')[_0xf0b15e(0x39d)](_0x160482=>String(_0x160482)[_0xf0b15e(0x308)]()[_0xf0b15e(0x45d)]());_0x2d1aa7=_0x2d1aa7[_0xf0b15e(0x260)](_0x4def08);}if(_0xdc57b6[_0xf0b15e(0x2f9)](_0x2774a3)){const _0x31b65d=String(RegExp['$1'])[_0xf0b15e(0x3bf)](/[\r\n]+/)[_0xf0b15e(0x39d)](_0x15f084=>String(_0x15f084)[_0xf0b15e(0x308)]()[_0xf0b15e(0x45d)]());_0x2d1aa7=_0x2d1aa7[_0xf0b15e(0x260)](_0x31b65d);}}return _0x2d1aa7;},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x2a2)]=function(_0x52c41b){const _0x3cefbc=_0x42a407,_0x35d741=$dataStates[_0x52c41b];if(!_0x35d741)return;const _0x2da14b=_0x35d741[_0x3cefbc(0x382)]||'',_0x4d7611=_0x2da14b['match'](/<REMOVE OTHER (.*) STATES>/gi);if(_0x4d7611){const _0x17bce7=[_0x35d741];for(const _0x2a4973 of _0x4d7611){_0x2a4973['match'](/<REMOVE OTHER (.*) STATES>/i);const _0x2a05d9=String(RegExp['$1']);this[_0x3cefbc(0x2af)](_0x2a05d9,_0x17bce7);}}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x3d9)]=function(){const _0x4fdd9e=_0x42a407;for(const _0x4368b2 of this[_0x4fdd9e(0x374)]()){if(!_0x4368b2)continue;if(!this['isStateAffected'](_0x4368b2['id']))continue;if(!_0x4368b2[_0x4fdd9e(0x4bc)])continue;if(this[_0x4fdd9e(0x223)](_0x4368b2))continue;Math['randomInt'](0x64)<_0x4368b2['chanceByDamage']&&this['removeState'](_0x4368b2['id']);}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x239)]=Game_Action[_0x42a407(0x35e)][_0x42a407(0x266)],Game_Action['prototype'][_0x42a407(0x266)]=function(_0x1b4f81,_0x4844b1){const _0x1c2bee=_0x42a407;$gameTemp[_0x1c2bee(0x216)]=this[_0x1c2bee(0x2eb)](),$gameTemp[_0x1c2bee(0x286)]=this[_0x1c2bee(0x2e3)](),$gameTemp[_0x1c2bee(0x46f)]=_0x4844b1,VisuMZ[_0x1c2bee(0x354)]['Game_Action_executeHpDamage_bypassStateDmgRemoval']['call'](this,_0x1b4f81,_0x4844b1),$gameTemp[_0x1c2bee(0x216)]=undefined,$gameTemp[_0x1c2bee(0x286)]=undefined,$gameTemp[_0x1c2bee(0x46f)]=undefined;},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x223)]=function(_0xb3ed49){const _0x11489f=_0x42a407;if($gameTemp[_0x11489f(0x216)]){const _0x5432aa=$gameTemp[_0x11489f(0x216)],_0x5a48db=/<BYPASS STATE DAMAGE REMOVAL:[ ](.*)>/gi;if(DataManager[_0x11489f(0x4bf)](_0xb3ed49,_0x5432aa,_0x5a48db,_0x11489f(0x427)))return!![];}if($gameTemp['_bypassRemoveStateDamage_user']){const _0x4b5be9=$gameTemp[_0x11489f(0x286)];if(_0x4b5be9[_0x11489f(0x23c)](_0xb3ed49))return!![];}if(this[_0x11489f(0x312)](_0xb3ed49))return!![];return![];},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x23c)]=function(_0x5742d3){const _0x1361cd=_0x42a407,_0x517908=/<BYPASS STATE DAMAGE REMOVAL AS (?:ATTACKER|USER):[ ](.*)>/gi;for(const _0x24a8db of this[_0x1361cd(0x3b0)]()){if(!_0x24a8db)continue;if(DataManager[_0x1361cd(0x4bf)](_0x5742d3,_0x24a8db,_0x517908,_0x1361cd(0x4a1)))return!![];}return![];},Game_Battler['prototype'][_0x42a407(0x312)]=function(_0x426263){const _0x5b2f19=_0x42a407,_0x4471d5=/<BYPASS STATE DAMAGE REMOVAL AS (?:TARGET|VICTIM):[ ](.*)>/gi;for(const _0x15e46a of this[_0x5b2f19(0x3b0)]()){if(!_0x15e46a)continue;if(DataManager[_0x5b2f19(0x4bf)](_0x426263,_0x15e46a,_0x4471d5,_0x5b2f19(0x222)))return!![];}return![];},DataManager[_0x42a407(0x4bf)]=function(_0x30f01e,_0x174dd7,_0x16408c,_0x34afd9){const _0x1c389c=_0x42a407,_0x1088f6=_0x1c389c(0x347)[_0x1c389c(0x311)](_0x174dd7[_0x1c389c(0x425)],_0x174dd7['id'],_0x34afd9);this[_0x1c389c(0x430)]=this[_0x1c389c(0x430)]||{};if(this[_0x1c389c(0x430)][_0x1088f6]!==undefined)return this[_0x1c389c(0x430)][_0x1088f6][_0x1c389c(0x33a)](_0x30f01e['id']);const _0x3927ab=[],_0x574c7b=_0x174dd7[_0x1c389c(0x382)]['match'](_0x16408c);if(_0x574c7b)for(const _0x4ec5d6 of _0x574c7b){_0x4ec5d6[_0x1c389c(0x2f9)](_0x16408c);const _0x51b8b6=String(RegExp['$1'])['split'](',')[_0x1c389c(0x39d)](_0x58a17b=>_0x58a17b[_0x1c389c(0x45d)]());for(let _0x4113f0 of _0x51b8b6){_0x4113f0=(String(_0x4113f0)||'')[_0x1c389c(0x45d)]();if(_0x4113f0[_0x1c389c(0x2f9)](/(\d+)[ ](?:THROUGH|to)[ ](\d+)/i)){const _0x2b0190=Math[_0x1c389c(0x30c)](Number(RegExp['$1']),Number(RegExp['$2'])),_0x23b150=Math[_0x1c389c(0x327)](Number(RegExp['$1']),Number(RegExp['$2']));for(let _0x179537=_0x2b0190;_0x179537<=_0x23b150;_0x179537++)elements['push'](_0x179537);continue;}const _0x410b2c=/^\d+$/['test'](_0x4113f0);_0x410b2c?entryID=Number(_0x4113f0):entryID=DataManager[_0x1c389c(0x3ff)](_0x4113f0),entryID&&_0x3927ab['push'](entryID);}}return this[_0x1c389c(0x430)][_0x1088f6]=_0x3927ab,this[_0x1c389c(0x430)][_0x1088f6][_0x1c389c(0x33a)](_0x30f01e['id']);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x292)]=Game_Battler['prototype'][_0x42a407(0x35f)],Game_Battler[_0x42a407(0x35e)][_0x42a407(0x35f)]=function(_0x32f8dd,_0x49cb50){const _0x30f3d5=_0x42a407;VisuMZ[_0x30f3d5(0x354)][_0x30f3d5(0x292)][_0x30f3d5(0x215)](this,_0x32f8dd,_0x49cb50),this[_0x30f3d5(0x3b6)](_0x32f8dd)&&this[_0x30f3d5(0x338)](_0x32f8dd,_0x49cb50);},Game_Battler[_0x42a407(0x35e)]['isBuffPrevented']=function(_0x2252b3){},VisuMZ[_0x42a407(0x354)][_0x42a407(0x40b)]=Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2e0)],Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2e0)]=function(_0x142efe,_0x377039){const _0x7eeac3=_0x42a407;VisuMZ[_0x7eeac3(0x354)][_0x7eeac3(0x40b)][_0x7eeac3(0x215)](this,_0x142efe,_0x377039),this[_0x7eeac3(0x480)](_0x142efe)&&this[_0x7eeac3(0x1f6)](_0x142efe,_0x377039);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2e7)]=function(){const _0x3a16f3=_0x42a407;for(let _0x3ac2da=0x0;_0x3ac2da<this[_0x3a16f3(0x2d6)]();_0x3ac2da++){if(this['isBuffExpired'](_0x3ac2da)){const _0x30dc02=this[_0x3a16f3(0x2c9)][_0x3ac2da];this[_0x3a16f3(0x3d8)](_0x3ac2da);if(_0x30dc02>0x0)this[_0x3a16f3(0x4e4)](_0x3ac2da);if(_0x30dc02<0x0)this[_0x3a16f3(0x484)](_0x3ac2da);}}},Game_Battler[_0x42a407(0x35e)]['onAddBuff']=function(_0x56c2ce,_0x1880d4){const _0x4db061=_0x42a407;this[_0x4db061(0x1f4)](_0x56c2ce,_0x1880d4);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x1f6)]=function(_0x392bdf,_0x131564){this['onAddDebuffGlobalJS'](_0x392bdf,_0x131564);},Game_Battler['prototype'][_0x42a407(0x3f4)]=function(_0x2c2086){const _0x1c7074=_0x42a407;Game_BattlerBase[_0x1c7074(0x35e)]['onEraseBuff'][_0x1c7074(0x215)](this,_0x2c2086),this['onEraseBuffGlobalJS'](_0x2c2086);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x4e7)]=function(_0x157261){const _0x2182b1=_0x42a407;Game_BattlerBase[_0x2182b1(0x35e)][_0x2182b1(0x4e7)]['call'](this,_0x157261),this[_0x2182b1(0x38c)](_0x157261);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x4e4)]=function(_0x2abea4){const _0x23525d=_0x42a407;this[_0x23525d(0x2cf)](_0x2abea4);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x484)]=function(_0x2e2531){const _0x2d9ee7=_0x42a407;this[_0x2d9ee7(0x2e5)](_0x2e2531);},Game_Battler['prototype'][_0x42a407(0x1f4)]=function(_0xa55fa0,_0x21fe71){const _0x252788=_0x42a407;VisuMZ[_0x252788(0x354)][_0x252788(0x4c4)][_0x252788(0x48e)][_0x252788(0x1ed)][_0x252788(0x215)](this,_0xa55fa0,_0x21fe71);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x40c)]=function(_0x4769e5,_0x76189c){const _0x446aa2=_0x42a407;VisuMZ['SkillsStatesCore']['Settings'][_0x446aa2(0x48e)][_0x446aa2(0x2d2)][_0x446aa2(0x215)](this,_0x4769e5,_0x76189c);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x27c)]=function(_0x145414){const _0x41b098=_0x42a407;VisuMZ[_0x41b098(0x354)][_0x41b098(0x4c4)]['Buffs']['onEraseBuffJS'][_0x41b098(0x215)](this,_0x145414);},Game_BattlerBase[_0x42a407(0x35e)][_0x42a407(0x38c)]=function(_0x37fb1e){const _0x998106=_0x42a407;VisuMZ[_0x998106(0x354)]['Settings']['Buffs']['onEraseDebuffJS'][_0x998106(0x215)](this,_0x37fb1e);},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2cf)]=function(_0x1f195a){const _0x5990c1=_0x42a407;VisuMZ[_0x5990c1(0x354)][_0x5990c1(0x4c4)][_0x5990c1(0x48e)]['onExpireBuffJS'][_0x5990c1(0x215)](this,_0x1f195a);},Game_Battler['prototype'][_0x42a407(0x2e5)]=function(_0x4ee7ac){const _0x26ee6e=_0x42a407;VisuMZ[_0x26ee6e(0x354)][_0x26ee6e(0x4c4)][_0x26ee6e(0x48e)][_0x26ee6e(0x3c3)][_0x26ee6e(0x215)](this,_0x4ee7ac);},Game_Battler['prototype']['onAddStateMakeCustomSlipValues']=function(_0x1c3289){const _0x5ea7a8=_0x42a407,_0x2d8da2=VisuMZ['SkillsStatesCore'],_0x116097=[_0x5ea7a8(0x206),_0x5ea7a8(0x4f0),_0x5ea7a8(0x48f),_0x5ea7a8(0x3e3),_0x5ea7a8(0x33e),_0x5ea7a8(0x455)];for(const _0x52ff92 of _0x116097){_0x2d8da2[_0x52ff92][_0x1c3289]&&_0x2d8da2[_0x52ff92][_0x1c3289][_0x5ea7a8(0x215)](this,_0x1c3289);}},VisuMZ[_0x42a407(0x354)]['Game_Battler_regenerateAll']=Game_Battler[_0x42a407(0x35e)][_0x42a407(0x3dc)],Game_Battler[_0x42a407(0x35e)][_0x42a407(0x3dc)]=function(){const _0x596ce2=_0x42a407;this[_0x596ce2(0x233)](),VisuMZ['SkillsStatesCore'][_0x596ce2(0x39b)][_0x596ce2(0x215)](this),this[_0x596ce2(0x2a3)](),this['regenerateAllSkillsStatesCore']();},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x2a3)]=function(){const _0x50dbdb=_0x42a407;for(const _0x1ba573 of this['passiveStates']()){if(!_0x1ba573)continue;this[_0x50dbdb(0x471)](_0x1ba573['id']);}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x233)]=function(){const _0x1d3443=_0x42a407;for(const _0x54dba9 of this[_0x1d3443(0x374)]()){if(!_0x54dba9)continue;_0x54dba9[_0x1d3443(0x382)][_0x1d3443(0x2f9)](/<JS SLIP REFRESH>/i)&&this[_0x1d3443(0x471)](_0x54dba9['id']);}},Game_Battler[_0x42a407(0x35e)][_0x42a407(0x4ea)]=function(){const _0x3bef2b=_0x42a407;if(!this[_0x3bef2b(0x3b4)]())return;const _0x5f36fc=this['states']();for(const _0x13d3cb of _0x5f36fc){if(!_0x13d3cb)continue;this['onRegenerateCustomStateDamageOverTime'](_0x13d3cb);}},Game_Battler[_0x42a407(0x35e)]['onRegenerateCustomStateDamageOverTime']=function(_0x306fed){const _0x3b14ec=_0x42a407,_0x25b6f4=this[_0x3b14ec(0x35d)](_0x306fed['id'],_0x3b14ec(0x283))||0x0,_0x5dfd4d=-this['maxSlipDamage'](),_0x4b1f46=Math[_0x3b14ec(0x327)](_0x25b6f4,_0x5dfd4d);if(_0x4b1f46!==0x0){const _0xba1fae=this[_0x3b14ec(0x3cf)][_0x3b14ec(0x29d)]||0x0;this['gainHp'](_0x4b1f46),this[_0x3b14ec(0x3cf)][_0x3b14ec(0x29d)]+=_0xba1fae;}const _0x3256a4=this[_0x3b14ec(0x35d)](_0x306fed['id'],_0x3b14ec(0x2b3))||0x0;if(_0x3256a4!==0x0){const _0x333a8a=this[_0x3b14ec(0x3cf)][_0x3b14ec(0x49c)]||0x0;this[_0x3b14ec(0x212)](_0x3256a4),this[_0x3b14ec(0x3cf)][_0x3b14ec(0x49c)]+=_0x333a8a;}const _0x37789a=this[_0x3b14ec(0x35d)](_0x306fed['id'],_0x3b14ec(0x395))||0x0;_0x37789a!==0x0&&this[_0x3b14ec(0x209)](_0x37789a);},VisuMZ['SkillsStatesCore'][_0x42a407(0x490)]=Game_Actor['prototype'][_0x42a407(0x38f)],Game_Actor[_0x42a407(0x35e)]['skillTypes']=function(){const _0x218926=_0x42a407,_0xe53170=VisuMZ[_0x218926(0x354)][_0x218926(0x490)][_0x218926(0x215)](this),_0x32e0bf=VisuMZ['SkillsStatesCore'][_0x218926(0x4c4)][_0x218926(0x3ca)];let _0x4474bc=_0x32e0bf[_0x218926(0x1fc)];return $gameParty[_0x218926(0x310)]()&&(_0x4474bc=_0x4474bc[_0x218926(0x260)](_0x32e0bf[_0x218926(0x4e8)])),_0xe53170[_0x218926(0x474)](_0x21ec01=>!_0x4474bc[_0x218926(0x33a)](_0x21ec01));},Game_Actor[_0x42a407(0x35e)][_0x42a407(0x3d2)]=function(){const _0x4956d4=_0x42a407;return this['skills']()[_0x4956d4(0x474)](_0x48d942=>this[_0x4956d4(0x2ec)](_0x48d942));},Game_Actor[_0x42a407(0x35e)]['isSkillUsableForAutoBattle']=function(_0x455a70){const _0x31f1f7=_0x42a407;if(!this['canUse'](_0x455a70))return![];if(!_0x455a70)return![];if(!this[_0x31f1f7(0x42e)](_0x455a70))return![];if(this[_0x31f1f7(0x41c)](_0x455a70))return![];return!![];},Game_Actor['prototype'][_0x42a407(0x42e)]=function(_0x397282){const _0x3f9544=_0x42a407,_0x2eba3e=this[_0x3f9544(0x38f)](),_0x5c9713=DataManager[_0x3f9544(0x23e)](_0x397282),_0x583ef7=_0x2eba3e['filter'](_0x23adab=>_0x5c9713[_0x3f9544(0x33a)](_0x23adab));return _0x583ef7[_0x3f9544(0x247)]>0x0;},Game_Actor[_0x42a407(0x35e)][_0x42a407(0x41c)]=function(_0x28b47a){const _0x30fea4=_0x42a407;if(!VisuMZ[_0x30fea4(0x354)][_0x30fea4(0x40a)](this,_0x28b47a))return!![];if(!VisuMZ[_0x30fea4(0x354)][_0x30fea4(0x473)](this,_0x28b47a))return!![];if(!VisuMZ[_0x30fea4(0x354)][_0x30fea4(0x2cd)](this,_0x28b47a))return!![];return![];},Game_Actor['prototype']['passiveStateObjects']=function(){const _0x163d1f=_0x42a407;let _0x3c2b85=[this[_0x163d1f(0x465)](),this[_0x163d1f(0x290)]()];_0x3c2b85=_0x3c2b85[_0x163d1f(0x260)](this['equips']()[_0x163d1f(0x474)](_0x2349af=>_0x2349af));for(const _0x234295 of this[_0x163d1f(0x2ae)]){const _0x4713ef=$dataSkills[_0x234295];if(!_0x4713ef)continue;if(DataManager[_0x163d1f(0x442)](_0x4713ef)){if(!this[_0x163d1f(0x2ac)](_0x4713ef))continue;}_0x3c2b85[_0x163d1f(0x1e7)](_0x4713ef);}return _0x3c2b85;},Game_Actor['prototype'][_0x42a407(0x273)]=function(){const _0xdefe82=_0x42a407;Game_Battler[_0xdefe82(0x35e)]['addPassiveStatesByPluginParameters'][_0xdefe82(0x215)](this);const _0x4a619c=VisuMZ[_0xdefe82(0x354)]['Settings'][_0xdefe82(0x426)][_0xdefe82(0x367)];this[_0xdefe82(0x3ad)]['passiveStates']=this[_0xdefe82(0x3ad)][_0xdefe82(0x351)]['concat'](_0x4a619c);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x1d6)]=Game_Actor['prototype']['learnSkill'],Game_Actor[_0x42a407(0x35e)][_0x42a407(0x394)]=function(_0x3f6d51){const _0xd8a37e=_0x42a407;VisuMZ[_0xd8a37e(0x354)]['Game_Actor_learnSkill'][_0xd8a37e(0x215)](this,_0x3f6d51),this[_0xd8a37e(0x3ad)]={},this[_0xd8a37e(0x351)]();},VisuMZ[_0x42a407(0x354)][_0x42a407(0x1ee)]=Game_Actor[_0x42a407(0x35e)][_0x42a407(0x42f)],Game_Actor[_0x42a407(0x35e)][_0x42a407(0x42f)]=function(_0x3ecc31){const _0x33612a=_0x42a407;VisuMZ['SkillsStatesCore'][_0x33612a(0x1ee)][_0x33612a(0x215)](this,_0x3ecc31),this[_0x33612a(0x3ad)]={},this['passiveStates']();},Game_Actor[_0x42a407(0x35e)]['stepsForTurn']=function(){const _0x5772a1=_0x42a407;return VisuMZ[_0x5772a1(0x354)][_0x5772a1(0x4c4)][_0x5772a1(0x42b)][_0x5772a1(0x2fd)]??0x14;},Game_Enemy['prototype']['passiveStateObjects']=function(){const _0x188157=_0x42a407;let _0x3e74f1=[this[_0x188157(0x4e0)]()];return _0x3e74f1[_0x188157(0x260)](this[_0x188157(0x323)]());},Game_Enemy[_0x42a407(0x35e)][_0x42a407(0x273)]=function(){const _0x1f69ba=_0x42a407;Game_Battler[_0x1f69ba(0x35e)][_0x1f69ba(0x273)][_0x1f69ba(0x215)](this);const _0x3af03b=VisuMZ['SkillsStatesCore'][_0x1f69ba(0x4c4)][_0x1f69ba(0x426)][_0x1f69ba(0x218)];this['_cache'][_0x1f69ba(0x351)]=this[_0x1f69ba(0x3ad)][_0x1f69ba(0x351)][_0x1f69ba(0x260)](_0x3af03b);},Game_Enemy['prototype'][_0x42a407(0x323)]=function(){const _0x1bd3ff=_0x42a407,_0x2b1322=[];for(const _0x37039c of this[_0x1bd3ff(0x4e0)]()['actions']){const _0x456a32=$dataSkills[_0x37039c[_0x1bd3ff(0x376)]];if(_0x456a32&&!_0x2b1322[_0x1bd3ff(0x33a)](_0x456a32))_0x2b1322['push'](_0x456a32);}return _0x2b1322;},Game_Enemy[_0x42a407(0x35e)]['meetsStateCondition']=function(_0x577129){const _0x5ef9f1=_0x42a407;return this[_0x5ef9f1(0x44c)]($dataStates[_0x577129]);},VisuMZ['SkillsStatesCore'][_0x42a407(0x29b)]=Game_Unit[_0x42a407(0x35e)]['isAllDead'],Game_Unit[_0x42a407(0x35e)][_0x42a407(0x4e3)]=function(){const _0x4c4c96=_0x42a407;if(this['isPartyAllAffectedByGroupDefeatStates']())return!![];return VisuMZ[_0x4c4c96(0x354)][_0x4c4c96(0x29b)]['call'](this);},Game_Unit[_0x42a407(0x35e)][_0x42a407(0x4e2)]=function(){const _0x1ad559=_0x42a407,_0x59b9c3=this[_0x1ad559(0x46c)]();for(const _0x5b05b0 of _0x59b9c3){if(!_0x5b05b0['isGroupDefeatStateAffected']())return![];}return!![];},Game_Unit[_0x42a407(0x35e)]['refreshAllMembers']=function(){const _0x13a003=_0x42a407;for(const _0x371821 of this[_0x13a003(0x3cb)]()){if(!_0x371821)continue;_0x371821['refresh']();}},VisuMZ['SkillsStatesCore'][_0x42a407(0x4ed)]=Game_Player[_0x42a407(0x35e)][_0x42a407(0x503)],Game_Player[_0x42a407(0x35e)][_0x42a407(0x503)]=function(){const _0x5c3f53=_0x42a407;VisuMZ[_0x5c3f53(0x354)]['Game_Player_refresh'][_0x5c3f53(0x215)](this),$gameParty[_0x5c3f53(0x265)](),$gameParty[_0x5c3f53(0x310)]()&&$gameTroop[_0x5c3f53(0x265)]();},VisuMZ['SkillsStatesCore'][_0x42a407(0x25b)]=Game_Troop[_0x42a407(0x35e)][_0x42a407(0x264)],Game_Troop[_0x42a407(0x35e)]['setup']=function(_0x1065e2){const _0x4b9090=_0x42a407;VisuMZ[_0x4b9090(0x354)]['Game_Troop_setup'][_0x4b9090(0x215)](this,_0x1065e2),this[_0x4b9090(0x2ef)]();},Game_Troop[_0x42a407(0x35e)][_0x42a407(0x2ef)]=function(){const _0x3bf583=_0x42a407;this[_0x3bf583(0x1db)]=Graphics[_0x3bf583(0x21a)];},Game_Troop['prototype'][_0x42a407(0x410)]=function(){const _0xa1f528=_0x42a407;return this[_0xa1f528(0x1db)]=this[_0xa1f528(0x1db)]||Graphics['frameCount'],this[_0xa1f528(0x1db)];},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x3d7)]=function(){const _0x277c9f=_0x42a407;if(ConfigManager[_0x277c9f(0x3a7)]&&ConfigManager[_0x277c9f(0x21c)]!==undefined)return ConfigManager['uiHelpPosition'];else{if(this[_0x277c9f(0x2ba)]())return this[_0x277c9f(0x483)]()['match'](/LOWER/i);else Scene_ItemBase[_0x277c9f(0x35e)]['isRightInputMode']['call'](this);}},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x2c4)]=function(){const _0x5950a1=_0x42a407;if(ConfigManager[_0x5950a1(0x3a7)]&&ConfigManager[_0x5950a1(0x4f4)]!==undefined)return ConfigManager[_0x5950a1(0x4f4)];else return this['isUseSkillsStatesCoreUpdatedLayout']()?this[_0x5950a1(0x483)]()[_0x5950a1(0x2f9)](/RIGHT/i):Scene_ItemBase[_0x5950a1(0x35e)][_0x5950a1(0x2c4)][_0x5950a1(0x215)](this);},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x483)]=function(){const _0x1c6d88=_0x42a407;return VisuMZ['SkillsStatesCore'][_0x1c6d88(0x4c4)][_0x1c6d88(0x3ca)]['LayoutStyle'];},Scene_Skill['prototype'][_0x42a407(0x49a)]=function(){const _0x21ca21=_0x42a407;return this[_0x21ca21(0x4e1)]&&this[_0x21ca21(0x4e1)][_0x21ca21(0x49a)]();},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x2ba)]=function(){const _0x298863=_0x42a407;return VisuMZ[_0x298863(0x354)][_0x298863(0x4c4)][_0x298863(0x3ca)][_0x298863(0x3e2)];},VisuMZ[_0x42a407(0x354)][_0x42a407(0x285)]=Scene_Skill['prototype'][_0x42a407(0x3f0)],Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x3f0)]=function(){const _0x4cb4e0=_0x42a407;return this[_0x4cb4e0(0x2ba)]()?this[_0x4cb4e0(0x385)]():VisuMZ[_0x4cb4e0(0x354)]['Scene_Skill_helpWindowRect'][_0x4cb4e0(0x215)](this);},Scene_Skill['prototype'][_0x42a407(0x385)]=function(){const _0x5b4bcd=_0x42a407,_0x360a86=0x0,_0x370e93=this[_0x5b4bcd(0x386)](),_0x1dba5b=Graphics[_0x5b4bcd(0x494)],_0x4823c6=this[_0x5b4bcd(0x1fa)]();return new Rectangle(_0x360a86,_0x370e93,_0x1dba5b,_0x4823c6);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x261)]=Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x2b5)],Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x2b5)]=function(){const _0x3ac4ce=_0x42a407;return this[_0x3ac4ce(0x2ba)]()?this[_0x3ac4ce(0x3fb)]():VisuMZ['SkillsStatesCore'][_0x3ac4ce(0x261)][_0x3ac4ce(0x215)](this);},Scene_Skill[_0x42a407(0x35e)]['mainCommandWidth']=function(){const _0x57a229=_0x42a407;return VisuMZ[_0x57a229(0x354)][_0x57a229(0x4c4)][_0x57a229(0x3ca)]['CmdWidth']??Scene_MenuBase[_0x57a229(0x35e)][_0x57a229(0x38a)][_0x57a229(0x215)](this);},Scene_Skill[_0x42a407(0x35e)]['skillTypeWindowRectSkillsStatesCore']=function(){const _0x42e7c6=_0x42a407,_0x248a39=this[_0x42e7c6(0x38a)](),_0x810ff9=this[_0x42e7c6(0x497)](0x3,!![]),_0x521ea6=this[_0x42e7c6(0x2c4)]()?Graphics[_0x42e7c6(0x494)]-_0x248a39:0x0,_0xa949e3=this[_0x42e7c6(0x412)]();return new Rectangle(_0x521ea6,_0xa949e3,_0x248a39,_0x810ff9);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x3a6)]=Scene_Skill['prototype'][_0x42a407(0x3aa)],Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x3aa)]=function(){const _0x41aa2c=_0x42a407;return this[_0x41aa2c(0x2ba)]()?this[_0x41aa2c(0x384)]():VisuMZ[_0x41aa2c(0x354)]['Scene_Skill_statusWindowRect'][_0x41aa2c(0x215)](this);},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x384)]=function(){const _0x2ef8e8=_0x42a407,_0x11c378=Graphics[_0x2ef8e8(0x494)]-this[_0x2ef8e8(0x38a)](),_0xed016=this[_0x2ef8e8(0x3d6)][_0x2ef8e8(0x341)],_0x175aa5=this[_0x2ef8e8(0x2c4)]()?0x0:Graphics[_0x2ef8e8(0x494)]-_0x11c378,_0x5cffc3=this[_0x2ef8e8(0x412)]();return new Rectangle(_0x175aa5,_0x5cffc3,_0x11c378,_0xed016);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x220)]=Scene_Skill[_0x42a407(0x35e)]['createItemWindow'],Scene_Skill['prototype'][_0x42a407(0x22c)]=function(){const _0x5922b6=_0x42a407;VisuMZ[_0x5922b6(0x354)]['Scene_Skill_createItemWindow'][_0x5922b6(0x215)](this),this[_0x5922b6(0x368)]()&&this[_0x5922b6(0x315)]();},VisuMZ[_0x42a407(0x354)]['Scene_Skill_itemWindowRect']=Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x3fc)],Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x3fc)]=function(){const _0x358f6a=_0x42a407;if(this[_0x358f6a(0x2ba)]())return this['itemWindowRectSkillsStatesCore']();else{const _0x3e8988=VisuMZ[_0x358f6a(0x354)][_0x358f6a(0x4e9)][_0x358f6a(0x215)](this);return this[_0x358f6a(0x368)]()&&this[_0x358f6a(0x366)]()&&(_0x3e8988[_0x358f6a(0x4c6)]-=this['shopStatusWidth']()),_0x3e8988;}},Scene_Skill[_0x42a407(0x35e)]['itemWindowRectSkillsStatesCore']=function(){const _0xa16e8b=_0x42a407,_0x478f65=Graphics[_0xa16e8b(0x494)]-this[_0xa16e8b(0x25a)](),_0x45f0b9=this['mainAreaHeight']()-this['_statusWindow'][_0xa16e8b(0x341)],_0x491b46=this[_0xa16e8b(0x2c4)]()?Graphics['boxWidth']-_0x478f65:0x0,_0x5d2555=this[_0xa16e8b(0x2b1)]['y']+this[_0xa16e8b(0x2b1)][_0xa16e8b(0x341)];return new Rectangle(_0x491b46,_0x5d2555,_0x478f65,_0x45f0b9);},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x368)]=function(){const _0x1db13b=_0x42a407;if(!Imported['VisuMZ_1_ItemsEquipsCore'])return![];else return this[_0x1db13b(0x2ba)]()?!![]:VisuMZ[_0x1db13b(0x354)][_0x1db13b(0x4c4)][_0x1db13b(0x3ca)][_0x1db13b(0x304)];},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x366)]=function(){const _0x55c0ca=_0x42a407;return VisuMZ[_0x55c0ca(0x354)][_0x55c0ca(0x4c4)][_0x55c0ca(0x3ca)][_0x55c0ca(0x258)];},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x315)]=function(){const _0x7a246e=_0x42a407,_0x4123db=this[_0x7a246e(0x460)]();this[_0x7a246e(0x43b)]=new Window_ShopStatus(_0x4123db),this[_0x7a246e(0x214)](this[_0x7a246e(0x43b)]),this[_0x7a246e(0x229)][_0x7a246e(0x4d0)](this['_shopStatusWindow']);const _0x2fa7de=VisuMZ[_0x7a246e(0x354)]['Settings'][_0x7a246e(0x3ca)][_0x7a246e(0x49e)];this['_shopStatusWindow'][_0x7a246e(0x340)](_0x2fa7de||0x0);},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x460)]=function(){const _0x50ed10=_0x42a407;return this['isUseSkillsStatesCoreUpdatedLayout']()?this[_0x50ed10(0x30f)]():VisuMZ[_0x50ed10(0x354)][_0x50ed10(0x4c4)][_0x50ed10(0x3ca)][_0x50ed10(0x332)]['call'](this);},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x30f)]=function(){const _0x29cc24=_0x42a407,_0x5ed8a9=this[_0x29cc24(0x25a)](),_0x41e96b=this['_itemWindow']['height'],_0x93450f=this[_0x29cc24(0x2c4)]()?0x0:Graphics['boxWidth']-this[_0x29cc24(0x25a)](),_0x54eb88=this[_0x29cc24(0x229)]['y'];return new Rectangle(_0x93450f,_0x54eb88,_0x5ed8a9,_0x41e96b);},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x25a)]=function(){const _0x441df4=_0x42a407;return Imported[_0x441df4(0x4ca)]?Scene_Shop[_0x441df4(0x35e)][_0x441df4(0x4db)]():0x0;},Scene_Skill[_0x42a407(0x35e)][_0x42a407(0x2e2)]=function(){const _0x4e607d=_0x42a407;return this['_skillTypeWindow']&&this[_0x4e607d(0x3d6)][_0x4e607d(0x40e)]?TextManager[_0x4e607d(0x443)]:'';},VisuMZ[_0x42a407(0x354)][_0x42a407(0x4ae)]=Scene_Skill[_0x42a407(0x35e)]['onItemOk'],Scene_Skill['prototype'][_0x42a407(0x1ef)]=function(){const _0x23eb2d=_0x42a407,_0x3f46af=this['item']();DataManager[_0x23eb2d(0x442)](_0x3f46af)?this['onSkillToggle']():VisuMZ[_0x23eb2d(0x354)][_0x23eb2d(0x4ae)][_0x23eb2d(0x215)](this);},Scene_Skill['prototype']['onSkillToggle']=function(){const _0x1eb4e=_0x42a407;SoundManager[_0x1eb4e(0x36e)]();const _0x434b22=this[_0x1eb4e(0x2eb)](),_0x459453=this[_0x1eb4e(0x465)]()[_0x1eb4e(0x2ac)](_0x434b22);if(!_0x459453)this['actor']()[_0x1eb4e(0x238)](_0x434b22);this[_0x1eb4e(0x465)]()['setSkillToggle'](_0x434b22,!_0x459453),this['_itemWindow']['refresh'](),this['_itemWindow']['activate']();if(this[_0x1eb4e(0x2b1)])this[_0x1eb4e(0x2b1)]['refresh']();},VisuMZ['SkillsStatesCore']['Scene_Battle_onSkillOk_Toggle']=Scene_Battle[_0x42a407(0x35e)][_0x42a407(0x2cc)],Scene_Battle[_0x42a407(0x35e)][_0x42a407(0x2cc)]=function(){const _0x129aac=_0x42a407,_0x40457a=this['_skillWindow'][_0x129aac(0x2eb)]();DataManager[_0x129aac(0x442)](_0x40457a)?this[_0x129aac(0x29a)]():VisuMZ[_0x129aac(0x354)][_0x129aac(0x3c9)]['call'](this);},Scene_Battle['prototype']['onSkillToggle']=function(){const _0x40f107=_0x42a407;SoundManager[_0x40f107(0x36e)]();const _0x9c9330=this[_0x40f107(0x2a9)]['item'](),_0x56066b=BattleManager[_0x40f107(0x465)](),_0x18768d=_0x56066b[_0x40f107(0x2ac)](_0x9c9330);if(!_0x18768d)_0x56066b[_0x40f107(0x238)](_0x9c9330);_0x56066b[_0x40f107(0x360)](_0x9c9330,!_0x18768d);if(Imported['VisuMZ_0_CoreEngine']){let _0xf2029c=0x0;_0x56066b['isSkillToggled'](_0x9c9330)?_0x9c9330['note']['match'](/<TOGGLE ON (?:ANI|ANIMATION):[ ](\d+)>/i)?_0xf2029c=Number(RegExp['$1']):_0xf2029c=_0x9c9330[_0x40f107(0x22a)]||0x0:_0x9c9330['note']['match'](/<TOGGLE OFF (?:ANI|ANIMATION):[ ](\d+)>/i)?_0xf2029c=Number(RegExp['$1']):_0xf2029c=VisuMZ[_0x40f107(0x354)][_0x40f107(0x4c4)]['Toggles'][_0x40f107(0x282)]??0x0,_0xf2029c>0x0&&$gameTemp[_0x40f107(0x210)]([_0x56066b],_0xf2029c,![],![]);}this[_0x40f107(0x2a9)][_0x40f107(0x503)](),this[_0x40f107(0x2a9)][_0x40f107(0x3b7)]();if(this[_0x40f107(0x2b1)])this[_0x40f107(0x2b1)][_0x40f107(0x503)]();},VisuMZ[_0x42a407(0x354)][_0x42a407(0x4dc)]=Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x3c5)],Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x3c5)]=function(){const _0xaacadc=_0x42a407;VisuMZ[_0xaacadc(0x354)][_0xaacadc(0x4dc)][_0xaacadc(0x215)](this),this[_0xaacadc(0x501)]=null;},VisuMZ[_0x42a407(0x354)]['Sprite_Gauge_setup']=Sprite_Gauge[_0x42a407(0x35e)]['setup'],Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x264)]=function(_0x1356ea,_0x272a67){const _0x2cba15=_0x42a407;this[_0x2cba15(0x1e4)](_0x1356ea,_0x272a67),_0x272a67=_0x272a67[_0x2cba15(0x23f)](),VisuMZ[_0x2cba15(0x354)]['Sprite_Gauge_setup'][_0x2cba15(0x215)](this,_0x1356ea,_0x272a67);},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x1e4)]=function(_0x5ac2c1,_0x997e17){const _0x5a3e1b=_0x42a407,_0x40041f=VisuMZ[_0x5a3e1b(0x354)]['Settings'][_0x5a3e1b(0x38e)][_0x5a3e1b(0x474)](_0x262265=>_0x262265[_0x5a3e1b(0x316)][_0x5a3e1b(0x308)]()===_0x997e17['toUpperCase']());_0x40041f['length']>=0x1?this[_0x5a3e1b(0x501)]=_0x40041f[0x0]:this[_0x5a3e1b(0x501)]=null;},VisuMZ[_0x42a407(0x354)]['Sprite_Gauge_currentValue']=Sprite_Gauge['prototype'][_0x42a407(0x4c9)],Sprite_Gauge[_0x42a407(0x35e)]['currentValue']=function(){const _0x4f35e3=_0x42a407;return this['_battler']&&this[_0x4f35e3(0x501)]?this[_0x4f35e3(0x3fd)]():VisuMZ[_0x4f35e3(0x354)][_0x4f35e3(0x275)][_0x4f35e3(0x215)](this);},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x3fd)]=function(){const _0x2c0da6=_0x42a407;return this[_0x2c0da6(0x501)][_0x2c0da6(0x4eb)][_0x2c0da6(0x215)](this['_battler']);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x255)]=Sprite_Gauge['prototype'][_0x42a407(0x248)],Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x248)]=function(){const _0x2b87bb=_0x42a407;return this[_0x2b87bb(0x4a8)]&&this['_costSettings']?this['currentMaxValueSkillsStatesCore']():VisuMZ['SkillsStatesCore'][_0x2b87bb(0x255)][_0x2b87bb(0x215)](this);},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x4d9)]=function(){const _0x391ac1=_0x42a407;return this['_costSettings'][_0x391ac1(0x1d5)]['call'](this['_battler']);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x4bb)]=Sprite_Gauge['prototype'][_0x42a407(0x454)],Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x454)]=function(){const _0x4d07aa=_0x42a407,_0x48624c=VisuMZ[_0x4d07aa(0x354)][_0x4d07aa(0x4bb)][_0x4d07aa(0x215)](this);return _0x48624c['clamp'](0x0,0x1);},VisuMZ[_0x42a407(0x354)]['Sprite_Gauge_redraw']=Sprite_Gauge[_0x42a407(0x35e)]['redraw'],Sprite_Gauge['prototype']['redraw']=function(){const _0x18e106=_0x42a407;this['_battler']&&this[_0x18e106(0x501)]?(this[_0x18e106(0x475)][_0x18e106(0x363)](),this[_0x18e106(0x253)]()):VisuMZ[_0x18e106(0x354)][_0x18e106(0x500)][_0x18e106(0x215)](this);},Sprite_Gauge['prototype'][_0x42a407(0x1f8)]=function(){const _0x1009db=_0x42a407;let _0xad4c83=this['currentValue']();return Imported[_0x1009db(0x26c)]&&this[_0x1009db(0x3c7)]()&&(_0xad4c83=VisuMZ[_0x1009db(0x4c1)](_0xad4c83)),_0xad4c83;},Sprite_Gauge[_0x42a407(0x35e)]['redrawSkillsStatesCore']=function(){const _0x37853a=_0x42a407;this[_0x37853a(0x475)][_0x37853a(0x363)](),this['_costSettings'][_0x37853a(0x414)][_0x37853a(0x215)](this);},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x32a)]=function(_0x3fff83,_0x157802,_0x32ce87,_0x265a43,_0x3f652f,_0x2dced8){const _0x82379e=_0x42a407,_0x501c7d=this[_0x82379e(0x454)](),_0x348a9a=Math[_0x82379e(0x2ed)]((_0x3f652f-0x2)*_0x501c7d),_0x50479b=_0x2dced8-0x2,_0x1d0725=this[_0x82379e(0x2cb)]();this[_0x82379e(0x475)]['fillRect'](_0x32ce87,_0x265a43,_0x3f652f,_0x2dced8,_0x1d0725),this[_0x82379e(0x475)][_0x82379e(0x3ec)](_0x32ce87+0x1,_0x265a43+0x1,_0x348a9a,_0x50479b,_0x3fff83,_0x157802);},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x30b)]=function(){const _0x2713bc=_0x42a407,_0x3db14b=VisuMZ['SkillsStatesCore'][_0x2713bc(0x4c4)]['Gauge'];return _0x3db14b['LabelFontMainType']===_0x2713bc(0x47a)?$gameSystem[_0x2713bc(0x318)]():$gameSystem[_0x2713bc(0x488)]();},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x4fd)]=function(){const _0x300f98=_0x42a407,_0x14da77=VisuMZ[_0x300f98(0x354)][_0x300f98(0x4c4)][_0x300f98(0x42d)];return _0x14da77[_0x300f98(0x1e0)]===_0x300f98(0x47a)?$gameSystem[_0x300f98(0x30d)]()-0x6:$gameSystem['mainFontSize']()-0x2;},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x39a)]=function(){const _0x306605=_0x42a407,_0x4803e1=VisuMZ['SkillsStatesCore'][_0x306605(0x4c4)][_0x306605(0x42d)];return _0x4803e1['ValueFontMainType']===_0x306605(0x47a)?$gameSystem['numberFontFace']():$gameSystem[_0x306605(0x488)]();},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x207)]=function(){const _0x538ef4=_0x42a407,_0x2e3359=VisuMZ['SkillsStatesCore'][_0x538ef4(0x4c4)][_0x538ef4(0x42d)];return _0x2e3359[_0x538ef4(0x32d)]===_0x538ef4(0x47a)?$gameSystem['mainFontSize']()-0x6:$gameSystem[_0x538ef4(0x30d)]()-0x2;},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x373)]=function(){const _0x1bb70f=_0x42a407,_0x2cb44c=VisuMZ[_0x1bb70f(0x354)][_0x1bb70f(0x4c4)]['Gauge'];if(_0x2cb44c[_0x1bb70f(0x4ac)]){if(_0x2cb44c[_0x1bb70f(0x419)]===0x1)return this['gaugeColor1']();else{if(_0x2cb44c['MatchLabelGaugeColor']===0x2)return this[_0x1bb70f(0x489)]();}}const _0x5aa407=_0x2cb44c['PresetLabelGaugeColor'];return ColorManager[_0x1bb70f(0x3e6)](_0x5aa407);},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x1e8)]=function(){const _0x39ce90=_0x42a407,_0x111dc9=VisuMZ[_0x39ce90(0x354)][_0x39ce90(0x4c4)][_0x39ce90(0x42d)];if(this[_0x39ce90(0x2d1)]()<=0x0)return _0x39ce90(0x466);else return _0x111dc9[_0x39ce90(0x4f2)]?_0x39ce90(0x26b):ColorManager['outlineColor']();},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x2d1)]=function(){const _0x547587=_0x42a407;return VisuMZ[_0x547587(0x354)]['Settings']['Gauge'][_0x547587(0x3db)]||0x0;},Sprite_Gauge[_0x42a407(0x35e)][_0x42a407(0x3d0)]=function(){const _0x2d48d9=_0x42a407,_0x18c195=VisuMZ[_0x2d48d9(0x354)]['Settings']['Gauge'];if(this[_0x2d48d9(0x2a7)]()<=0x0)return'rgba(0,\x200,\x200,\x200)';else return _0x18c195[_0x2d48d9(0x244)]?_0x2d48d9(0x26b):ColorManager['outlineColor']();},Sprite_Gauge['prototype'][_0x42a407(0x2a7)]=function(){const _0x3fa081=_0x42a407;return VisuMZ[_0x3fa081(0x354)]['Settings'][_0x3fa081(0x42d)][_0x3fa081(0x3b3)]||0x0;},VisuMZ['SkillsStatesCore'][_0x42a407(0x424)]=Sprite_StateIcon[_0x42a407(0x35e)][_0x42a407(0x23a)],Sprite_StateIcon[_0x42a407(0x35e)]['loadBitmap']=function(){const _0x263cbf=_0x42a407;VisuMZ[_0x263cbf(0x354)][_0x263cbf(0x424)][_0x263cbf(0x215)](this),this[_0x263cbf(0x31b)]();},Sprite_StateIcon['prototype'][_0x42a407(0x31b)]=function(){const _0x409924=_0x42a407,_0x5def57=Window_Base['prototype'][_0x409924(0x291)]();this['_turnDisplaySprite']=new Sprite(),this['_turnDisplaySprite'][_0x409924(0x475)]=new Bitmap(ImageManager['iconWidth'],_0x5def57),this[_0x409924(0x1f7)]['anchor']['x']=this[_0x409924(0x49f)]['x'],this[_0x409924(0x1f7)][_0x409924(0x49f)]['y']=this['anchor']['y'],this[_0x409924(0x4cd)](this[_0x409924(0x1f7)]),this['contents']=this[_0x409924(0x1f7)][_0x409924(0x475)];},VisuMZ[_0x42a407(0x354)]['Sprite_StateIcon_updateFrame']=Sprite_StateIcon[_0x42a407(0x35e)][_0x42a407(0x41d)],Sprite_StateIcon['prototype']['updateFrame']=function(){const _0x4ab6d1=_0x42a407;VisuMZ['SkillsStatesCore'][_0x4ab6d1(0x357)][_0x4ab6d1(0x215)](this),this['updateTurnDisplaySprite']();},Sprite_StateIcon[_0x42a407(0x35e)][_0x42a407(0x393)]=function(_0x52fc3e,_0x4c6117,_0x95a9d2,_0x5b37b9,_0x581914){const _0x297a0a=_0x42a407;this[_0x297a0a(0x4f3)]['drawText'](_0x52fc3e,_0x4c6117,_0x95a9d2,_0x5b37b9,this[_0x297a0a(0x4f3)][_0x297a0a(0x341)],_0x581914);},Sprite_StateIcon[_0x42a407(0x35e)][_0x42a407(0x203)]=function(){const _0x6de795=_0x42a407;this['resetFontSettings'](),this[_0x6de795(0x4f3)][_0x6de795(0x363)]();const _0x108649=this['_battler'];if(!_0x108649)return;const _0x8dd934=_0x108649[_0x6de795(0x374)]()[_0x6de795(0x474)](_0x2b33a7=>_0x2b33a7[_0x6de795(0x34a)]>0x0),_0x2342cc=[...Array(0x8)[_0x6de795(0x3e7)]()][_0x6de795(0x474)](_0x431593=>_0x108649[_0x6de795(0x462)](_0x431593)!==0x0),_0x476c14=this[_0x6de795(0x1da)],_0xa3650a=_0x8dd934[_0x476c14];if(_0xa3650a)Window_Base['prototype']['drawActorStateTurns'][_0x6de795(0x215)](this,_0x108649,_0xa3650a,0x0,0x0),Window_Base[_0x6de795(0x35e)][_0x6de795(0x269)][_0x6de795(0x215)](this,_0x108649,_0xa3650a,0x0,0x0);else{const _0x4077c2=_0x2342cc[_0x476c14-_0x8dd934[_0x6de795(0x247)]];if(_0x4077c2===undefined)return;Window_Base['prototype']['drawActorBuffTurns'][_0x6de795(0x215)](this,_0x108649,_0x4077c2,0x0,0x0),Window_Base[_0x6de795(0x35e)][_0x6de795(0x246)][_0x6de795(0x215)](this,_0x108649,_0x4077c2,0x0,0x0);}},Sprite_StateIcon[_0x42a407(0x35e)][_0x42a407(0x4c8)]=function(){const _0xbad2f9=_0x42a407;this[_0xbad2f9(0x4f3)][_0xbad2f9(0x35b)]=$gameSystem[_0xbad2f9(0x488)](),this[_0xbad2f9(0x4f3)]['fontSize']=$gameSystem[_0xbad2f9(0x30d)](),this[_0xbad2f9(0x4d3)]();},Sprite_StateIcon['prototype'][_0x42a407(0x4d3)]=function(){const _0xbfac6d=_0x42a407;this[_0xbfac6d(0x34f)](ColorManager['normalColor']()),this[_0xbfac6d(0x482)](ColorManager['outlineColor']());},Sprite_StateIcon[_0x42a407(0x35e)]['changeTextColor']=function(_0x12afc6){const _0x3be197=_0x42a407;this[_0x3be197(0x4f3)]['textColor']=_0x12afc6;},Sprite_StateIcon[_0x42a407(0x35e)][_0x42a407(0x482)]=function(_0x33d7d0){const _0x1def47=_0x42a407;this['contents'][_0x1def47(0x4c5)]=_0x33d7d0;},Sprite_StateIcon['prototype'][_0x42a407(0x2ad)]=function(){const _0x48943e=_0x42a407;this[_0x48943e(0x35a)]=!![],this[_0x48943e(0x1dc)]();},Window_Base['prototype'][_0x42a407(0x41f)]=function(_0x13aafb,_0x5a1d19,_0x15eab8,_0x481149,_0x236771){const _0x4df1a1=_0x42a407,_0x119730=this[_0x4df1a1(0x1ff)](_0x13aafb,_0x5a1d19),_0x45bebb=this[_0x4df1a1(0x2b8)](_0x119730,_0x15eab8,_0x481149,_0x236771),_0x341e3e=_0x15eab8+_0x236771-_0x45bebb[_0x4df1a1(0x4c6)];this[_0x4df1a1(0x26d)](_0x119730,_0x341e3e,_0x481149,_0x236771),this[_0x4df1a1(0x4c8)]();},Window_Base[_0x42a407(0x35e)][_0x42a407(0x1ff)]=function(_0x74396b,_0x16be06){const _0x4b1c56=_0x42a407;let _0x319e1e='';for(settings of VisuMZ[_0x4b1c56(0x354)][_0x4b1c56(0x4c4)][_0x4b1c56(0x38e)]){if(!this[_0x4b1c56(0x250)](_0x74396b,_0x16be06,settings))continue;if(_0x319e1e[_0x4b1c56(0x247)]>0x0)_0x319e1e+=this[_0x4b1c56(0x2c8)]();_0x319e1e+=this['createSkillCostText'](_0x74396b,_0x16be06,settings);}_0x319e1e=this['makeAdditionalSkillCostText'](_0x74396b,_0x16be06,_0x319e1e);if(_0x16be06[_0x4b1c56(0x382)][_0x4b1c56(0x2f9)](/<CUSTOM COST TEXT>\s*([\s\S]*)\s*<\/CUSTOM COST TEXT>/i)){if(_0x319e1e[_0x4b1c56(0x247)]>0x0)_0x319e1e+=this['skillCostSeparator']();_0x319e1e+=String(RegExp['$1']);}return _0x319e1e;},Window_Base[_0x42a407(0x35e)][_0x42a407(0x37a)]=function(_0x5a0176,_0x5e2d85,_0x49302b){return _0x49302b;},Window_Base[_0x42a407(0x35e)][_0x42a407(0x250)]=function(_0x2a6f2e,_0x11c2fc,_0x3a88f6){const _0xe98fad=_0x42a407;let _0x58eda1=_0x3a88f6[_0xe98fad(0x432)][_0xe98fad(0x215)](_0x2a6f2e,_0x11c2fc);return _0x58eda1=_0x2a6f2e[_0xe98fad(0x413)](_0x11c2fc,_0x58eda1,_0x3a88f6),_0x3a88f6[_0xe98fad(0x3a2)]['call'](_0x2a6f2e,_0x11c2fc,_0x58eda1,_0x3a88f6);},Window_Base[_0x42a407(0x35e)]['createSkillCostText']=function(_0x39110f,_0x5e9317,_0x543ec6){const _0x29a3f4=_0x42a407;let _0x596c7e=_0x543ec6[_0x29a3f4(0x432)][_0x29a3f4(0x215)](_0x39110f,_0x5e9317);return _0x596c7e=_0x39110f[_0x29a3f4(0x413)](_0x5e9317,_0x596c7e,_0x543ec6),_0x543ec6[_0x29a3f4(0x4fb)][_0x29a3f4(0x215)](_0x39110f,_0x5e9317,_0x596c7e,_0x543ec6);},Window_Base[_0x42a407(0x35e)][_0x42a407(0x2c8)]=function(){return'\x20';},Window_Base[_0x42a407(0x35e)]['drawActorIcons']=function(_0x36a48b,_0x1937b8,_0x2fd20f,_0x3f3b10){const _0x1fd59c=_0x42a407;if(!_0x36a48b)return;VisuMZ['SkillsStatesCore'][_0x1fd59c(0x1dd)][_0x1fd59c(0x215)](this,_0x36a48b,_0x1937b8,_0x2fd20f,_0x3f3b10),this['drawActorIconsAllTurnCounters'](_0x36a48b,_0x1937b8,_0x2fd20f,_0x3f3b10);},Window_Base[_0x42a407(0x35e)][_0x42a407(0x476)]=function(_0x17f29b,_0x22db80,_0x1e5534,_0x21c112){const _0x24f0ef=_0x42a407;_0x21c112=_0x21c112||0x90;const _0x4e3fc5=ImageManager[_0x24f0ef(0x30e)]||0x20,_0x5b3449=ImageManager[_0x24f0ef(0x402)]||0x20,_0x547c3b=_0x4e3fc5,_0x50693e=_0x17f29b[_0x24f0ef(0x3f2)]()[_0x24f0ef(0x326)](0x0,Math['floor'](_0x21c112/_0x547c3b)),_0x389247=_0x17f29b[_0x24f0ef(0x374)]()[_0x24f0ef(0x474)](_0x521192=>_0x521192[_0x24f0ef(0x34a)]>0x0),_0x2d6f03=[...Array(0x8)[_0x24f0ef(0x3e7)]()]['filter'](_0x416d86=>_0x17f29b['buff'](_0x416d86)!==0x0),_0x5716aa=[];let _0x4eb73e=_0x22db80;for(let _0x5b5711=0x0;_0x5b5711<_0x50693e[_0x24f0ef(0x247)];_0x5b5711++){this[_0x24f0ef(0x4c8)]();const _0x1f7bfd=_0x389247[_0x5b5711];if(_0x1f7bfd)!_0x5716aa[_0x24f0ef(0x33a)](_0x1f7bfd)&&this[_0x24f0ef(0x325)](_0x17f29b,_0x1f7bfd,_0x4eb73e,_0x1e5534),this['drawActorStateData'](_0x17f29b,_0x1f7bfd,_0x4eb73e,_0x1e5534),_0x5716aa[_0x24f0ef(0x1e7)](_0x1f7bfd);else{const _0x2013a2=_0x2d6f03[_0x5b5711-_0x389247[_0x24f0ef(0x247)]];this[_0x24f0ef(0x487)](_0x17f29b,_0x2013a2,_0x4eb73e,_0x1e5534),this[_0x24f0ef(0x246)](_0x17f29b,_0x2013a2,_0x4eb73e,_0x1e5534);}_0x4eb73e+=_0x547c3b;}},Window_Base[_0x42a407(0x35e)]['drawActorStateTurns']=function(_0x228321,_0x399466,_0x5c83b1,_0x2eb422){const _0x443070=_0x42a407;if(!VisuMZ[_0x443070(0x354)]['Settings'][_0x443070(0x42b)][_0x443070(0x1f0)])return;if(!_0x228321[_0x443070(0x3c6)](_0x399466['id']))return;if(_0x399466[_0x443070(0x20a)]===0x0)return;if(_0x399466[_0x443070(0x382)][_0x443070(0x2f9)](/<HIDE STATE TURNS>/i))return;const _0x1a8610=ImageManager['standardIconWidth']||0x20,_0x11cfbb=_0x1a8610,_0x2eb98b=_0x228321['stateTurns'](_0x399466['id']),_0x1ee087=ColorManager[_0x443070(0x348)](_0x399466);this[_0x443070(0x34f)](_0x1ee087),this[_0x443070(0x482)]('rgba(0,\x200,\x200,\x201)'),this[_0x443070(0x4f3)][_0x443070(0x2b4)]=!![],this[_0x443070(0x4f3)][_0x443070(0x45a)]=VisuMZ[_0x443070(0x354)][_0x443070(0x4c4)][_0x443070(0x42b)][_0x443070(0x31e)],_0x5c83b1+=VisuMZ['SkillsStatesCore']['Settings']['States']['TurnOffsetX'],_0x2eb422+=VisuMZ[_0x443070(0x354)]['Settings'][_0x443070(0x42b)][_0x443070(0x2b9)],this['drawText'](_0x2eb98b,_0x5c83b1,_0x2eb422,_0x11cfbb,'right'),this[_0x443070(0x4f3)][_0x443070(0x2b4)]=![],this[_0x443070(0x4c8)]();},Window_Base[_0x42a407(0x35e)][_0x42a407(0x269)]=function(_0x2bb4de,_0x577449,_0x16a4d1,_0x171dbf){const _0x577582=_0x42a407;if(!VisuMZ['SkillsStatesCore'][_0x577582(0x4c4)]['States']['ShowData'])return;const _0x2a9157=ImageManager['standardIconWidth']||0x20,_0x39222d=ImageManager[_0x577582(0x402)]||0x20,_0x3bdd8b=_0x2a9157,_0x2e6a2c=_0x39222d/0x2,_0x44f350=ColorManager[_0x577582(0x313)]();this[_0x577582(0x34f)](_0x44f350),this[_0x577582(0x482)]('rgba(0,\x200,\x200,\x201)'),this[_0x577582(0x4f3)][_0x577582(0x2b4)]=!![],this[_0x577582(0x4f3)]['fontSize']=VisuMZ['SkillsStatesCore'][_0x577582(0x4c4)][_0x577582(0x42b)][_0x577582(0x322)],_0x16a4d1+=VisuMZ['SkillsStatesCore'][_0x577582(0x4c4)][_0x577582(0x42b)]['DataOffsetX'],_0x171dbf+=VisuMZ[_0x577582(0x354)][_0x577582(0x4c4)]['States'][_0x577582(0x20d)];const _0x211e1f=String(_0x2bb4de[_0x577582(0x3fe)](_0x577449['id']));this['drawText'](_0x211e1f,_0x16a4d1,_0x171dbf,_0x3bdd8b,_0x577582(0x48c)),this[_0x577582(0x4f3)]['fontBold']=![],this[_0x577582(0x4c8)]();},Window_Base[_0x42a407(0x35e)]['drawActorBuffTurns']=function(_0x3578d5,_0x4414ca,_0x12e4da,_0x203dcd){const _0x49b65a=_0x42a407;if(!VisuMZ['SkillsStatesCore']['Settings'][_0x49b65a(0x48e)][_0x49b65a(0x1f0)])return;const _0x17202c=_0x3578d5[_0x49b65a(0x462)](_0x4414ca);if(_0x17202c===0x0)return;const _0xe6ae84=_0x3578d5['buffTurns'](_0x4414ca),_0x44b643=ImageManager[_0x49b65a(0x328)],_0x5e4296=_0x17202c>0x0?ColorManager[_0x49b65a(0x24d)]():ColorManager[_0x49b65a(0x2db)]();this[_0x49b65a(0x34f)](_0x5e4296),this[_0x49b65a(0x482)]('rgba(0,\x200,\x200,\x201)'),this[_0x49b65a(0x4f3)]['fontBold']=!![],this['contents'][_0x49b65a(0x45a)]=VisuMZ[_0x49b65a(0x354)][_0x49b65a(0x4c4)][_0x49b65a(0x48e)]['TurnFontSize'],_0x12e4da+=VisuMZ['SkillsStatesCore'][_0x49b65a(0x4c4)][_0x49b65a(0x48e)][_0x49b65a(0x268)],_0x203dcd+=VisuMZ['SkillsStatesCore'][_0x49b65a(0x4c4)]['Buffs'][_0x49b65a(0x2b9)],this[_0x49b65a(0x393)](_0xe6ae84,_0x12e4da,_0x203dcd,_0x44b643,_0x49b65a(0x2ea)),this[_0x49b65a(0x4f3)][_0x49b65a(0x2b4)]=![],this[_0x49b65a(0x4c8)]();},Window_Base['prototype'][_0x42a407(0x246)]=function(_0x329c6b,_0x56a10c,_0x33fb38,_0x2cf9db){const _0x26a365=_0x42a407;if(!VisuMZ['SkillsStatesCore'][_0x26a365(0x4c4)][_0x26a365(0x48e)][_0x26a365(0x3a3)])return;const _0x30bf31=_0x329c6b['paramBuffRate'](_0x56a10c),_0x2d6bca=_0x329c6b[_0x26a365(0x462)](_0x56a10c),_0x4ecb3c=ImageManager[_0x26a365(0x30e)]||0x20,_0x23c3c0=ImageManager[_0x26a365(0x402)]||0x20,_0x59065c=_0x4ecb3c,_0x4bfe9c=_0x23c3c0/0x2,_0x31f8c7=_0x2d6bca>0x0?ColorManager['buffColor']():ColorManager[_0x26a365(0x2db)]();this[_0x26a365(0x34f)](_0x31f8c7),this['changeOutlineColor'](_0x26a365(0x26b)),this['contents'][_0x26a365(0x2b4)]=!![],this[_0x26a365(0x4f3)]['fontSize']=VisuMZ[_0x26a365(0x354)][_0x26a365(0x4c4)][_0x26a365(0x48e)][_0x26a365(0x322)],_0x33fb38+=VisuMZ[_0x26a365(0x354)][_0x26a365(0x4c4)][_0x26a365(0x48e)][_0x26a365(0x42a)],_0x2cf9db+=VisuMZ[_0x26a365(0x354)][_0x26a365(0x4c4)][_0x26a365(0x48e)][_0x26a365(0x20d)];const _0x3bcc6b='%1%'['format'](Math[_0x26a365(0x4a2)](_0x30bf31*0x64));this[_0x26a365(0x393)](_0x3bcc6b,_0x33fb38,_0x2cf9db,_0x59065c,_0x26a365(0x48c)),this[_0x26a365(0x4f3)][_0x26a365(0x2b4)]=![],this[_0x26a365(0x4c8)]();},VisuMZ[_0x42a407(0x354)]['Window_Base_changeTextColor']=Window_Base['prototype'][_0x42a407(0x34f)],Window_Base[_0x42a407(0x35e)][_0x42a407(0x34f)]=function(_0x1bff7f){const _0x29fea8=_0x42a407;this[_0x29fea8(0x1fd)]&&(_0x1bff7f=ColorManager['getColor'](VisuMZ[_0x29fea8(0x354)][_0x29fea8(0x4c4)][_0x29fea8(0x303)][_0x29fea8(0x251)]??0x0)),VisuMZ[_0x29fea8(0x354)][_0x29fea8(0x1f3)][_0x29fea8(0x215)](this,_0x1bff7f);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x372)]=Window_Base[_0x42a407(0x35e)][_0x42a407(0x393)],Window_Base[_0x42a407(0x35e)]['drawText']=function(_0x471840,_0x165c43,_0x235cc0,_0x307314,_0x41b4fc){const _0x116798=_0x42a407;VisuMZ[_0x116798(0x354)][_0x116798(0x372)][_0x116798(0x215)](this,_0x471840,_0x165c43,_0x235cc0,_0x307314,_0x41b4fc),this[_0x116798(0x1fd)]=undefined;},VisuMZ[_0x42a407(0x354)]['Window_Base_createAllSkillCostText_Toggle']=Window_Base['prototype'][_0x42a407(0x1ff)],Window_Base[_0x42a407(0x35e)]['createAllSkillCostText']=function(_0x2da8d4,_0x2fa81b){const _0x2f2dfb=_0x42a407;let _0x54107d=VisuMZ[_0x2f2dfb(0x354)][_0x2f2dfb(0x217)][_0x2f2dfb(0x215)](this,_0x2da8d4,_0x2fa81b);;return DataManager[_0x2f2dfb(0x442)](_0x2fa81b)&&_0x2da8d4&&(_0x2da8d4['isSkillToggled'](_0x2fa81b)?_0x54107d=TextManager[_0x2f2dfb(0x22e)]??_0x2f2dfb(0x440):(TextManager['toggleOffLocation']==='front'?_0x54107d=(TextManager[_0x2f2dfb(0x34b)]??_0x2f2dfb(0x3d1))+this[_0x2f2dfb(0x2c8)]()+_0x54107d:_0x54107d=_0x54107d+this[_0x2f2dfb(0x2c8)]()+(TextManager[_0x2f2dfb(0x34b)]??_0x2f2dfb(0x3d1)),_0x54107d=_0x54107d[_0x2f2dfb(0x45d)]())),_0x54107d;},VisuMZ[_0x42a407(0x354)]['Window_StatusBase_placeGauge']=Window_StatusBase[_0x42a407(0x35e)][_0x42a407(0x256)],Window_StatusBase[_0x42a407(0x35e)][_0x42a407(0x256)]=function(_0x569271,_0xcd5579,_0x5c3ac7,_0x477bea){const _0x171447=_0x42a407;if(_0x569271[_0x171447(0x29f)]())_0xcd5579=this['convertGaugeTypeSkillsStatesCore'](_0x569271,_0xcd5579);this[_0x171447(0x441)](_0x569271,_0xcd5579,_0x5c3ac7,_0x477bea);},Window_StatusBase[_0x42a407(0x35e)]['placeExactGauge']=function(_0x2e6ac0,_0x3da875,_0x2888b8,_0x596031){const _0x2c8128=_0x42a407;if(['none','untitled'][_0x2c8128(0x33a)](_0x3da875[_0x2c8128(0x23f)]()))return;VisuMZ[_0x2c8128(0x354)][_0x2c8128(0x418)][_0x2c8128(0x215)](this,_0x2e6ac0,_0x3da875,_0x2888b8,_0x596031);},Window_StatusBase[_0x42a407(0x35e)]['convertGaugeTypeSkillsStatesCore']=function(_0x170670,_0x3af72e){const _0x2eb38f=_0x42a407,_0x4b3f80=_0x170670[_0x2eb38f(0x290)]()[_0x2eb38f(0x382)];if(_0x3af72e==='hp'&&_0x4b3f80[_0x2eb38f(0x2f9)](/<REPLACE HP GAUGE:[ ](.*)>/i))return String(RegExp['$1']);else{if(_0x3af72e==='mp'&&_0x4b3f80[_0x2eb38f(0x2f9)](/<REPLACE MP GAUGE:[ ](.*)>/i))return String(RegExp['$1']);else return _0x3af72e==='tp'&&_0x4b3f80[_0x2eb38f(0x2f9)](/<REPLACE TP GAUGE:[ ](.*)>/i)?String(RegExp['$1']):_0x3af72e;}},VisuMZ[_0x42a407(0x354)][_0x42a407(0x1dd)]=Window_StatusBase['prototype'][_0x42a407(0x401)],Window_StatusBase['prototype'][_0x42a407(0x401)]=function(_0x15737e,_0x850a6e,_0x5a8249,_0x1002c1){const _0x141984=_0x42a407;if(!_0x15737e)return;Window_Base[_0x141984(0x35e)][_0x141984(0x401)][_0x141984(0x215)](this,_0x15737e,_0x850a6e,_0x5a8249,_0x1002c1);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x406)]=Window_SkillType[_0x42a407(0x35e)][_0x42a407(0x2d5)],Window_SkillType['prototype'][_0x42a407(0x2d5)]=function(_0x16970d){const _0x5cd386=_0x42a407;VisuMZ[_0x5cd386(0x354)][_0x5cd386(0x406)][_0x5cd386(0x215)](this,_0x16970d),this[_0x5cd386(0x404)](_0x16970d);},Window_SkillType['prototype'][_0x42a407(0x404)]=function(_0x5c876b){const _0x49e656=_0x42a407,_0x6c9629=new Rectangle(0x0,0x0,_0x5c876b[_0x49e656(0x4c6)],_0x5c876b[_0x49e656(0x341)]);this[_0x49e656(0x337)]=new Window_Base(_0x6c9629),this[_0x49e656(0x337)][_0x49e656(0x3a0)]=0x0,this[_0x49e656(0x4cd)](this['_commandNameWindow']),this['updateCommandNameWindow']();},Window_SkillType['prototype'][_0x42a407(0x41b)]=function(){const _0x19c137=_0x42a407;Window_Command[_0x19c137(0x35e)][_0x19c137(0x41b)][_0x19c137(0x215)](this);if(this[_0x19c137(0x337)])this['updateCommandNameWindow']();},Window_SkillType['prototype'][_0x42a407(0x3e5)]=function(){const _0x3690b2=_0x42a407,_0x519367=this[_0x3690b2(0x337)];_0x519367[_0x3690b2(0x4f3)][_0x3690b2(0x363)]();const _0x4e517a=this[_0x3690b2(0x2ff)](this[_0x3690b2(0x43c)]());if(_0x4e517a===_0x3690b2(0x2e6)&&this[_0x3690b2(0x1e1)]()>0x0){const _0x276da8=this['itemLineRect'](this[_0x3690b2(0x43c)]());let _0x4a33bc=this['commandName'](this[_0x3690b2(0x43c)]());_0x4a33bc=_0x4a33bc[_0x3690b2(0x300)](/\\I\[(\d+)\]/gi,''),_0x519367[_0x3690b2(0x4c8)](),this['commandNameWindowDrawBackground'](_0x4a33bc,_0x276da8),this[_0x3690b2(0x35c)](_0x4a33bc,_0x276da8),this[_0x3690b2(0x4f5)](_0x4a33bc,_0x276da8);}},Window_SkillType[_0x42a407(0x35e)]['commandNameWindowDrawBackground']=function(_0x25a4ed,_0x575a87){},Window_SkillType['prototype'][_0x42a407(0x35c)]=function(_0x37ce1b,_0x30113a){const _0x5980ff=_0x42a407,_0x28ed73=this[_0x5980ff(0x337)];_0x28ed73['drawText'](_0x37ce1b,0x0,_0x30113a['y'],_0x28ed73[_0x5980ff(0x47d)],'center');},Window_SkillType[_0x42a407(0x35e)][_0x42a407(0x4f5)]=function(_0x1fdf6e,_0x4a4121){const _0x2228ab=_0x42a407,_0x424755=this['_commandNameWindow'],_0xd80968=$gameSystem[_0x2228ab(0x4d5)](),_0x292592=_0x4a4121['x']+Math[_0x2228ab(0x2ed)](_0x4a4121[_0x2228ab(0x4c6)]/0x2)+_0xd80968;_0x424755['x']=_0x424755[_0x2228ab(0x4c6)]/-0x2+_0x292592,_0x424755['y']=Math[_0x2228ab(0x2ed)](_0x4a4121[_0x2228ab(0x341)]/0x2);},Window_SkillType['prototype'][_0x42a407(0x49a)]=function(){const _0x3a6bcc=_0x42a407;return Imported[_0x3a6bcc(0x26c)]&&Window_Command['prototype'][_0x3a6bcc(0x49a)][_0x3a6bcc(0x215)](this);},Window_SkillType['prototype'][_0x42a407(0x457)]=function(){const _0x4e36c0=_0x42a407;if(!this[_0x4e36c0(0x4fc)])return;const _0xbd3bd2=this[_0x4e36c0(0x4fc)][_0x4e36c0(0x38f)]();for(const _0x37674d of _0xbd3bd2){const _0x161e11=this[_0x4e36c0(0x3a8)](_0x37674d);this[_0x4e36c0(0x204)](_0x161e11,_0x4e36c0(0x355),!![],_0x37674d);}},Window_SkillType[_0x42a407(0x35e)][_0x42a407(0x3a8)]=function(_0x5c7373){const _0x2b5b10=_0x42a407;let _0x2131a2=$dataSystem[_0x2b5b10(0x38f)][_0x5c7373];if(_0x2131a2['match'](/\\I\[(\d+)\]/i))return _0x2131a2;if(this['commandStyle']()===_0x2b5b10(0x2c5))return _0x2131a2;const _0x25d524=VisuMZ['SkillsStatesCore'][_0x2b5b10(0x4c4)][_0x2b5b10(0x3ca)],_0x1c8ee6=$dataSystem[_0x2b5b10(0x3ed)][_0x2b5b10(0x33a)](_0x5c7373),_0x425f7d=_0x1c8ee6?_0x25d524[_0x2b5b10(0x3f6)]:_0x25d524[_0x2b5b10(0x4b6)];return _0x2b5b10(0x342)[_0x2b5b10(0x311)](_0x425f7d,_0x2131a2);},Window_SkillType['prototype'][_0x42a407(0x3b5)]=function(){const _0x16e853=_0x42a407;return VisuMZ[_0x16e853(0x354)]['Settings'][_0x16e853(0x3ca)][_0x16e853(0x478)];},Window_SkillType[_0x42a407(0x35e)][_0x42a407(0x422)]=function(_0x39172e){const _0x5c8ed2=_0x42a407,_0x4c48e5=this[_0x5c8ed2(0x2ff)](_0x39172e);if(_0x4c48e5===_0x5c8ed2(0x380))this[_0x5c8ed2(0x249)](_0x39172e);else _0x4c48e5===_0x5c8ed2(0x2e6)?this[_0x5c8ed2(0x486)](_0x39172e):Window_Command[_0x5c8ed2(0x35e)][_0x5c8ed2(0x422)][_0x5c8ed2(0x215)](this,_0x39172e);},Window_SkillType[_0x42a407(0x35e)][_0x42a407(0x243)]=function(){const _0x36e19a=_0x42a407;return VisuMZ[_0x36e19a(0x354)]['Settings'][_0x36e19a(0x3ca)][_0x36e19a(0x2e1)];},Window_SkillType[_0x42a407(0x35e)][_0x42a407(0x2ff)]=function(_0xd0dadd){const _0x287147=_0x42a407;if(_0xd0dadd<0x0)return _0x287147(0x2c5);const _0xe004ef=this[_0x287147(0x243)]();if(_0xe004ef!=='auto')return _0xe004ef;else{if(this[_0x287147(0x1e1)]()>0x0){const _0x537319=this['commandName'](_0xd0dadd);if(_0x537319['match'](/\\I\[(\d+)\]/i)){const _0x20bca9=this[_0x287147(0x336)](_0xd0dadd),_0x3115c6=this[_0x287147(0x2b8)](_0x537319)['width'];return _0x3115c6<=_0x20bca9['width']?'iconText':_0x287147(0x2e6);}}}return'text';},Window_SkillType[_0x42a407(0x35e)][_0x42a407(0x249)]=function(_0x1ba799){const _0x53a49e=_0x42a407,_0x44bd18=this[_0x53a49e(0x336)](_0x1ba799),_0x1a5c57=this[_0x53a49e(0x324)](_0x1ba799),_0x5be0b1=this[_0x53a49e(0x2b8)](_0x1a5c57)[_0x53a49e(0x4c6)];this[_0x53a49e(0x4b8)](this[_0x53a49e(0x235)](_0x1ba799));const _0x11bbb7=this[_0x53a49e(0x3b5)]();if(_0x11bbb7==='right')this[_0x53a49e(0x26d)](_0x1a5c57,_0x44bd18['x']+_0x44bd18[_0x53a49e(0x4c6)]-_0x5be0b1,_0x44bd18['y'],_0x5be0b1);else{if(_0x11bbb7==='center'){const _0x37ec6b=_0x44bd18['x']+Math[_0x53a49e(0x2ed)]((_0x44bd18[_0x53a49e(0x4c6)]-_0x5be0b1)/0x2);this['drawTextEx'](_0x1a5c57,_0x37ec6b,_0x44bd18['y'],_0x5be0b1);}else this[_0x53a49e(0x26d)](_0x1a5c57,_0x44bd18['x'],_0x44bd18['y'],_0x5be0b1);}},Window_SkillType['prototype'][_0x42a407(0x486)]=function(_0xd46861){const _0x1f44b1=_0x42a407;this[_0x1f44b1(0x324)](_0xd46861)[_0x1f44b1(0x2f9)](/\\I\[(\d+)\]/i);const _0x593b7d=Number(RegExp['$1'])||0x0,_0x475a2c=this[_0x1f44b1(0x336)](_0xd46861),_0xf84aff=_0x475a2c['x']+Math[_0x1f44b1(0x2ed)]((_0x475a2c[_0x1f44b1(0x4c6)]-ImageManager[_0x1f44b1(0x328)])/0x2),_0x3218d4=_0x475a2c['y']+(_0x475a2c[_0x1f44b1(0x341)]-ImageManager['iconHeight'])/0x2;this[_0x1f44b1(0x448)](_0x593b7d,_0xf84aff,_0x3218d4);},VisuMZ[_0x42a407(0x354)][_0x42a407(0x46d)]=Window_SkillStatus[_0x42a407(0x35e)]['refresh'],Window_SkillStatus[_0x42a407(0x35e)][_0x42a407(0x503)]=function(){const _0x15107b=_0x42a407;VisuMZ[_0x15107b(0x354)]['Window_SkillStatus_refresh'][_0x15107b(0x215)](this);if(this[_0x15107b(0x4fc)])this[_0x15107b(0x47f)]();},Window_SkillStatus['prototype'][_0x42a407(0x47f)]=function(){const _0x46008f=_0x42a407;if(!Imported['VisuMZ_0_CoreEngine'])return;if(!Imported[_0x46008f(0x3bc)])return;const _0x1ded87=this[_0x46008f(0x33f)]();let _0x5b6615=this['colSpacing']()/0x2+0xb4+0xb4+0xb4,_0x99f02c=this['innerWidth']-_0x5b6615-0x2;if(_0x99f02c>=0x12c){const _0x456651=VisuMZ[_0x46008f(0x1e9)]['Settings'][_0x46008f(0x3a4)][_0x46008f(0x294)],_0x19d933=Math[_0x46008f(0x2ed)](_0x99f02c/0x2)-0x18;let _0x489fd7=_0x5b6615,_0x47af4c=Math[_0x46008f(0x2ed)]((this[_0x46008f(0x32e)]-Math[_0x46008f(0x45c)](_0x456651[_0x46008f(0x247)]/0x2)*_0x1ded87)/0x2),_0xec3ffc=0x0;for(const _0x533d95 of _0x456651){this[_0x46008f(0x299)](_0x489fd7,_0x47af4c,_0x19d933,_0x533d95),_0xec3ffc++,_0xec3ffc%0x2===0x0?(_0x489fd7=_0x5b6615,_0x47af4c+=_0x1ded87):_0x489fd7+=_0x19d933+0x18;}}this[_0x46008f(0x4c8)]();},Window_SkillStatus[_0x42a407(0x35e)][_0x42a407(0x299)]=function(_0xe32f2d,_0xb5a7a5,_0x2688dc,_0x22f75e){const _0x14f26f=_0x42a407,_0x163b32=this[_0x14f26f(0x33f)]();this[_0x14f26f(0x4c8)](),this[_0x14f26f(0x3f3)](_0xe32f2d,_0xb5a7a5,_0x2688dc,_0x22f75e,!![]),this['resetTextColor'](),this[_0x14f26f(0x4f3)][_0x14f26f(0x45a)]-=0x8;const _0x323b7b=this[_0x14f26f(0x4fc)][_0x14f26f(0x4f7)](_0x22f75e,!![]);this[_0x14f26f(0x4f3)][_0x14f26f(0x393)](_0x323b7b,_0xe32f2d,_0xb5a7a5,_0x2688dc,_0x163b32,_0x14f26f(0x2ea));},VisuMZ['SkillsStatesCore'][_0x42a407(0x321)]=Window_SkillList[_0x42a407(0x35e)]['includes'],Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x33a)]=function(_0x551704){const _0x7d0d48=_0x42a407;if(this[_0x7d0d48(0x409)]<=0x0)return![];return this[_0x7d0d48(0x331)](_0x551704);},VisuMZ[_0x42a407(0x354)]['Window_SkillList_maxCols']=Window_SkillList[_0x42a407(0x35e)]['maxCols'],Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x2d7)]=function(){const _0x3207e9=_0x42a407;return SceneManager[_0x3207e9(0x2c6)][_0x3207e9(0x28e)]===Scene_Battle?VisuMZ['SkillsStatesCore']['Window_SkillList_maxCols'][_0x3207e9(0x215)](this):VisuMZ[_0x3207e9(0x354)][_0x3207e9(0x4c4)][_0x3207e9(0x3ca)]['ListWindowCols'];},VisuMZ[_0x42a407(0x354)][_0x42a407(0x423)]=Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x39e)],Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x39e)]=function(_0x19563f){const _0x45123a=_0x42a407,_0x38af00=this[_0x45123a(0x4fc)]!==_0x19563f;VisuMZ['SkillsStatesCore'][_0x45123a(0x423)][_0x45123a(0x215)](this,_0x19563f),_0x38af00&&(this[_0x45123a(0x2b1)]&&this[_0x45123a(0x2b1)]['constructor']===Window_ShopStatus&&this['_statusWindow']['setItem'](this[_0x45123a(0x21e)](0x0)));},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x3b8)]=function(_0x189407){const _0x378adb=_0x42a407;if(this['_stypeId']===_0x189407)return;if(!_0x189407)return;this[_0x378adb(0x409)]=_0x189407,this[_0x378adb(0x503)](),this['scrollTo'](0x0,0x0),this[_0x378adb(0x2b1)]&&this[_0x378adb(0x2b1)][_0x378adb(0x28e)]===Window_ShopStatus&&this[_0x378adb(0x2b1)][_0x378adb(0x350)](this[_0x378adb(0x21e)](0x0));},Window_SkillList[_0x42a407(0x35e)]['includesSkillsStatesCore']=function(_0x33e5b6){const _0x36c642=_0x42a407;if(!_0x33e5b6)return VisuMZ[_0x36c642(0x354)]['Window_SkillList_includes'][_0x36c642(0x215)](this,_0x33e5b6);if(!this[_0x36c642(0x2d0)](_0x33e5b6))return![];if(!this[_0x36c642(0x23b)](_0x33e5b6))return![];if(!this[_0x36c642(0x362)](_0x33e5b6))return![];return!![];},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x2d0)]=function(_0x1e2d36){const _0x55e3c9=_0x42a407;return DataManager['getSkillTypes'](_0x1e2d36)[_0x55e3c9(0x33a)](this['_stypeId']);},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x23b)]=function(_0x2925a8){const _0x32e106=_0x42a407;if(!VisuMZ['SkillsStatesCore'][_0x32e106(0x40a)](this[_0x32e106(0x4fc)],_0x2925a8))return![];if(!VisuMZ[_0x32e106(0x354)][_0x32e106(0x473)](this[_0x32e106(0x4fc)],_0x2925a8))return![];if(!VisuMZ[_0x32e106(0x354)]['CheckVisibleSkillNotetags'](this['_actor'],_0x2925a8))return![];return!![];},VisuMZ[_0x42a407(0x354)]['CheckVisibleBattleNotetags']=function(_0x519838,_0x3c71f2){const _0x2c3d99=_0x42a407,_0x3e60fd=_0x3c71f2[_0x2c3d99(0x382)];if(_0x3e60fd[_0x2c3d99(0x2f9)](/<HIDE IN BATTLE>/i)&&$gameParty[_0x2c3d99(0x310)]())return![];else return _0x3e60fd[_0x2c3d99(0x2f9)](/<HIDE OUTSIDE BATTLE>/i)&&!$gameParty[_0x2c3d99(0x310)]()?![]:!![];},VisuMZ[_0x42a407(0x354)][_0x42a407(0x473)]=function(_0x4290aa,_0x52bb74){const _0x453c46=_0x42a407,_0x509cf9=_0x52bb74[_0x453c46(0x382)];if(_0x509cf9[_0x453c46(0x2f9)](/<SHOW[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3fbf70=JSON[_0x453c46(0x1de)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x3eb933 of _0x3fbf70){if(!$gameSwitches[_0x453c46(0x353)](_0x3eb933))return![];}return!![];}if(_0x509cf9[_0x453c46(0x2f9)](/<SHOW ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x4bc668=JSON[_0x453c46(0x1de)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x19504e of _0x4bc668){if(!$gameSwitches[_0x453c46(0x353)](_0x19504e))return![];}return!![];}if(_0x509cf9[_0x453c46(0x2f9)](/<SHOW ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x433822=JSON[_0x453c46(0x1de)]('['+RegExp['$1'][_0x453c46(0x2f9)](/\d+/g)+']');for(const _0x433cd1 of _0x433822){if($gameSwitches[_0x453c46(0x353)](_0x433cd1))return!![];}return![];}if(_0x509cf9[_0x453c46(0x2f9)](/<HIDE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x53ca56=JSON[_0x453c46(0x1de)]('['+RegExp['$1'][_0x453c46(0x2f9)](/\d+/g)+']');for(const _0x23c36b of _0x53ca56){if(!$gameSwitches[_0x453c46(0x353)](_0x23c36b))return!![];}return![];}if(_0x509cf9[_0x453c46(0x2f9)](/<HIDE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x35a897=JSON[_0x453c46(0x1de)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0xa7efd0 of _0x35a897){if(!$gameSwitches[_0x453c46(0x353)](_0xa7efd0))return!![];}return![];}if(_0x509cf9[_0x453c46(0x2f9)](/<HIDE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2a0511=JSON[_0x453c46(0x1de)]('['+RegExp['$1'][_0x453c46(0x2f9)](/\d+/g)+']');for(const _0x1c277c of _0x2a0511){if($gameSwitches[_0x453c46(0x353)](_0x1c277c))return![];}return!![];}return!![];},VisuMZ[_0x42a407(0x354)][_0x42a407(0x2cd)]=function(_0x2bdc7a,_0x3ad71c){const _0xa9938=_0x42a407,_0x30f018=_0x3ad71c[_0xa9938(0x382)];if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF LEARNED[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x295cb1=JSON[_0xa9938(0x1de)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x2f120b of _0x295cb1){if(!_0x2bdc7a[_0xa9938(0x232)](_0x2f120b))return![];}return!![];}else{if(_0x30f018['match'](/<SHOW IF LEARNED[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x41532c=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x3ba08d of _0x41532c){const _0x26239a=DataManager[_0xa9938(0x502)](_0x3ba08d);if(!_0x26239a)continue;if(!_0x2bdc7a['isLearnedSkill'](_0x26239a))return![];}return!![];}}if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1ab6f2=JSON[_0xa9938(0x1de)]('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x16032a of _0x1ab6f2){if(!_0x2bdc7a[_0xa9938(0x232)](_0x16032a))return![];}return!![];}else{if(_0x30f018['match'](/<SHOW IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0xa3c1a1=RegExp['$1']['split'](',');for(const _0x3ce92a of _0xa3c1a1){const _0x112a2f=DataManager['getSkillIdWithName'](_0x3ce92a);if(!_0x112a2f)continue;if(!_0x2bdc7a[_0xa9938(0x232)](_0x112a2f))return![];}return!![];}}if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x31f39b=JSON[_0xa9938(0x1de)]('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x237158 of _0x31f39b){if(_0x2bdc7a[_0xa9938(0x232)](_0x237158))return!![];}return![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x3de7f4=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x150e66 of _0x3de7f4){const _0x185401=DataManager['getSkillIdWithName'](_0x150e66);if(!_0x185401)continue;if(_0x2bdc7a[_0xa9938(0x232)](_0x185401))return!![];}return![];}}if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF LEARNED[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x353a2e=JSON['parse']('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x221373 of _0x353a2e){if(!_0x2bdc7a[_0xa9938(0x232)](_0x221373))return!![];}return![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF LEARNED[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x3e3271=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x19f092 of _0x3e3271){const _0x3c1069=DataManager[_0xa9938(0x502)](_0x19f092);if(!_0x3c1069)continue;if(!_0x2bdc7a[_0xa9938(0x232)](_0x3c1069))return!![];}return![];}}if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3823f7=JSON[_0xa9938(0x1de)]('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x52355d of _0x3823f7){if(!_0x2bdc7a[_0xa9938(0x232)](_0x52355d))return!![];}return![];}else{if(_0x30f018['match'](/<HIDE IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x553786=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x340d5b of _0x553786){const _0x36e0d1=DataManager[_0xa9938(0x502)](_0x340d5b);if(!_0x36e0d1)continue;if(!_0x2bdc7a['isLearnedSkill'](_0x36e0d1))return!![];}return![];}}if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x892759=JSON[_0xa9938(0x1de)]('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x40d93e of _0x892759){if(_0x2bdc7a['isLearnedSkill'](_0x40d93e))return![];}return!![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x3c7263=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x13f71f of _0x3c7263){const _0x106d8f=DataManager[_0xa9938(0x502)](_0x13f71f);if(!_0x106d8f)continue;if(_0x2bdc7a[_0xa9938(0x232)](_0x106d8f))return![];}return!![];}}if(_0x30f018['match'](/<SHOW IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3a23a5=JSON['parse']('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x1e19d1 of _0x3a23a5){if(!_0x2bdc7a[_0xa9938(0x4a3)](_0x1e19d1))return![];}return!![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x2fb867=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x1b63dd of _0x2fb867){const _0x5e83b0=DataManager[_0xa9938(0x502)](_0x1b63dd);if(!_0x5e83b0)continue;if(!_0x2bdc7a['hasSkill'](_0x5e83b0))return![];}return!![];}}if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x536b01=JSON[_0xa9938(0x1de)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x38beee of _0x536b01){if(!_0x2bdc7a[_0xa9938(0x4a3)](_0x38beee))return![];}return!![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x4d9083=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x210e85 of _0x4d9083){const _0x1f356b=DataManager[_0xa9938(0x502)](_0x210e85);if(!_0x1f356b)continue;if(!_0x2bdc7a[_0xa9938(0x4a3)](_0x1f356b))return![];}return!![];}}if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1a93bf=JSON[_0xa9938(0x1de)]('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x19d7c3 of _0x1a93bf){if(_0x2bdc7a[_0xa9938(0x4a3)](_0x19d7c3))return!![];}return![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<SHOW IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x4664ea=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x59a442 of _0x4664ea){const _0x35d527=DataManager[_0xa9938(0x502)](_0x59a442);if(!_0x35d527)continue;if(_0x2bdc7a[_0xa9938(0x4a3)](_0x35d527))return!![];}return![];}}if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x52329f=JSON[_0xa9938(0x1de)]('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x3c8799 of _0x52329f){if(!_0x2bdc7a[_0xa9938(0x4a3)](_0x3c8799))return!![];}return![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x4d8d31=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x29da91 of _0x4d8d31){const _0x459570=DataManager[_0xa9938(0x502)](_0x29da91);if(!_0x459570)continue;if(!_0x2bdc7a['hasSkill'](_0x459570))return!![];}return![];}}if(_0x30f018['match'](/<HIDE IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1d3849=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x4a7083 of _0x1d3849){if(!_0x2bdc7a['hasSkill'](_0x4a7083))return!![];}return![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x8a9ef4=RegExp['$1']['split'](',');for(const _0x57e67e of _0x8a9ef4){const _0x45ed1b=DataManager['getSkillIdWithName'](_0x57e67e);if(!_0x45ed1b)continue;if(!_0x2bdc7a[_0xa9938(0x4a3)](_0x45ed1b))return!![];}return![];}}if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1a2e90=JSON[_0xa9938(0x1de)]('['+RegExp['$1'][_0xa9938(0x2f9)](/\d+/g)+']');for(const _0x5e40c2 of _0x1a2e90){if(_0x2bdc7a[_0xa9938(0x4a3)](_0x5e40c2))return![];}return!![];}else{if(_0x30f018[_0xa9938(0x2f9)](/<HIDE IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x18adeb=RegExp['$1'][_0xa9938(0x3bf)](',');for(const _0x3f831f of _0x18adeb){const _0x430315=DataManager['getSkillIdWithName'](_0x3f831f);if(!_0x430315)continue;if(_0x2bdc7a[_0xa9938(0x4a3)](_0x430315))return![];}return!![];}}return!![];},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x362)]=function(_0x97deb4){const _0x57d1a3=_0x42a407,_0x4baa5f=_0x97deb4[_0x57d1a3(0x382)],_0x4811fb=VisuMZ[_0x57d1a3(0x354)]['skillVisibleJS'];return _0x4811fb[_0x97deb4['id']]?_0x4811fb[_0x97deb4['id']][_0x57d1a3(0x215)](this,_0x97deb4):!![];},VisuMZ[_0x42a407(0x354)][_0x42a407(0x4b2)]=Window_SkillList['prototype'][_0x42a407(0x1d7)],Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x1d7)]=function(){const _0x41db0a=_0x42a407;VisuMZ[_0x41db0a(0x354)][_0x41db0a(0x4b2)][_0x41db0a(0x215)](this),this[_0x41db0a(0x3b9)]()&&this['sortSkillList'](),this['canChangeSkillsThroughStateEffects']()&&this[_0x41db0a(0x4cc)]();},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x3b9)]=function(){return!![];},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x4fa)]=function(){const _0x1b6ba8=_0x42a407,_0x55b63f=VisuMZ[_0x1b6ba8(0x354)]['Settings']['Skills'][_0x1b6ba8(0x281)]||[];return _0x55b63f&&_0x55b63f['includes'](this[_0x1b6ba8(0x409)])?this[_0x1b6ba8(0x3cc)]['sort']((_0x5eaa50,_0x3681cd)=>{const _0x308fa8=_0x1b6ba8;if(!!_0x5eaa50&&!!_0x3681cd)return _0x5eaa50[_0x308fa8(0x425)]['localeCompare'](_0x3681cd[_0x308fa8(0x425)]);return 0x0;}):VisuMZ[_0x1b6ba8(0x354)]['SortByIDandPriority'](this[_0x1b6ba8(0x3cc)]),this[_0x1b6ba8(0x3cc)];},VisuMZ['SkillsStatesCore'][_0x42a407(0x37c)]=function(_0x8a14fb){return _0x8a14fb['sort']((_0x450936,_0x45fd16)=>{const _0xe83cc9=_0x3e38;if(!!_0x450936&&!!_0x45fd16){if(_0x450936[_0xe83cc9(0x469)]===undefined)VisuMZ[_0xe83cc9(0x354)][_0xe83cc9(0x208)](_0x450936);if(_0x45fd16[_0xe83cc9(0x469)]===undefined)VisuMZ['SkillsStatesCore']['Parse_Notetags_Skill_Sorting'](_0x45fd16);const _0x2cf5e7=_0x450936['sortPriority'],_0x37f9ad=_0x45fd16[_0xe83cc9(0x469)];if(_0x2cf5e7!==_0x37f9ad)return _0x37f9ad-_0x2cf5e7;return _0x450936['id']-_0x45fd16['id'];}return 0x0;}),_0x8a14fb;},VisuMZ[_0x42a407(0x354)][_0x42a407(0x22d)]=function(_0x4073d4){return _0x4073d4['sort']((_0x27e58f,_0x2fb17c)=>{const _0xfe489b=_0x3e38,_0x233c63=$dataSkills[_0x27e58f],_0x206ff3=$dataSkills[_0x2fb17c];if(!!_0x233c63&&!!_0x206ff3){if(_0x233c63[_0xfe489b(0x469)]===undefined)VisuMZ[_0xfe489b(0x354)][_0xfe489b(0x208)](_0x233c63);if(_0x206ff3[_0xfe489b(0x469)]===undefined)VisuMZ[_0xfe489b(0x354)][_0xfe489b(0x208)](_0x206ff3);const _0xe6349e=_0x233c63[_0xfe489b(0x469)],_0xc7183c=_0x206ff3[_0xfe489b(0x469)];if(_0xe6349e!==_0xc7183c)return _0xc7183c-_0xe6349e;return _0x27e58f-_0x2fb17c;}return 0x0;}),_0x4073d4;},Window_SkillList[_0x42a407(0x35e)]['canChangeSkillsThroughStateEffects']=function(){const _0x463f3c=_0x42a407;if(!this[_0x463f3c(0x4fc)])return![];if([_0x463f3c(0x284),_0x463f3c(0x4aa),_0x463f3c(0x1ec)][_0x463f3c(0x33a)](this['_stypeId']))return![];return!![];},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x4cc)]=function(){const _0x4824c6=_0x42a407,_0x196150=this[_0x4824c6(0x4fc)]['states']();for(const _0x5b1a09 of _0x196150){const _0x404c8a=DataManager[_0x4824c6(0x2f0)](_0x5b1a09);for(const _0x346a0c in _0x404c8a){const _0x37bfc6=$dataSkills[Number(_0x346a0c)]||null,_0x48b696=$dataSkills[Number(_0x404c8a[_0x346a0c])]||null;while(this['_data'][_0x4824c6(0x33a)](_0x37bfc6)){const _0x162956=this[_0x4824c6(0x3cc)]['indexOf'](_0x37bfc6);this['_data'][_0x162956]=_0x48b696;}}}},VisuMZ['SkillsStatesCore'][_0x42a407(0x3df)]=Window_SkillList['prototype']['drawItem'],Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x422)]=function(_0x35d96c){const _0xf7f660=_0x42a407,_0x1398c3=this[_0xf7f660(0x21e)](_0x35d96c),_0x192719=_0x1398c3?_0x1398c3['name']:'';if(_0x1398c3)this['alterSkillName'](_0x1398c3);DataManager[_0xf7f660(0x442)](_0x1398c3)&&this[_0xf7f660(0x4fc)]&&this[_0xf7f660(0x4fc)][_0xf7f660(0x2ac)](_0x1398c3)&&(this[_0xf7f660(0x1fd)]=!![]);VisuMZ[_0xf7f660(0x354)][_0xf7f660(0x3df)][_0xf7f660(0x215)](this,_0x35d96c),this[_0xf7f660(0x1fd)]=undefined;if(_0x1398c3)_0x1398c3[_0xf7f660(0x425)]=_0x192719;},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x2a6)]=function(_0x2da212){const _0x17e378=_0x42a407;if(_0x2da212&&_0x2da212[_0x17e378(0x382)][_0x17e378(0x2f9)](/<LIST NAME:[ ](.*)>/i)){_0x2da212[_0x17e378(0x425)]=String(RegExp['$1'])[_0x17e378(0x45d)]();for(;;){if(_0x2da212[_0x17e378(0x425)][_0x17e378(0x2f9)](/\\V\[(\d+)\]/gi))_0x2da212[_0x17e378(0x425)]=_0x2da212[_0x17e378(0x425)][_0x17e378(0x300)](/\\V\[(\d+)\]/gi,(_0xe3a5cc,_0x36bc13)=>$gameVariables['value'](parseInt(_0x36bc13)));else break;}}},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x41f)]=function(_0x46cb4c,_0x5d6d0e,_0x3f2de5,_0x196ae3){const _0x481360=_0x42a407;Window_Base[_0x481360(0x35e)][_0x481360(0x41f)]['call'](this,this['_actor'],_0x46cb4c,_0x5d6d0e,_0x3f2de5,_0x196ae3);},Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x4d0)]=function(_0x32e77b){this['_statusWindow']=_0x32e77b,this['callUpdateHelp']();},VisuMZ[_0x42a407(0x354)][_0x42a407(0x3d3)]=Window_SkillList[_0x42a407(0x35e)]['updateHelp'],Window_SkillList[_0x42a407(0x35e)][_0x42a407(0x297)]=function(){const _0x13c8ac=_0x42a407;VisuMZ[_0x13c8ac(0x354)][_0x13c8ac(0x3d3)][_0x13c8ac(0x215)](this),this['_statusWindow']&&this[_0x13c8ac(0x2b1)][_0x13c8ac(0x28e)]===Window_ShopStatus&&this[_0x13c8ac(0x2b1)][_0x13c8ac(0x350)](this[_0x13c8ac(0x2eb)]());};function _0x5b59(){const _0x1da8c3=['KnownList','drawSkillCost','allSwitchOn','stypeId','drawItem','Window_SkillList_setActor','Sprite_StateIcon_loadBitmap','name','PassiveStates','action','stateExpireJS','ParseSkillNotetags','DataOffsetX','States','VisuMZ_3_EvoMatrixSkills','Gauge','isSkillTypeMatchForUse','forgetSkill','_cache_CheckBypassRemoveStatesByDamage','3380328rvfrac','CalcJS','stateEraseJS','Scene_Boot_onDatabaseLoaded','MAT','STRUCT','applyStateTurnManipulationEffects','344685XvoQCs','recoverAll','ARRAYJSON','_shopStatusWindow','index','ANY','getStateOriginByKey','ColorBuff','[ON]','placeExactGauge','isToggleSkill','buttonAssistSwitch','getStateReapplyRulings','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','menuActor','Armor-%1-%2','drawIcon','state','_skillChangesFromState','getPassiveStateConditionClassesData','hasState','_stateDisplay','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20enabled\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20enabled;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','MaxTurns','getPassiveStatesFromObj','LearnedChainSkill','removeStatesByCategory','checkCacheKey','gaugeRate','stateTpSlipHealJS','ARRAYSTRUCT','makeCommandList','ColorPositive','decreaseBuff','fontSize','ParseStateNotetags','ceil','trim','StateTurnsEnemyChangeBy','Parse_Notetags_State_ApplyRemoveLeaveJS','shopStatusWindowRect','isStateCategoryResisted','buff','Game_Action_applyItemUserEffect','\x5cFS[22]\x5cC[8][OFF]','actor','rgba(0,\x200,\x200,\x200)','NEGATIVE','onEraseStateGlobalJS','sortPriority','12SHirkf','828RXEfZq','aliveMembers','Window_SkillStatus_refresh','isMaxDebuffAffected','_bypassRemoveStateDamage_value','_checkingPassiveStates','onAddStateMakeCustomSlipValues','AutoAddState','CheckVisibleSwitchNotetags','filter','bitmap','drawActorIconsAllTurnCounters','_colorCache','CmdTextAlign','isPassiveStateStackable','number','anySwitchOff','VisuMZ_4_SkillContainers','innerWidth','multiclasses','drawExtendedSkillsStatesCoreStatus','isDebuffAffected','clearStateDisplay','changeOutlineColor','updatedLayoutStyle','onExpireDebuff','initMembersSkillsStatesCore','drawItemStyleIcon','drawActorBuffTurns','mainFontFace','gaugeColor2','_cache_getPassiveStatesFromObj','#%1','center','_stypeIDs','Buffs','stateMpSlipDamageJS','Game_Actor_skillTypes','9fEpQlZ','clamp','clearAllStateOrigins','boxWidth','retrieveStateColor','add','calcWindowHeight','setStateRetainType','Game_BattlerBase_meetsSkillConditions','isUseModernControls','EvoMatrixSkills','mpDamage','ItemConcoctSkills','SkillSceneStatusBgType','anchor','SkillConditionJS','attacker','round','hasSkill','Game_BattlerBase_decreaseBuff','battleMembers','onChange','isValid','_battler','Game_BattlerBase_resetStateCounts','equipBattleSkills','isEnemy','MatchLabelColor','InputComboSkills','Scene_Skill_onItemOk_Toggle','Game_Battler_onBattleEnd','StateTurnsActorChangeTo','STR','Window_SkillList_makeItemList','resetStateCounts','defaultToggleSkillSetting','parameters','IconStypeNorm','StateID','changePaintOpacity','stateId','onExpireStateGlobalJS','Sprite_Gauge_gaugeRate','removeByDamage','isAppeared','ForceList','CheckBypassRemoveStatesByDamage','SkillID','GroupDigits','20saXgYH','Game_BattlerBase_initMembers','Settings','outlineColor','width','MeetsAuraStateConditions','resetFontSettings','currentValue','VisuMZ_1_ItemsEquipsCore','description','changeSkillsThroughStateEffects','addChild','ToggleType','getCurrentStateActiveUser','setStatusWindow','setStateTurns','Game_BattlerBase_refresh','resetTextColor','isStateResist','windowPadding','AURA_SYSTEM_ENABLED','stateMaximumTurns','sort','currentMaxValueSkillsStatesCore','Toggle','statusWidth','Sprite_Gauge_initMembers','_stored_state-%1-color','multiClass','_cache_isToggleSkill','enemy','_categoryWindow','isPartyAllAffectedByGroupDefeatStates','isAllDead','onExpireBuff','addStateTurns','EnemyIndex','onEraseDebuff','BattleHiddenSkillTypes','Scene_Skill_itemWindowRect','regenerateAllSkillsStatesCore','GaugeCurrentJS','removeStatesAuto','Game_Player_refresh','_prevPassiveJsCounter','categories','stateHpSlipHealJS','getAuraPassiveStatesFromObj','LabelOutlineSolid','contents','uiInputPosition','commandNameWindowCenter','allBattleMembers','paramValueByName','_phase','setDebuffTurns','sortSkillList','TextJS','_actor','labelFontSize','\x0a\x20\x20\x20\x20\x20\x20\x20\x20let\x20%2\x20=\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20origin\x20=\x20this.getStateOrigin(stateId);\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20state\x20=\x20$dataStates[stateId];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20%2\x20=\x20Math.round(Math.max(0,\x20%2)\x20*\x20%3);\x0a\x20\x20\x20\x20\x20\x20\x20\x20this.setStateData(stateId,\x20\x27%4\x27,\x20%2);\x0a\x20\x20\x20\x20','setStateData','Sprite_Gauge_redraw','_costSettings','getSkillIdWithName','refresh','GaugeMaxJS','Game_Actor_learnSkill','makeItemList','Game_Battler_addState','process_VisuMZ_SkillsStatesCore_State_Notetags','_animationIndex','_currentTroopUniqueID','updateVisibility','Window_StatusBase_drawActorIcons','parse','BattleManager_endAction','LabelFontMainType','maxItems','Weapon-%1-%2','StackDebuffMax','setupSkillsStatesCore','checkSkillConditionsSwitchNotetags','VisuMZ_3_ItemThrowSkills','push','labelOutlineColor','CoreEngine','_stateRetainType','test','equipPassives','onAddBuffJS','Game_Actor_forgetSkill','onItemOk','ShowTurns','totalStateCategoryAffected','_stored_debuffColor','Window_Base_changeTextColor','onAddBuffGlobalJS','makeSuccess','onAddDebuff','_turnDisplaySprite','currentDisplayedValue','exit','helpAreaHeight','applyStateCategoryRemovalEffects','HiddenSkillTypes','_toggleSkillColor','PayJS','createAllSkillCostText','AmplifyWith','Item-%1-%2','clearStateOrigin','updateTurnDisplaySprite','addCommand','skillEnableJS','stateHpSlipDamageJS','valueFontSize','Parse_Notetags_Skill_Sorting','gainSilentTp','autoRemovalTiming','getColorDataFromPluginParameters','ParseClassIDs','DataOffsetY','Game_BattlerBase_die','meetsPassiveStateConditionClasses','requestFauxAnimation','convertTargetToStateOriginKey','gainMp','process_VisuMZ_SkillsStatesCore_Notetags','addWindow','call','_bypassRemoveStateDamage_action','Window_Base_createAllSkillCostText_Toggle','Enemy','66asHoTs','frameCount','CanThrowType','uiHelpPosition','groupDefeat','itemAt','Game_BattlerBase_eraseBuff','Scene_Skill_createItemWindow','171402RBaxZr','target','bypassRemoveStatesByDamage','KnownListRange','ARRAYFUNC','clearStatesWithStateRetain','maxTurns','stateTurns','_itemWindow','animationId','onAddState','createItemWindow','SortByIDandPriorityUsingIDs','toggleOn','Game_BattlerBase_states','RegExp','traitsSet','isLearnedSkill','recalculateSlipDamageJS','_cache_getAuraPassiveStatesFromObj','isCommandEnabled','_lastStatesActionEndFrameCount','Game_BattlerBase_clearStates','paySkillCost','Game_Action_executeHpDamage_bypassStateDmgRemoval','loadBitmap','checkShowHideNotetags','isUserBypassRemoveStatesByDamage','addNewState','getSkillTypes','toLowerCase','eraseState','enemyId','greater','commandStyle','ValueOutlineSolid','reset','drawActorBuffRates','length','currentMaxValue','drawItemStyleIconText','restriction','actorId','stateData','buffColor','AGI','statesByCategory','isSkillCostShown','ToggleOnTextColor','MeetsAuraObjConditions','redrawSkillsStatesCore','setBuffTurns','Sprite_Gauge_currentMaxValue','placeGauge','Game_BattlerBase_meetsSkillConditions_Toggle','SkillSceneAdjustSkillList','Game_Variables_onChange','shopStatusWidth','Game_Troop_setup','PassiveConditionJS','applySkillsStatesCoreEffects','ATK','process_VisuMZ_SkillsStatesCore_CheckForAuras','concat','Scene_Skill_skillTypeWindowRect','VisuMZ_1_ElementStatusCore','_cache_getPassiveStateConditionSwitchData','setup','refreshAllMembers','executeHpDamage','ColorDebuff','TurnOffsetX','drawActorStateData','deathStateId','rgba(0,\x200,\x200,\x201)','VisuMZ_0_CoreEngine','drawTextEx','checkSkillConditionsNotetags','totalStateCategory','miasmaStateIDs','Skill-%1-%2','clearStateRetainType','addPassiveStatesByPluginParameters','skillTpCost','Sprite_Gauge_currentValue','paramBuffRate','tpCost','applyBuffTurnManipulationEffects','_tempActor','ParseSkillChangessIntoData','ReapplyRules','onEraseBuffGlobalJS','8623937myCfnv','_buffTurns','DEF','_subject','SortSkillTypesAbc','ToggleOffAnimationID','slipHp','skillLearn','Scene_Skill_helpWindowRect','_bypassRemoveStateDamage_user','getCurrentStateOriginKey','prepareResetStateCounts','meetsSkillConditions','FieldSkills','VisuMZ_3_FieldSkills','hasStateCategory','EVAL','constructor','isConfused','currentClass','lineHeight','Game_Battler_addBuff','ignore','DisplayedParams','_checkingVisuMzPassiveStateObjects','priority','updateHelp','LearnedMatrix','drawExtendedParameter','onSkillToggle','Game_Unit_isAllDead','Game_Switches_onChange','hpDamage','ALL','isActor','Enemy-%1-%2','addState','removeOtherStatesOfSameCategory','setPassiveStateSlipDamageJS','isStateRestrict','return\x200','alterSkillName','valueOutlineWidth','ActionEndUpdate','_skillWindow','MDF','onRemoveState','isSkillToggled','hide','_skills','removeStatesByCategoryAll','overwriteBuffTurns','_statusWindow','_checkingTraitsSetSkillsStatesCore','slipMp','fontBold','skillTypeWindowRect','getClassIdWithName','onDatabaseLoaded','textSizeEx','TurnOffsetY','isUseSkillsStatesCoreUpdatedLayout','Game_BattlerBase_recoverAll','_stateIDs','isPlaytest','RefreshCacheVar','_tempBattler','_passiveStateResults','toggleExclusionGroups','removeState','updateStatesActionEnd','isRightInputMode','text','_scene','Global','skillCostSeparator','_buffs','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','gaugeBackColor','onSkillOk','CheckVisibleSkillNotetags','buffTurns','onExpireBuffGlobalJS','checkSkillTypeMatch','labelOutlineWidth','onAddDebuffJS','onExpireState','process_VisuMZ_SkillsStatesCore_Skill_Notetags','initialize','buffLength','maxCols','\x5cFS[22]\x5cC[0][ON]','ActiveChainSkills','MeetsAuraNoteConditions','debuffColor','getPassiveStateConditionSwitchData','meetsSkillConditionsEnableJS','heal','_cache_getPassiveStateConditionClassesData','addDebuff','CmdStyle','buttonAssistText1','subject','_prevPassiveJsResults','onExpireDebuffGlobalJS','icon','removeBuffsAuto','meetsPassiveStateGlobalConditionJS','die','right','item','isSkillUsableForAutoBattle','floor','8223VLGxVI','makeCurrentTroopUniqueID','getSkillChangesFromState','_stateTurns','applyItemUserEffect','getStypeIdWithName','friendsUnit','Parse_Notetags_State_SlipEffectJS','isMaxBuffAffected','Parse_Notetags_Skill_JS','AvailableChainSkill','match','isStateCategoryAffected','_states','getAuraPassiveStateIDs','TurnEndOnMap','StateTurnsActorChangeBy','commandStyleCheck','replace','VisuMZ_3_ItemAmplifySkills','getStateOrigin','Toggles','ShowShopStatus','allSwitchOff','StateTurnsEnemyChangeTo','_stateData','toUpperCase','meetsPassiveStateConditions','_classIDs','labelFontFace','min','mainFontSize','standardIconWidth','shopStatusWindowRectSkillsStatesCore','inBattle','format','isTargetBypassRemoveStatesByDamage','normalColor','statePassiveConditionJS','createShopStatusWindow','Name','_endingBattle','numberFontFace','isDead','_skillToggle','createTurnDisplaySprite','anySwitchOn','LUK','TurnFontSize','some','AvailableMatrix','Window_SkillList_includes','DataFontSize','skills','commandName','drawActorStateTurns','slice','max','iconWidth','getStateRetainType','drawFullGauge','damage','recover\x20all','ValueFontMainType','innerHeight','convertPassiveStates','Class-%1-%2','includesSkillsStatesCore','SkillMenuStatusRect','%1\x20%2\x20%3','StackBuffMax','_currentActor','itemLineRect','_commandNameWindow','onAddBuff','Game_BattlerBase_buffIconIndex','includes','Game_BattlerBase_isStateResist','passiveStateObjects','addPassiveStatesFromOtherPlugins','stateTpSlipDamageJS','gaugeLineHeight','setBackgroundType','height','\x5cI[%1]%2','<member-%1>','applyDebuffTurnManipulationEffects','hasToggleSkillAntiCheck','onAddStateCustomJS','%1-%2-%3','stateColor','ColorNeutral','iconIndex','toggleOff','Game_Action_testApply','stateAddJS','onExpireStateCustomJS','changeTextColor','setItem','passiveStates','Game_BattlerBase_eraseState','value','SkillsStatesCore','skill','onAddStateGlobalJS','Sprite_StateIcon_updateFrame','createKeyJS','_stateOrigin','_hidden','fontFace','commandNameWindowDrawText','getStateData','prototype','addBuff','setSkillToggle','remove','checkShowHideJS','clear','death','JSON','adjustItemWidthByShopStatus','Actor','allowCreateShopStatusWindow','deadMembers','createPassiveStatesCache','FUNC','onAddStateJS','eraseBuff','playEquip','isStateAddable','ToggleOff','_skillIDs','Window_Base_drawText','labelColor','states','MultiplierJS','skillId','isSceneBattle','Parse_Notetags_State_Category','13473290FTSLFI','makeAdditionalSkillCostText','testApply','SortByIDandPriority','FieldSkill','ForcedMatrix','Game_BattlerBase_traitsSet','iconText','makeResistedStateCategories','note','ActorIDs','statusWindowRectSkillsStatesCore','helpWindowRectSkillsStatesCore','helpAreaTop','Game_Battler_isStateAddable','isGroupDefeatStateAffected','toggleOffLocation','mainCommandWidth','onExpireStateJS','onEraseDebuffGlobalJS','MAXHP','Costs','skillTypes','testSkillStatesCoreNotetags','POSITIVE','setStateOrigin','drawText','learnSkill','slipTp','onBattleEnd','canClearState','user','Turns','valueFontFace','Game_Battler_regenerateAll','mpCost','map','setActor','meetsSkillConditionsGlobalJS','opacity','stateCategoriesResisted','ShowJS','ShowData','Param','_stateMaxTurns','Scene_Skill_statusWindowRect','uiMenuStyle','makeCommandName','Game_BattlerBase_increaseBuff','statusWindowRect','log','onEraseStateCustomJS','_cache','ARRAYEVAL','<enemy-%1>','traitObjects','ParseAllNotetags','addPassiveStates','ValueOutlineWidth','isAlive','itemTextAlign','isBuffAffected','activate','setStypeId','canSortSkillTypeList','version','success','VisuMZ_1_MainMenuCore','VisuMZ_3_ActiveChainSkills','isStateRemoved','split','indexOf','debuffTurns','addAuraPassiveStateIDs','onExpireDebuffJS','Parse_Notetags_State_PassiveJS','initMembers','isStateAffected','useDigitGrouping','registerCommand','Scene_Battle_onSkillOk_Toggle','Skills','members','_data','clearStateData','ForcedChainSkill','_result','valueOutlineColor','[OFF]','usableSkills','Window_SkillList_updateHelp','addPassiveStatesByNotetag','ConvertParams','_skillTypeWindow','isBottomHelpMode','removeBuff','removeStatesByDamage','VisuMZ_2_ClassChangeSystem','LabelOutlineWidth','regenerateAll','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','Game_Unit_deadMembers','Window_SkillList_drawItem','setStateDisplay','updateStateTurns','EnableLayout','stateMpSlipHealJS','skillMpCost','updateCommandNameWindow','getColor','keys','onEraseStateJS','endAction','isSkill','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20visible\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20visible;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','gradientFillRect','magicSkills','ItemThrowSkills','ARRAYSTR','helpWindowRect','Game_BattlerBase_overwriteBuffTurns','allIcons','drawParamText','onEraseBuff','_stored_buffColor','IconStypeMagic','<troop-%1>','addBuffTurns','<actor-%1>','isAutoBattle','skillTypeWindowRectSkillsStatesCore','itemWindowRect','currentValueSkillsStatesCore','getStateDisplay','getStateIdWithName','_cache_toggleExclusionGroups','drawActorIcons','standardIconHeight','\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20origin\x20=\x20this.getStateOrigin(stateId);\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20state\x20=\x20$dataStates[stateId];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this.getCurrentStateActiveUser();\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20','createCommandNameWindow','MAXMP','Window_SkillType_initialize','Game_BattlerBase_skillTpCost','skillVisibleJS','_stypeId','CheckVisibleBattleNotetags','Game_Battler_addDebuff','onAddDebuffGlobalJS','_stateSteps','active','Parse_Notetags_Skill_Cost','getCurrentTroopUniqueID','_prevPassiveJsFrameCount','mainAreaTop','adjustSkillCost','GaugeDrawJS','textColor','357575YDmpao','clearStates','Window_StatusBase_placeGauge','MatchLabelGaugeColor','meetsPassiveStateConditionSwitches','callUpdateHelp','isSkillHidden','updateFrame'];_0x5b59=function(){return _0x1da8c3;};return _0x5b59();}