from IPython.display import Markdown, display

abilities = {
'STR': 0,
'DEX': 1,
'CON': 2,
'INT': 2,
'WIS': 3,
'CHA': 1
}

PROF = 3

proficiencies = { None: 0, 'P': PROF, 'E': 2*PROF } 

def printmd(string):
    display(Markdown(string))
    
def ability_check(skill, ability, prof):
  proficiency = prof or ' '
  bonus = abilities[ability] + proficiencies[prof]
  printmd(f'`[{proficiency}]`{skill} ({ability}) [d20+{bonus}](dice://roll/d20+{bonus})')  

ability_check('Athletics', 'STR', None)
ability_check('Arcana', 'INT', 'P')
ability_check('Arcana', 'INT', 'E')
