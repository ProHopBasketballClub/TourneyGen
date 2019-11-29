import {Team} from '../models';

export class EloService {

    public static ELO_SCALE_CONST: number = 30;
    public static ELO_INITIAL_VALUE: number = 800;

    public static calculateElo(victor: Team, loser: Team) {
        const elo = {Victor: 0, Loser: 0};

        const P1: number = (1.0 / (1.0 + Math.pow(this.Power10, ((loser.Rating - victor.Rating) / this.Divisor))));
        const P2: number = (1.0 / (1.0 + Math.pow(this.Power10, ((victor.Rating - loser.Rating) / this.Divisor))));

        elo.Victor = victor.Rating + EloService.ELO_SCALE_CONST * (1 - P1);
        elo.Loser = loser.Rating + EloService.ELO_SCALE_CONST * (0 - P2);

        return elo;
    }

    private static Power10: number = 10;
    private static Divisor: number = 400;
}
