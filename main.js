'use strict';

/**
 * Retrieve stats for all teams
 */
async function fetchTeamStats() {
    let response = await fetch('https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats');
    
    if (response.status >= 400) {
        console.error(response.status);
        return;
    }

    return await response.json();
}

let statsTable = $('#allStats').DataTable();

(async () => {
    let rawStats = await fetchTeamStats();

    let rows = rawStats.teams.map(team => {
        let stats = team.teamStats[0].splits[0].stat;
        let rankingStats = team.teamStats[0].splits[1].stat;

        return [
            parseInt(rankingStats.pts),
            team.name,
            stats.gamesPlayed,
            stats.wins,
            stats.losses,
            stats.ot,
            stats.pts
        ];
    });

    statsTable.rows.add(rows).draw();
})();