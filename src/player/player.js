class Player {
  previousAttacks = [];

  get attackArr() {
    return this.previousAttacks
  }
  
  set attackArr(value) {
    this.previousAttacks.push(value)
  }

  isNew(value) {
    return !this.attackArr.includes(value)
  }

  attack(value) {
    if (this.isNew(value)) {
      this.attackArr = value;
      return value;
    }
    return Error("Tile has already been attacked");
  }
}

export default Player