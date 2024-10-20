const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Mostra o avatar de um usuário.',
    execute(message, args) {
        try {
            const userToShow = message.mentions.users.first() || message.author; // Mostra o avatar do usuário mencionado ou do autor da mensagem
            const avatarUrl = userToShow.displayAvatarURL({ dynamic: true, size: 1024 });

            const embed = new EmbedBuilder()
                .setColor(Colors.Blue) // Usando a constante Colors para definir a cor
                .setTitle(`${userToShow.username}'s Avatar`)
                .setImage(avatarUrl)
                .setFooter({ text: `ID: ${userToShow.id}` });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao mostrar avatar:', error);
            message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription('Ocorreu um erro ao tentar mostrar o avatar.')] });
        }
    }
};
