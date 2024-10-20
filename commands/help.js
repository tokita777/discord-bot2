const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Mostra todos os comandos disponíveis.',
    execute(message) {
        try {
            const commands = message.client.commands.map(command => {
                return `**${command.name}**: ${command.description}`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setColor(Colors.Purple) // Usando a constante Colors para definir a cor
                .setTitle('Lista de Comandos')
                .setDescription(commands || 'Nenhum comando disponível.')
                .setFooter({ text: 'Use +! seguido do nome do comando para mais informações!' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao mostrar ajuda:', error);
            message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription('Ocorreu um erro ao tentar mostrar a lista de comandos.')] });
        }
    }
};
