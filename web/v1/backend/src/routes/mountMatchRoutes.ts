import {MatchController} from '../controllers/match-controller';

export function mountMatchRoutes(router) {
    const controller: MatchController = new MatchController();

    router.put('/api/match/report', (req, res) => {
        controller.reportMatch(req, res)
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                console.log(error);
            });
    });

    router.put('/api/match/resolve', (req, res) => {
        controller.resolveConflict(req, res)
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                console.log(error);
            });
    });
}
