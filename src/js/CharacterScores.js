export class CharacterScores {
  constructor({ abilityScores, paladinLevel, proficiencyBonus, skills, saves }) {
    this.abilityScores = abilityScores;
    this.paladinLevel = paladinLevel;
    this.proficiencyBonus = proficiencyBonus;
    this.skills = skills;
    this.saves = saves;
  }

  abilityModifier(ability) {
    return Math.floor((this.abilityScores[ability] - 10) / 2);
  }

  createProficiency(proficient, multiplier) {
    multiplier ||= 1;
    const symbol = multiplier > 1 ? 'E' : 'P';
    return { symbol: proficient ? symbol : ' ', bonus: (proficient ? 1 : 0) * this.proficiencyBonus * multiplier };
  }
}
