const { PermissionsBitField, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bane um usuário do servidor.',
    async execute(message, args) {
        // Verifica se o autor da mensagem tem permissão para banir
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription('Você não tem permissão para banir membros!')] });
        }

        // Verifica se o bot tem permissão para banir
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription('Eu não tenho permissão para banir membros!')] });
        }

        const userToBan = message.mentions.users.first();
        if (!userToBan) {
            return message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Yellow).setDescription('Por favor, mencione um usuário para banir.')] });
        }

        const memberToBan = message.guild.members.cache.get(userToBan.id);
        if (!memberToBan) {
            return message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Yellow).setDescription('Esse usuário não está no servidor.')] });
        }

        try {
            await memberToBan.ban();
            message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Green).setDescription(`${userToBan.username} foi banido com sucesso!`)] });
        } catch (error) {
            console.error('Erro ao banir usuário:', error);
            message.channel.send({ embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription('Ocorreu um erro ao tentar banir o usuário.')] });
        }
    }
};
