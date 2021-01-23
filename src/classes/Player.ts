class Player {
  public pseudo: string;
  public playedCard: string | undefined = undefined;
  public votedCard: string | undefined = undefined;
  public status: 'pending' | 'done' | undefined = undefined;
  public score = 0;

  constructor(pseudo: string) {
    this.pseudo = pseudo;
  }
}

export { Player };
