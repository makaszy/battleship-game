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
}

export default Player