$(document).ready(function() {
    // Função para atualizar a UI e salvar no localStorage
    function updateUI() {
        $("#placar").empty();

        const data = JSON.parse(localStorage.getItem('partyData')) || {
            teams: [{ name: 'Equipe 1', points: 0 }, { name: 'Equipe 2', points: 0 }]
        };

        data.teams.forEach((team, index) => {
            const teamBlock = `
                <div class="flex flex-col items-center">
                    <input type="text" id="team-name-${index}" value="${team.name}" class="text-center mb-2 border border-gray-300 rounded-md w-24 p-1 hidden" />
                    <h2 id="team-title-${index}" class="text-2xl font-bold cursor-pointer">${team.name}</h2>
                    <div class="text-4xl font-bold mt-2" id="points-${index}">${team.points}</div>
                    <div class="flex space-x-2 mt-2">
                        <button class="plus px-3 py-1 bg-green-500 text-white rounded-md" data-team="${index}">+</button>
                        <button class="minus px-3 py-1 bg-red-500 text-white rounded-md" data-team="${index}">-</button>
                    </div>
                </div>
            `;
            $("#placar").append(teamBlock);
        });

        // Evento para alterar o nome do time
        $("h2").on('click', function() {
            const index = $(this).attr('id').split('-')[2];
            $(`#team-name-${index}`).removeClass('hidden').focus();
        });

        $("input[type='text']").on('blur keypress', function(e) {
            if (e.type === 'blur' || e.which == 13) { // Enter key ou perder foco
                const index = $(this).attr('id').split('-')[2];
                const name = $(this).val();
                data.teams[index].name = name;
                $(`#team-title-${index}`).text(name);
                $(this).addClass('hidden');
                updateData(data); // Atualizar o localStorage com o nome
            }
        });

        // Botão de somar e subtrair
        $(".plus").on('click', function() {
            const teamIndex = $(this).data('team');
            data.teams[teamIndex].points++;
            checkForWinner(data);
        });

        $(".minus").on('click', function() {
            const teamIndex = $(this).data('team');
            if (data.teams[teamIndex].points > 0) {
                data.teams[teamIndex].points--;
                updateData(data);
            }
        });
    }

    // Função para salvar no localStorage
    function updateData(data) {
        localStorage.setItem('partyData', JSON.stringify(data));
        updateUI(); // Atualiza a interface com as mudanças
    }

    // Função para zerar o jogo
    function resetGame() {
        localStorage.removeItem('partyData');
        updateUI();
    }

    // Função para checar vencedor
    function checkForWinner(data) {
        let winner = null;
        data.teams.forEach(team => {
            if (team.points >= 21) {
                winner = team;
            }
        });

        if (winner) {
            Swal.fire({
                title: `${winner.name} venceu!`,
                html: '<canvas id="confetti"></canvas>',
                confirmButtonText: 'Pular'
            }).then(() => {
                resetGame();
            });

            // Confettis
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            updateData(data); // Se não houver vencedor, apenas atualiza os dados
        }
    }

    // Botão de reset manual
    $("#reset").on('click', function() {
        resetGame();
    });

    // Eventos de teclado
    $(document).on('keydown', function(e) {
        const data = JSON.parse(localStorage.getItem('partyData')) || { teams: [{ name: 'Equipe 1', points: 0 }, { name: 'Equipe 2', points: 0 }] };

        if (e.key === 'ArrowLeft') {
            data.teams[0].points++;
            checkForWinner(data);
        } else if (e.key === 'ArrowRight') {
            data.teams[1].points++;
            checkForWinner(data);
        } else if (e.key === ' ') { // Tecla espaço
            resetGame();
        }
    });

    // Inicializa a UI
    updateUI();
});
